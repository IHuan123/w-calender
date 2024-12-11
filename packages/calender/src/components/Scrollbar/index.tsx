import { cls } from '../../utils/css';
import { ComponentChildren } from 'preact';
export interface ScrollbarProps {
  children: ComponentChildren;
  className?: string;
}
export default function (props: ScrollbarProps) {
  return (
    <div className={cls(['scrollbar', props.className])}>
      <div className={cls('scrollbar-container')}>{props.children}</div>
    </div>
  );
}
