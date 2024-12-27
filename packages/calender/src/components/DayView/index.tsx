/**
 * @TODO 当前组件需优化
 */
import { ComponentChildren } from 'preact';
import { forwardRef, useEffect, useRef, useMemo } from 'preact/compat';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes, getReturnTime, format } from '@/utils/time';
import { setElementStyle, getTransform, numToPx } from '@/utils/dom';
import { createUniqueId, getMoveDy } from '@/utils/common';
import Header from './Header';
import TimeContent from './TimeContent';
import TimeLine from './TimeLine';
import TimeIndicateLine from './TimeIndicateLine';
import type { DateRange } from '@/types/schedule';
import type { RenderTime, Rect } from '@wcalender/types/DayView';
import { DayViewProps } from '@/types/components';
import GirdBox from './GirdBox';
import useData from './hooks/useData';
import { useElementBounding, useXState, useInteract } from '@/hooks';
import dayjs, { Dayjs } from 'dayjs';
import './style/index.scss';
import { genStyles } from '../_utils';
import { isUndef } from '@/utils/is';

const colH = 42;
const interval = 30;
// const gap = 8;
/**
 * @zh 获取时间列表
 */
function getTimeList(date: DateRange) {
  if (!date) {
    return [];
  }
  const [start, end] = date;
  const startTime = start.time.startOf('day'),
    endTime = end.time.endOf('day');
  return getTimes(startTime, endTime, interval, 'minute');
}

/**
 * @zh 计算时间Y位置
 */
function calculateDistance(start: Dayjs, end: Dayjs, colHeight: number) {
  let timeValue = end.diff(start, 'second');
  return (timeValue / (interval * 60)) * colHeight;
}

/**
 * 计算偏移量转换为时间
 */
function offsetToTimeValue(offset: number) {
  return (interval / colH) * 60 * offset;
}

/**
 * @zh 计算y ,h坐标位置信息
 */
function calculateRect(
  item: RenderTime & {
    colIndex: number;
  },
  totalColumn: number,
  colHeight: number,
  containerWidth: number
) {
  const { start, end, colIndex } = item;
  let x = (colIndex / totalColumn) * containerWidth;
  let y = calculateDistance(start.time.startOf('day'), start.time, colHeight);
  let w = containerWidth / totalColumn;
  let h = calculateDistance(start.time, end.time, colHeight);
  return { x, y, w, h };
}
const getDy = getMoveDy();

