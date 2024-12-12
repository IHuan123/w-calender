import { h } from 'preact';
export interface ScheduleCardProps {
    title: string;
    startTime: string;
    endTime: string;
    className?: string;
}
export default function ScheduleCard({ title, startTime, endTime, className }: ScheduleCardProps): h.JSX.Element;
