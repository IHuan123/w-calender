import { Dayjs } from 'dayjs';

export type TimeValue = Dayjs | string;

export type ReturnTimeValue = {
  year: number;
  month: number; // 月返回的是0～11
  date: number;
  day: number; // 从0(星期天)到6(星期六)
  time: Dayjs;
  quarter: number;
  hour: number;
  minute: number;
  second: number;
  afternoon: boolean;
};

export type TimeList = Array<{
  time: ReturnTimeValue;
}>;
