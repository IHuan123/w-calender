import { cls } from '@/utils/css';

import type { ScheduleCardProps } from '@wcalender/types/DayView';
import './style/timeContent.scss';

/**
 * @zh 生成样式
 * @param param0
 * @returns
 */

export default function ScheduleCard({ title, startTime, endTime, className }: ScheduleCardProps) {
  return (
    <div className={`${className ?? ''} ${cls('time-content')}`}>
      <div className={cls('title')}>
        <span>{title}</span>
      </div>
    </div>
  );
}
