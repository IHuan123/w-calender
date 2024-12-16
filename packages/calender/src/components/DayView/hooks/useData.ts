import { useEffect, useState, useMemo } from 'preact/hooks';
import dayjs from 'dayjs';
import type { ScheduleData } from '@/types/schedule';
import type { RenderTime } from '@wcalender/types/DayView';
import { getReturnTime, isCrossoverTime } from '@/utils/time';
import { ReturnTimeValue } from '@wcalender/types/time';
import { createUniqueId } from '@/utils/common';
import { isEmpty } from '@/utils/is';

/**
 * @zh 处理data数据，数据存在交叉时进行等比排布
 */
function getData(data: ScheduleData): Array<RenderTime> {
  // 按时间进行排序
  data = data.sort((a, b) => {
    return dayjs(a.start).isBefore(b.start) ? -1 : 1;
  });

  return data.map((item) => {
    let start = getReturnTime(item.start),
      end = getReturnTime(item.end);

    let config = {
      title: item.title,
      start: start,
      end: end,
      type: item.type,
      _key: createUniqueId(),
    };
    return config;
  });
}

/**
 * @zh 计算y ,h坐标位置信息
 */
function calculateYAndH(
  start: ReturnTimeValue,
  end: ReturnTimeValue,
  interval: number,
  colHeight: number
) {
  let startTimeValue = start.time.diff(start.time.startOf('day'), 'second');
  let timeValue = end.time.diff(start.time, 'second');
  let y = (startTimeValue / (interval * 60)) * colHeight;
  let h = (timeValue / (interval * 60)) * colHeight;

  return { y, h };
}

/**
 * @zh 计算布局数据
 */
type CalculateRectReturn = Array<
  RenderTime & {
    colIndex: number;
    rect: { x: number; y: number; w: number | string; h: number };
  }
>;

function calculateRect(
  data: Array<RenderTime>,
  interval: number,
  colHeight: number
): CalculateRectReturn {
  let res: CalculateRectReturn = [];
  data.map((item, index) => {
    console.log(item);
    let posiYH = calculateYAndH(item.start, item.end, interval, colHeight);
    let hasCrossoverTime = res.some((cur) =>
      isCrossoverTime([item.start, item.end], [cur.start, cur.end])
    );

    if (isEmpty(res) || !hasCrossoverTime) {
      res.push({
        ...item,
        rect: {
          x: 0,
          ...posiYH,
          w: '100%',
        },
        colIndex: 0,
      });
    } else {
      // --- 问题点 ，如何进行堆放，这里重复添加问题
      for (let i = 0; i < res.length; i++) {
        let cur = res[i];
        let colIndex = cur.colIndex;
        let isCrossover = isCrossoverTime([item.start, item.end], [cur.start, cur.end]);
        if (!isCrossover) {
          res.push({
            ...item,
            rect: {
              x: 0,
              ...posiYH,
              w: '100%',
            },
            colIndex: colIndex,
          });
        }
      }
    }
  });
  return res;
}

export default function useData({
  data,
  interval,
  colHeight,
}: {
  data: ScheduleData;
  interval: number;
  colHeight: number;
}) {
  const [list, setList] = useState<Array<RenderTime>>();

  // 头部列表渲染
  const todayData = useMemo(() => {
    return list?.filter((item) => item.type === 'day') ?? [];
  }, [list]);

  // 列表布局中数据
  const renderData = useMemo(() => {
    return calculateRect(list?.filter((item) => item.type === 'time') ?? [], interval, colHeight);
  }, [list]);

  useEffect(() => {
    setList(getData(data));
  }, [data]);

  return {
    todayData,
    renderData,
  };
}