type DragConfig = { rect: Rect; data: RenderTime } | null;
function DayView(props: DayViewProps) {
  const layoutContainer = useRef<HTMLDivElement>(null);
  const [timeList, setTimeList] = useXState<TimeList>([]);
  let dragPosition: Rect = { x: 0, y: 0, w: '100%', h: 0 };
  const [dragConfig, setDragConf, getDragState] = useXState<DragConfig>(null);
  const { rect: containerRect, getRect } = useElementBounding(layoutContainer);

  const dragStepNum = useMemo(() => {
    return (colH / interval) * 15;
  }, [colH, interval]);

  // 这里的数据需统一使用store存储
  const { todayData, renderData, calenderData, setCalenderData, getCalenderData } = useData({
    data: props.data,
  });

  /**
   * 拖动时的时间
   */
  const dragTime = useMemo(() => {
    if (isUndef(dragConfig)) return null;
    let start = format(dragConfig.data.start, 'YYYY-MM-DD HH:mm');
    let end = format(dragConfig.data.end, 'YYYY-MM-DD HH:mm');
    return { start, end };
  }, [dragConfig]);

  useEffect(() => {
    let data = getTimeList(props.date);
    setTimeList(data);
  }, [props.date, props.data]);

  /**
   * @zh 开始移动
   */
  function onMoveStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect: { ...dragPosition }, data });
    dragPosition.y = rect.y;
    dragPosition.h = rect.h;
  }

  /**
   * @zh 移动中
   */
  function onMove(event: any, data: RenderTime, rect: Rect) {
    dragPosition.y += event.dy;
    if (dragPosition.y < 0) {
      dragPosition.y = 0;
    }
    let size = getRect();

    if (dragPosition.y + dragPosition.h >= size.height) {
      dragPosition.y = size.height - dragPosition.h;
    }
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      setElementStyle(
        dragEl as HTMLElement,
        getTransform({
          width: '100%',
          height: numToPx(dragPosition.h),
          left: numToPx(0),
          top: numToPx(dragPosition.y),
        })
      );
    }
    handleUpdateData(event, data);
  }

  function onMoveEnd(event: any, data: RenderTime) {
    let dragData = getDragState();
    onChange(dragData?.data as RenderTime);
    setDragConf(null);
  }
  /**
   * @zh resize start
   */
  function onResizeStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect, data });
    dragPosition.h = rect.h;
  }

  function onResize(event: any, data: RenderTime, rect: Rect) {
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      setElementStyle(dragEl as HTMLElement, {
        width: '100%',
        height: numToPx(event.rect.height),
      });
    }
    handleUpdateData(event, data);
  }
  /**
   * @zh 容器大小变更事件
   */
  function onResizeEnd(event: any, data: RenderTime) {
    let dragData = getDragState();
    onChange(dragData?.data as RenderTime);
    setDragConf(null);
  }

  /**
   * @zh 处理数据
   */
  function handleUpdateData(event: any, data: RenderTime) {
    let dragData = { ...data };
    dragData.start = getReturnTime(
      props.date[0].time.add(offsetToTimeValue(dragPosition.y), 'second')
    );
    dragData.end = getReturnTime(
      props.date[0].time.add(offsetToTimeValue(dragPosition.y + event.rect.height), 'second')
    );
    setDragConf({
      rect: { y: dragPosition.y, w: '100%', x: 0, h: event.rect.height },
      data: dragData,
    });
  }

  /**
   * @zh 数据更新事件
   */
  async function onChange(data: RenderTime) {
    updateData(data);
  }

  /**
   * @zh 更新数据
   */
  function updateData(target: RenderTime) {
    let data = [...getCalenderData()];
    let index = data.findIndex((item) => item._key === target._key);
    if (index > -1) {
      data[index] = target;
    } else {
      data = [...data, target];
    }

    setCalenderData(() => data);
    props.onChange({ target: target, data });
  }

  /**
   * @zh 拖拽样式
   */
  const DragBlock = forwardRef<HTMLDivElement, { layout: Rect; children?: ComponentChildren }>(
    ({ layout, children }, ref) => {
      return (
        <div className={cls('drag-block')} style={genStyles(layout)} ref={ref}>
          {children}
        </div>
      );
    }
  );

  /**
   * @zh 添加时间段
   * 这里需要做添加元素的resize操作
   * 自动平均对齐刻度
   */

  const [newCalender, setNewCalender, getNewCalender] = useXState<DragConfig>(null);
  let isTapContainerEle = useRef(false);
  let prevMoveY = 0,
    moveDistanceY = 0,
    scrollTop = useRef(0);

  useInteract(layoutContainer, void 0, void 0, function (ctx) {
    ctx.on('down', function (event) {
      let containerRect = getRect();
      isTapContainerEle.current = event.interactable.target === event.originalEvent.target;
      if (isTapContainerEle.current) {
        const { y } = event;
        let top = y - containerRect.top + scrollTop.current;
        prevMoveY = top;
        console.log('onClickGridLayout down', y, top, offsetToTimeValue(top));

        setNewCalender({
          rect: {
            x: 0,
            y: top,
            w: '100%',
            h: dragStepNum,
          },
          data: {
            title: '添加日程',
            start: getReturnTime(props.date[0].time.add(offsetToTimeValue(top), 'second')),
            end: getReturnTime(props.date[0].time.add(offsetToTimeValue(dragStepNum), 'second')),
            _key: createUniqueId(),
            type: 'time',
          },
        });
      }
    });
    ctx.on('move', function (event) {
      const { y } = event.originalEvent;
      let newConfig = getNewCalender();

      if (isTapContainerEle.current && newConfig) {
        let containerRect = getRect();
        let top = y - containerRect.top + scrollTop.current;
        moveDistanceY = top - prevMoveY;
        prevMoveY = top;

        let dy = getDy(moveDistanceY, dragStepNum);
        if (dy) {
          let h = newConfig.rect.h + dy;
          let rect = {
            ...newConfig.rect,
            h: h,
          };

          setNewCalender({
            rect,
            data: {
              title: newConfig.data.title,
              start: getReturnTime(props.date[0].time.add(offsetToTimeValue(rect.y), 'second')),
              end: getReturnTime(props.date[0].time.add(offsetToTimeValue(rect.y + h), 'second')),
              _key: createUniqueId(),
              type: 'time',
            },
          });
        }
      }
    });
    ctx.on('up', function (event) {
      if (isTapContainerEle.current) {
        let newConfig = getNewCalender();
        if (newConfig) {
          updateData(newConfig.data);
        }

        setNewCalender(null);
        prevMoveY = 0;
        isTapContainerEle.current = false;
      }
    });
  });

  function AddEventComponent({ layout, children }: { layout: Rect; children?: ComponentChildren }) {
    return (
      <div className={cls('add-component')} style={genStyles(layout)}>
        {children}
      </div>
    );
  }

  /**
   * @zh 点击某个日程
   */
  function onTap() {}
  return (
    <div className={cls('day')}>
      <Header data={todayData} />
      <Scrollbar
        hideBar
        className={cls('grid-scrollbar')}
        onScroll={({ scroll }) => {
          scrollTop.current = scroll.scrollTop;
        }}
      >
        <div className={cls('day-grid')} style={{ '--col-h': colH + 'px' }}>
          <TimeLine data={timeList} />
          <div className={cls('day-grid-layout')} ref={layoutContainer}>
            {renderData?.map((group) =>
              group.data.map(({ colIndex, ...config }) => (
                <GirdBox
                  {...calculateRect(
                    { ...config, colIndex },
                    group.totalColumn,
                    colH,
                    containerRect.width
                  )}
                  key={config._key}
                  data={config}
                  colH={colH}
                  interval={interval}
                  onMoveStart={onMoveStart}
                  onMove={onMove}
                  onMoveEnd={onMoveEnd}
                  onResizeStart={onResizeStart}
                  onResizeEnd={onResizeEnd}
                  onResize={onResize}
                  onTap={onTap}
                >
                  {/* 自定义日程卡片，需支持自定义 */}
                  <TimeContent
                    title={`${config.title}-${format(config.start, 'HH:mm')}:${format(config.end, 'HH:mm')}`}
                  />
                </GirdBox>
              ))
            )}

            <TimeIndicateLine top={calculateDistance(dayjs().startOf('day'), dayjs(), colH)} />
            {dragConfig && (
              <DragBlock layout={dragConfig.rect}>
                <div style="background: red; height: 100%">
                  {/* 这里拖动时显示组件,需支持自定义 */}
                  {dragTime?.start + ':' + dragTime?.end}
                </div>
              </DragBlock>
            )}
            {newCalender && (
              <AddEventComponent layout={newCalender.rect}>
                <div style="background: red; height: 100%">
                  {/* 这里拖动时显示组件,需支持自定义 */}
                  添加的内容
                </div>
              </AddEventComponent>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
