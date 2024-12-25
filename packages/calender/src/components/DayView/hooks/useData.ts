import { useEffect, useState, useMemo } from 'preact/hooks';
import dayjs from 'dayjs';
import type { ScheduleData } from '@/types/schedule';
import type { RenderTime } from '@wcalender/types/DayView';
import { getReturnTime, isCrossoverTime } from '@/utils/time';
import { createUniqueId, arrayGroupByValue } from '@/utils/common';
import { isEmpty } from '@/utils/is';

/**
 * @zh 处理data数据，数据存在交叉时进行等比排布
 */
function getData(data: ScheduleData): Array<RenderTime> {
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
 * @zh 布局配置
 * @en Layout configuration
 */
type CalculateRectReturn = Array<
  RenderTime & {
    colIndex: number;
  }
>;

/**
 * 获取data column index
 */
function getDataColIdx(
  item: RenderTime,
  group: {
    totalColumn: number;
    data: CalculateRectReturn;
  }
) {
  let preNextCol = 0;

  let cols = arrayGroupByValue(group.data, 'colIndex').sort((a, b) => {
    return a.groupValue - b.groupValue;
  });
  for (let i = 0; i < cols.length; i++) {
    let { group: col, groupValue: colValue } = cols[i];

    let isCross = col.some(({ start, end }) =>
      isCrossoverTime([item.start, item.end], [start, end])
    );

    if (!isCross) {
      return colValue;
    } else {
      preNextCol += 1;
    }
  }
  return preNextCol;
}

/**
 * @zh 处理数据
 */
function handleGridCols(data: Array<RenderTime>) {
  // 按时间进行排序
  data = data.sort((a, b) => {
    return dayjs(a.start.time).isBefore(b.start.time) ? -1 : 1;
  });
  let groups: Array<{
    totalColumn: number;
    data: CalculateRectReturn;
  }> = [];
  data.map((item) => {
    // 获取配置
    const getConfig = (item: RenderTime, colIndex: number = 0) => {
      return {
        ...item,
        colIndex: colIndex,
      };
    };

    // 获取cols num
    const getColNum = (groupData: CalculateRectReturn) => {
      return Math.max(...groupData.map((item) => item.colIndex)) + 1;
    };

    // 如何为分组为空，则进行添加
    if (isEmpty(groups)) {
      groups.push({
        totalColumn: 1,
        data: [getConfig(item)],
      });
      // 如果存在分组，看是否有两个时间有交叉
    } else {
      let corssGroup = groups.find((group) => {
        return group.data.some((cur) =>
          isCrossoverTime([item.start, item.end], [cur.start, cur.end])
        );
      });

      if (corssGroup) {
        corssGroup.data.push(getConfig(item, getDataColIdx(item, corssGroup)));
        corssGroup.totalColumn = getColNum(corssGroup.data);
      } else {
        groups.push({
          totalColumn: 1,
          data: [getConfig(item)],
        });
      }
    }
  });
  return groups;
}

export default function useData({ data }: { data: ScheduleData }) {
  const [calenderData, setData] = useState<Array<RenderTime>>([]);

  // 头部列表渲染
  const todayData = useMemo(() => {
    return calenderData?.filter((item) => item.type === 'day') ?? [];
  }, [calenderData]);

  // 列表布局中数据
  const renderData = useMemo(() => {
    return handleGridCols(calenderData?.filter((item) => item.type === 'time') ?? []);
  }, [calenderData]);

  useEffect(() => {
    setData(getData(data));
  }, [data]);

  return {
    todayData,
    renderData,
    calenderData,
    setCalenderData: setData,
  };
}
