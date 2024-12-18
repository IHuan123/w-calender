import { h } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { cls } from '@/utils/css';
import type { GridBoxProps } from '@wcalender/types/DayView';
import useInteract from '@/hooks/useInteract';
import {
  DRAG_END,
  DRAG_MOVE,
  DRAG_START,
  RESIZE_END,
  RESIZE_MOVE,
  RESIZE_START,
} from '@/constant/busEventName';
import bus from '@/utils/bus';
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
}: GridBoxProps) {
  let position = { x, y };
  const gridBox = useRef<HTMLDivElement>(null);
  const [isDrag, setDragState] = useState(false);
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties>(
    genStyles({ ...position, h: h, w: w })
  );
  const getDy = getMoveDy();

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
          bus.$emit(DRAG_START, event, data, { w: '100%', h, ...position });
          setDragState(true);
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);
          if (dy) {
            bus.$emit(DRAG_MOVE, { ...event, dy: dy }, data);
          }
        },
        end(event) {
          bus.$emit(DRAG_END, event, data);
          setDragState(false);
        },
      },
    },
    resizeEvents: {
      edges: { top: false, left: false, bottom: true, right: false },
      listeners: {
        start(event) {
          bus.$emit(RESIZE_START, event, data, { w: '100%', h, ...position });
        },
        move(event) {
          let dy = getDy(event.dy, dragStepNum);
          if (dy) {
            bus.$emit(RESIZE_MOVE, { ...event, dy: dy }, data);
          }
        },
        end(event) {
          bus.$emit(RESIZE_END, event, data);
        },
      },
    },
  });

  return (
    <div
      className={`${className ?? ''} ${cls(['grid-box', 'grid-content'])}`}
      style={{ ...styleConfig, opacity: isDrag ? 0.7 : 1 }}
      ref={gridBox}
    >
      {children}
    </div>
  );
}
