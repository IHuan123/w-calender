import { h } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { cls } from '@/utils/css';
import { getAttrsTransformTranslate } from '@/utils/dom';
import type { GridBoxProps } from '@wcalender/types/DayView';
import useInteract, { InteractEventOptions } from '@/hooks/useInteract';
import { genStyles } from '../_utils';
import './style/timeContent.scss';

// 记录拖拽距离，大于15单位距离才触发事件
function getMoveDy() {
  let historyDy = 0;
  let getDy: Function | null = (dy: number, threshold: number): number | boolean => {
    historyDy += dy;
    if (Math.abs(historyDy) > threshold) {
      let returnDy = historyDy;
      historyDy = 0;
      return returnDy > 0 ? threshold : -threshold;
    }
    return false;
  };

  return getDy;
}

/**
 * @zh 获取拖动触发元素信息
 */
function getEleLayout(el: HTMLElement) {
  let posi = getAttrsTransformTranslate(el);
  let { width, height } = el.getBoundingClientRect();
  return { ...posi, w: width, h: height };
}

export default function ScheduleCard({
  w,
  h,
  x,
  y,
  children,
  className,
  data,
  colH = 0,
  interval = 1,
  onMove,
  onMoveStart,
  onMoveEnd,
  onResize,
  onResizeStart,
  onResizeEnd,
}: GridBoxProps) {
  const gridBox = useRef<HTMLDivElement>(null);
  const [isEdit, setDragState] = useState(false);
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties | null>(null);
  const getDy = getMoveDy();
  const dragStepNum = useMemo(() => {
    return (colH / interval) * 15;
  }, [colH, interval]);

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
          setDragState(true);
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
          setDragState(true);
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
  useInteract(gridBox, void 0, options);

  return (
    <div
      className={`${className ?? ''} ${cls(['grid-box', 'grid-content'])}`}
      style={{ ...styleConfig, opacity: isEdit ? 0.7 : 1 }}
      ref={gridBox}
    >
      {children}
    </div>
  );
}
