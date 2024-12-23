import { h } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { cls } from '@/utils/css';
import type { GridBoxProps } from '@wcalender/types/DayView';
import useInteract from '@/hooks/useInteract';
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
  let position = { x, y };
  const gridBox = useRef<HTMLDivElement>(null);
  const [isDrag, setDragState] = useState(false);
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties>(
    genStyles({ ...position, h: h, w: w })
  );
  const getDy = getMoveDy();
  const [count, setCount] = useState(0);
  const dragStepNum = useMemo(() => {
    return (colH / interval) * 15;
  }, [colH, interval]);
  useEffect(() => {
    const cardStyle = genStyles({ x, y, h: h, w: w });
    setStyleConfig(cardStyle);
    position = { x, y };
  }, [w, h, x, y]);

  useInteract(gridBox, void 0, {
    draggableEvents: {
      autoScroll: true,
      listeners: {
        start(event) {
          onMoveStart?.(event, data, { w: '100%', h, ...position });
          setDragState(true);
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);

          if (dy) {
            onMove?.({ ...event, dy: dy }, data, { w: '100%', h, ...position });
          }
        },
        end(event) {
          onMoveEnd?.(event, data, { w: '100%', h, ...position });
          setDragState(false);
        },
      },
    },
    resizeEvents: {
      edges: { top: false, left: false, bottom: true, right: false },
      listeners: {
        start(event) {
          onResizeStart?.(event, data, { w: '100%', h, ...position });
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);
          if (dy) {
            onResize?.({ ...event, dy: dy }, data, { w: '100%', h, ...position });
          }
        },
        end(event) {
          onResizeEnd?.(event, data, { w: '100%', h, ...position });
        },
      },
    },
  });

  return (
    <div
      className={`${className ?? ''} ${cls(['grid-box', 'grid-content'])}`}
      style={{ ...styleConfig, opacity: isDrag ? 0.7 : 1 }}
      ref={gridBox}
      onClick={() => {
        console.log(count);
      }}
    >
      {children}
    </div>
  );
}
