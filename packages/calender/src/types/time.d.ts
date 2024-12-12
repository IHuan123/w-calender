import { Dayjs } from 'dayjs';
export type TimeValue = Dayjs | string;
export type ReturnTimeValue = {
    year: number;
    month: number;
    date: number;
    day: number;
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
