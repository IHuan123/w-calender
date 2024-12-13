import ChCalender from 'w-calender';
import type { Options } from 'w-calender/types';
import dayjs from 'dayjs';
import 'w-calender/dist/w-calender.css';
function main() {
  const options: Options = {
    data: [
      {
        type: 'day',
        start: dayjs().format('YYYY-MM-DD 00:00'),
        end: dayjs().format('YYYY-MM-DD 23:59'),
      },
      {
        type: 'time',
        start: dayjs().format('YYYY-MM-DD 12:00'),
        end: dayjs().format('YYYY-MM-DD 14:00'),
      },
      {
        type: 'time',
        start: dayjs().format('YYYY-MM-DD 12:00'),
        end: dayjs().format('YYYY-MM-DD 14:00'),
      },
      {
        type: 'time',
        start: dayjs().format('YYYY-MM-DD 13:00'),
        end: dayjs().format('YYYY-MM-DD 15:00'),
      },
      {
        type: 'time',
        start: dayjs().format('YYYY-MM-DD 15:30'),
        end: dayjs().format('YYYY-MM-DD 15:00'),
      },
    ],
  };

  let context = new ChCalender(document.getElementById('root')!, options);

  // 渲染数据
  function renderData() {
    context.data([]);
  }
}
main();
