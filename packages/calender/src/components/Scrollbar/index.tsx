import { cls } from '../../utils/css';
import { ComponentChildren, h } from 'preact';
import { useCallback } from 'preact/hooks';
import './index.scss';

export interface ScrollbarProps {
  children?: ComponentChildren;
  className?: string;
  style?: h.JSX.CSSProperties;
  hideBar?: Boolean;
  onScroll?: (e: {
    event?: Event;
    scroll: { scrollHeight: number; scrollLeft: number; scrollTop: number; scrollWidth: number };
  }) => void;
}
export default function (props: ScrollbarProps) {
  const onScroll = useCallback(
    (e: Event) => {
      if (typeof props.onScroll === 'function') {
        let { scrollHeight, scrollLeft, scrollTop, scrollWidth } = e.target as Element;
        props.onScroll({
          event: e,
          scroll: { scrollHeight, scrollLeft, scrollTop, scrollWidth },
        });
      }
    },
    [props.onScroll]
  );

  return (
    <div className={cls(['scrollbar', props.className])} style={props.style}>
      <div
        className={cls(['scrollbar-container', props.hideBar ? 'scrollbar-hide-bar' : void 0])}
        onScroll={onScroll}
      >
        {props.children}
      </div>
    </div>
  );
}
