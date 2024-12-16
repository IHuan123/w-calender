import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { cls } from '@/utils/css';
import { getTransform, numToPx } from '@/utils/dom';
import type { GridBoxProps } from '@wcalender/types/DayView';
import './style/timeContent.scss';

/**
 * @zh 生成样式
 * @param param0
 * @returns
 */
function generateCardStyles({
  x,
  y,
  h,
  w,
}: {
  x: number | string;
  y: number;
  h: number;
  w: number | string;
}): h.JSX.CSSProperties {
  let style = getTransform({
    left: numToPx(x, x as string),
    top: numToPx(y),
    width: numToPx(w, w as string),
    height: numToPx(h),
  }) as h.JSX.CSSProperties;
  return style;
}

export default function ScheduleCard({ w, h, x, y, children, className }: GridBoxProps) {
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties>(
    generateCardStyles({ x, y, h: h, w: w })
  );
  useEffect(() => {
    const cardStyle = generateCardStyles({ x, y, h: h, w: w });
    setStyleConfig(cardStyle);
  }, [w, h, x, y]);

  return (
    <div className={`${className ?? ''} ${cls('grid-box')}`} style={styleConfig}>
      {children}
    </div>
  );
}
