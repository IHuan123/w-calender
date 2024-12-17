import { cls } from '@/utils/css';
import { TimeList } from '@wcalender/types/time';
interface HourRowsProps {
  data: TimeList;
}

export default function (props: HourRowsProps) {
  return (
    <div className={cls('time-line')}>
      {props.data?.map((item, index) => {
        return (
          <div className={cls('time-line-col')}>
            <span className={cls('time-line-col-label')}>{item.start.time.format('HH:mm')}</span>
          </div>
        );
      })}
    </div>
  );
}
