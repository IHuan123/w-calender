import { RefObject, useEffect, useMemo, useRef } from 'preact/compat';
import { defaultWindow } from '@/constant/_configurable';
import { unref } from '@/utils/common';
import type { ConfigurableWindow } from '@/types/configurable';
import useXState from './useXState';
import { RefType } from '@wcalender/types/utils';
import useEventListener from './useEventListener';

const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
export interface UseScrollOptions extends ConfigurableWindow {
  /**
   * Throttle time for scroll event, it’s disabled by default.
   *
   * @default 0
   */
  throttle?: number;

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
   *
   * @default 200
   */
  idle?: number;

  /**
   * Offset arrived states by x pixels
   *
   */
  offset?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };

  /**
   * Trigger it when scrolling.
   *
   */
  onScroll?: (e: Event) => void;

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: (e: Event) => void;

  /**
   * Listener options for scroll event.
   *
   * @default {capture: false, passive: true}
   */
  eventListenerOptions?: boolean | AddEventListenerOptions;

  /**
   * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
   * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
   *
   * @default 'auto'
   */
  behavior?: ScrollBehavior;

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void;
}

export default function useScroll(
  element: RefObject<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollOptions
) {
  const {
    onStop = () => {},
    onScroll = () => {},
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    behavior = 'auto',
    window = defaultWindow,
    onError = (e) => {
      console.error(e);
    },
  } = options;

  const isScrolling = useRef(false);

  const arrivedState = useRef({
    left: true,
    right: false,
    top: true,
    bottom: false,
  });
  const directions = useRef({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  const [internalX, setInternalX, getInternalX] = useXState(0);
  const [internalY, setInternalY, getInternalY] = useXState(0);

  const x = useMemo(() => getInternalX(), [internalX]);
  const y = useMemo(() => getInternalY(), [internalY]);

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    if (!window) return;

    const _element = unref(element);
    if (!_element) return;

    (_element instanceof Document ? window.document.body : _element)?.scrollTo({
      top: unref(_y) ?? getInternalX(),
      left: unref(_x) ?? getInternalY(),
      behavior: behavior,
    });
    const scrollContainer =
      (_element as Window)?.document?.documentElement ||
      (_element as Document)?.documentElement ||
      (_element as Element);
    if (x != null) setInternalX(scrollContainer.scrollLeft);
    if (y != null) setInternalY(scrollContainer.scrollTop);
  }

  const onScrollEnd = (e: Event) => {
    // dedupe if support native scrollend event
    if (!isScrolling.current) return;

    isScrolling.current = false;
    directions.current.left = false;
    directions.current.right = false;
    directions.current.top = false;
    directions.current.bottom = false;
    onStop(e);
  };

  const setArrivedState = (
    target: RefType<HTMLElement | SVGElement | Window | Document | null | undefined>
  ) => {
    if (!window) return;

    const el: Element = ((target as Window)?.document?.documentElement ||
      (target as Document)?.documentElement ||
      unref(target as HTMLElement | SVGElement)) as Element;

    const { display, flexDirection, direction } = getComputedStyle(el);
    const directionMultipler = direction === 'rtl' ? -1 : 1;

    const scrollLeft = el.scrollLeft;
    directions.current.left = scrollLeft < getInternalX();
    directions.current.right = scrollLeft > getInternalY();

    const left = scrollLeft * directionMultipler <= (offset.left || 0);
    const right =
      scrollLeft * directionMultipler + el.clientWidth >=
      el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.current.left = right;
      arrivedState.current.right = left;
    } else {
      arrivedState.current.left = left;
      arrivedState.current.right = right;
    }

    setInternalX(() => scrollLeft);

    let scrollTop = el.scrollTop;

    // patch for mobile compatible
    if (target === window.document && !scrollTop) scrollTop = window.document.body.scrollTop;

    directions.current.top = scrollTop < getInternalY();
    directions.current.bottom = scrollTop > getInternalX();
    const top = scrollTop <= (offset.top || 0);
    const bottom =
      scrollTop + el.clientHeight >=
      el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

    /**
     * reverse columns and rows behave exactly the other way around,
     * bottom is treated as top and top is treated as the negative version of bottom
     */
    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.current.top = bottom;
      arrivedState.current.bottom = top;
    } else {
      arrivedState.current.top = top;
      arrivedState.current.bottom = bottom;
    }

    setInternalY(() => scrollTop);
  };

  const onScrollHandler = (e: Event) => {
    if (!window) return;

    const eventTarget = ((e.target as Document).documentElement ?? e.target) as HTMLElement;

    setArrivedState(eventTarget);

    isScrolling.current = true;
    onScrollEnd(e);
    onScroll(e);
  };

  useEffect(() => {
    try {
      const _element = unref(element);
      if (!_element) return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  }, []);

  useEventListener(element, 'scroll', onScrollHandler, eventListenerOptions);
  useEventListener(element, 'scrollend', onScrollEnd, eventListenerOptions);
}
