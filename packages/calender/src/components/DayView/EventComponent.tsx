import { h } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { cls } from '@/utils/css';
import { getAttrsTransformTranslate } from '@/utils/dom';
import { getMoveDistance } from '@/utils/common';
import type { GridBoxProps, OperateType } from '@wcalender/types/components';
import useInteract, { InteractEventOptions } from '@/hooks/useInteract';
import { genStyles } from '../_utils';

/**
 * @zh 获取拖动触发元素信息
 */
function getEleLayout(el: HTMLElement) {
  let posi = getAttrsTransformTranslate(el);
  let { width, height } = el.getBoundingClientRect();
  return { ...posi, w: width, h: height };
}
const getDy = getMoveDistance();
export default function ScheduleCard({
  w,
  h,
  x,
  y,
  children,
  className,
  data,
  cellHeight = 0,
  interval = 1,
  onMove,
  onMoveStart,
  onMoveEnd,
  onResize,
  onResizeStart,
  onResizeEnd,
  onTap,
}: GridBoxProps) {
  const gridBox = useRef<HTMLDivElement>(null);
  const [editType, setDragState] = useState<OperateType | false>(false);
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties | null>(null);

  const dragStepNum = useMemo(() => {
    return (cellHeight / interval) * 15;
  }, [cellHeight, interval]);

  useEffect(() => {
    setStyleConfig(() => genStyles({ x, y, h: h, w: w }));
  }, [w, h, x, y]);

  const options: InteractEventOptions = {
    draggableEvents: {
      autoScroll: false,
      listeners: {
        start(event) {
          let rect = getEleLayout(event.target);
          onMoveStart?.(event, data, rect);
          setDragState('move');
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);
          if (dy) {
            let rect = getEleLayout(event.target);
            onMove?.({ ...event, dy: dy }, data, rect);
          }
        },
        end(event) {
          let rect = getEleLayout(event.target);
          onMoveEnd?.(event, data, rect);
          setDragState(false);
        },
      },
    },
    resizeEvents: {
      edges: { top: false, left: false, bottom: true, right: false },
      listeners: {
        start(event) {
          let rect = getEleLayout(event.target);
          onResizeStart?.(event, data, rect);
          setDragState('resize');
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);
          if (dy) {
            let rect = getEleLayout(event.target);
            onResize?.({ ...event, dy: dy }, data, rect);
          }
        },
        end(event) {
          let rect = getEleLayout(event.target);
          onResizeEnd?.(event, data, rect);
          setDragState(false);
        },
      },
    },
  };
  useInteract(gridBox, void 0, options, (ctx) => {
    ctx.on('tap', function (event) {
      event.preventDefault();
      event.stopPropagation();
      onTap?.(event, data, { x, y, w, h });
    });
  });

  return (
    <div
      className={`${className ?? ''} ${cls(['grid-box', 'grid-content'])}`}
      style={{
        ...styleConfig,
        opacity: editType ? { resize: 0, move: 0.7, add: 0 }[editType as OperateType] : 1,
      }}
      ref={gridBox}
      onClick={() => {}}
    >
      {children}
    </div>
  );
}
