import './style/index.scss';
import { ComponentChildren } from 'preact';
import { useMemo, useRef, forwardRef } from 'preact/compat';
import {
  createUniqueId,
  getMoveDistance,
  setElementStyle,
  getTransform,
  numToPx,
  getReturnTime,
  format,
  cls,
  isEmpty,
  isUndef,
} from '@/utils';
import { genTimeSlice, calculateRect, offsetToTimeValue, genStyles } from '../_utils';
import type { CalenderItem } from '@/types/options';
import type { DateRange } from '@/types/schedule';
import type { Rect, OperateType } from '@/types/components';
import useColumnLayout from './hooks/useColumnLayout';
import { useElementBounding, useXState, usePointerMoveEvent } from '@/hooks';

import EventLayoutItem from '@/components/Event/EventLayoutItem';

export interface ColumnProps {
  data: CalenderItem[];
  date: DateRange;
  scrollTop?: number;
  cellHeight?: number;
  timeInterval?: number;
  gap?: number;
  bordered?: boolean;
  split?: boolean;
  onMoveStart?(event: any, data: CalenderItem, rect: Rect): void;
  onMove?(event: any, data: CalenderItem, rect: Rect): void;
  onMoveEnd?(event: any, data: CalenderItem, rect: Rect): void;
  onResizeStart?(event: any, data: CalenderItem, rect: Rect): void;
  onResize?(event: any, data: CalenderItem, rect: Rect): void;
  onResizeEnd?(event: any, data: CalenderItem, rect: Rect): void;
  onTap?(event: any, data: CalenderItem, rect: Rect): void;
  onChange?(event: { target: CalenderItem; data: CalenderItem[] }): void;
}

