import { ComponentChildren, h } from 'preact';
import './index.scss';
export interface ScrollbarProps {
    children: ComponentChildren;
    className?: string;
    style?: h.JSX.CSSProperties;
    hideBar?: Boolean;
    onScroll?: (e: Event) => void;
}
export default function (props: ScrollbarProps): h.JSX.Element;
