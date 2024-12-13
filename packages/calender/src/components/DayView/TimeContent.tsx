import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { InteractEvent } from '@interactjs/types';
import { cls } from '@/utils/css';
import useInteract from '@/hooks/useInteract';
import {
  parseTranslateXY,
  getAttrsTransformTranslate,
  setElementStyle,
  getTransform,
  numToPx,
} from '@/utils/dom';

export interface ScheduleCardProps {
  title: string;
  startTime: string;
  endTime: string;
  className?: string;
}

/**
 * @zh 生成样式
 * @param param0
 * @returns
 */
function generateCardStyles({
  x,
  y,
  order,
}: {
  x: number;
  y: number;
  order?: number;
}): h.JSX.CSSProperties {
  let style = getTransform({
    left: numToPx(x),
    top: numToPx(y),
    width: 'calc(100% - 2px)',
    height: '200px',
  }) as h.JSX.CSSProperties;
  return style;
}

export default function ScheduleCard({ title, startTime, endTime, className }: ScheduleCardProps) {
  let position = { x: 0, y: 0 };
  const [styleConfig, setStyleConfig] = useState<h.JSX.CSSProperties>(generateCardStyles(position));
  useEffect(() => {
    const cardStyle = generateCardStyles(position);
    setStyleConfig(cardStyle);
    position = parseTranslateXY(cardStyle.transform as string);
    console.log(styleConfig, cardStyle, position);
  }, [startTime, endTime]);

  return <div className={`${className ?? ''} ${cls('time-content')}`} style={styleConfig}></div>;
}