type DragConfig = { rect: Rect; data: CalenderItem; type: OperateType } | null;
const getDy = getMoveDistance();
export default function Column({
  data,
  date,
  cellHeight = 42,
  timeInterval = 30,
  gap = 0,
  bordered = true,
  split = true,
  onChange = () => {},
}: ColumnProps) {
  const layoutContainer = useRef<HTMLDivElement>(null);
  const timeList = useMemo(() => genTimeSlice(date, timeInterval), [date]);
  const columnHeight = useMemo(() => timeList.length * cellHeight, [timeList]);

  let dragPosition: Rect = { x: 0, y: 0, w: '100%', h: 0 };
  const [dragConfig, setDragConf, getDragState] = useXState<DragConfig>(null);
  const { rect: containerRect, getRect } = useElementBounding(layoutContainer);
  // 这里的数据需统一使用store存储
  const { layoutData, setCalenderData, getCalenderData } = useColumnLayout({
    data: data,
  });

  const dragStepNum = useMemo(() => {
    return (cellHeight / timeInterval) * 15;
  }, [cellHeight, timeInterval]);

  /**
   * 拖动时的时间
   */
  const dragTime = useMemo(() => {
    if (isUndef(dragConfig)) return null;
    let start = format(dragConfig.data.start, 'YYYY-MM-DD HH:mm');
    let end = format(dragConfig.data.end, 'YYYY-MM-DD HH:mm');
    return { start, end };
  }, [dragConfig]);

  /**
   * @zh 开始移动
   */
  function onMoveStart(event: any, data: CalenderItem, rect: Rect) {
    setDragConf({ rect: { ...dragPosition }, data, type: 'move' });
    dragPosition.y = rect.y;
    dragPosition.h = rect.h;
  }

  /**
   * @zh 移动中
   */
  function onMove(event: any, data: CalenderItem, rect: Rect) {
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
    handleUpdateData(event, data, 'move');
  }

  function onMoveEnd(event: any, data: CalenderItem) {
    let dragData = getDragState();
    changeData(dragData?.data as CalenderItem);
    setDragConf(null);
  }
  /**
   * @zh resize start
   */
  function onResizeStart(event: any, data: CalenderItem, rect: Rect) {
    setDragConf({ rect, data, type: 'resize' });
    dragPosition = { ...rect };
  }

  function onResize(event: any, data: CalenderItem, rect: Rect) {
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      let h = event.rect.height;
      setElementStyle(dragEl as HTMLElement, {
        width: '100%',
        height: numToPx(Math.max(h, dragStepNum)),
      });
    }
    handleUpdateData(event, data, 'resize');
  }
  /**
   * @zh 容器大小变更事件
   */
  function onResizeEnd(event: any, data: CalenderItem) {
    let dragData = getDragState();
    changeData(dragData?.data as CalenderItem);
    setDragConf(null);
  }

  /**
   * @zh 处理数据
   */
  function handleUpdateData(event: any, data: CalenderItem, type: OperateType) {
    let dragData = { ...data };
    dragData.start = getReturnTime(
      date[0].time.add(offsetToTimeValue(dragPosition.y, timeInterval, cellHeight), 'second')
    );
    dragData.end = getReturnTime(
      date[0].time.add(
        offsetToTimeValue(dragPosition.y + event.rect.height, timeInterval, cellHeight),
        'second'
      )
    );
    setDragConf({
      rect: { y: dragPosition.y, w: '100%', x: 0, h: event.rect.height },
      data: dragData,
      type: type,
    });
  }

  /**
   * @zh 数据更新事件
   */
  async function changeData(data: CalenderItem) {
    updateData(data);
  }

  /**
   * @zh 更新数据
   */
  function updateData(target: CalenderItem) {
    let data = [...getCalenderData()];
    let index = data.findIndex((item) => item._key === target._key);
    if (index > -1) {
      data[index] = target;
    } else {
      data = [...data, target];
    }

    setCalenderData(data);
    onChange({ target: target, data });
  }

  const onTap = () => {};

  /**
   * @zh 拖拽样式
   */
  const OperateTime = forwardRef<
    HTMLDivElement,
    { layout: Rect; children?: ComponentChildren; type: OperateType }
  >(({ layout, children, type }, ref) => {
    return (
      <div
        className={cls(['operate-placelholder', `operate-placelholder-${type ?? 'normal'}`])}
        style={genStyles(layout)}
        ref={ref}
      >
        {children}
      </div>
    );
  });

  /**
   * @zh 添加时间段
   * 这里需要做添加元素的resize操作
   * 自动平均对齐刻度
   */
  function getMoveEvtDownY(y: number) {
    return y - (y % (cellHeight / 2));
  }

  /**
   * @zh 鼠标移动事件处理
   */
  let startOffsetY = 0;
  let originalLayoutConfig: Rect;
  usePointerMoveEvent(layoutContainer, {
    onDown({ event }) {
      let { offsetY } = event.originalEvent;

      let top = getMoveEvtDownY(offsetY);
      startOffsetY = top;
      let rect = {
        x: 0,
        y: top,
        w: '100%',
        h: dragStepNum,
      };
      originalLayoutConfig = rect;
      setDragConf({
        rect,
        data: {
          title: '添加日程',
          start: getReturnTime(
            date[0].time.add(offsetToTimeValue(top, timeInterval, cellHeight), 'second')
          ),
          end: getReturnTime(
            date[0].time.add(
              offsetToTimeValue(top + dragStepNum, timeInterval, cellHeight),
              'second'
            )
          ),
          _key: createUniqueId(),
          type: 'time',
        },
        type: 'add',
      });
    },
    onMove({ dy }) {
      let newConfig = getDragState();

      if (newConfig) {
        let distanceY = getDy(dy, dragStepNum);
        if (distanceY) {
          originalLayoutConfig.h = originalLayoutConfig.h + distanceY;
          let h = Math.abs(originalLayoutConfig.h);
          let y = 0;
          if (originalLayoutConfig.h > 0) {
            y = newConfig.rect.y;
          } else if (originalLayoutConfig.h < -dragStepNum) {
            y = originalLayoutConfig.y - h;
          } else {
            y = originalLayoutConfig.y - dragStepNum;
            h = dragStepNum;
          }
          let rect = {
            ...newConfig.rect,
            y: y,
            h,
          };
          let [start, end] = [
            getReturnTime(
              date[0].time.add(offsetToTimeValue(rect.y, timeInterval, cellHeight), 'second')
            ),
            getReturnTime(
              date[0].time.add(offsetToTimeValue(rect.y + h, timeInterval, cellHeight), 'second')
            ),
          ].sort((a, b) => {
            return a.time.isAfter(b.time) ? 1 : -1;
          });
          setDragConf({
            rect,
            data: {
              title: newConfig.data.title,
              start,
              end,
              _key: createUniqueId(),
              type: 'time',
            },
            type: 'add',
          });
        }
      }
    },
    onUp() {
      let newConfig = getDragState();
      if (newConfig) {
        updateData(newConfig.data);
      }
      setDragConf(null);
    },
  });

  function renderCalenderLayout() {
    if (isEmpty(layoutData)) {
      return null;
    }
    return layoutData.map((group) =>
      group.data.map(({ colIndex, ...config }) => (
        <EventLayoutItem
          {...calculateRect(
            { ...config, colIndex },
            group.totalColumn,
            cellHeight,
            containerRect.width
          )}
          key={config._key}
          data={config}
          cellHeight={cellHeight}
          interval={timeInterval}
          onMoveStart={onMoveStart}
          onMove={onMove}
          onMoveEnd={onMoveEnd}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
          onResize={onResize}
          onTap={onTap}
          style={{ pointerEvents: isEmpty(dragConfig) ? 'auto' : 'none' }}
        >
          {/* 自定义日程卡片，需支持自定义 */}

          <div
            style={{ width: '100%', height: '100%', background: 'blue' }}
          >{`${config.title}-${format(config.start, 'HH:mm')}~${format(config.end, 'HH:mm')}`}</div>
        </EventLayoutItem>
      ))
    );
  }
  function renderPlaceholder() {
    if (dragConfig) {
      return (
        <OperateTime layout={dragConfig.rect} type={dragConfig.type}>
          <div style="background: red; height: 100%">
            {/* 这里拖动时显示组件,需支持自定义 */}
            {dragTime?.start + ':' + dragTime?.end}
          </div>
        </OperateTime>
      );
    }
    return null;
  }

  return (
    <div
      style={{ '--col-h': cellHeight + 'px', width: '100%', height: numToPx(columnHeight) }}
      class={cls(['column', bordered ? 'column-border' : void 0, split ? 'column-split' : void 0])}
      ref={layoutContainer}
    >
      {renderCalenderLayout()}
      {renderPlaceholder()}
    </div>
  );
}
