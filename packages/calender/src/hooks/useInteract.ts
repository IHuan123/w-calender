import { RefObject } from 'preact';
import interact from 'interactjs';
import type { Options, Target, Listeners, Interactable, EdgeOptions } from '@interactjs/types';
import { useEffect } from 'preact/hooks';
import { unref } from '@/utils/common';
import { isUndef } from '@/utils/is';
export interface InteractEventOptions {
  draggableEvents?: { autoScroll?: boolean; listeners: Listeners };
  pointerEvents?: { listeners: Listeners };
  resizeEvents?: { edges?: EdgeOptions; listeners: Listeners };
}
type UseInteractTarget = Target | RefObject<Target>;

/**
 * @zh 手势hooks
 */
export default function useInteract(
  target: UseInteractTarget,
  options?: Options,
  eventOptions?: InteractEventOptions
) {
  let interactCtx: Interactable | null = null;

  // 初始化事件
  function initEvent(ctx: Interactable, eventOptions: InteractEventOptions) {
    if (!isUndef(eventOptions?.draggableEvents)) {
      ctx.draggable(eventOptions.draggableEvents);
    }
    if (!isUndef(eventOptions?.pointerEvents)) {
      ctx.pointerEvents(eventOptions.pointerEvents);
    }
    if (!isUndef(eventOptions?.resizeEvents)) {
      ctx.resizable(eventOptions.resizeEvents);
    }
  }

  useEffect(() => {
    let el = unref<Target>(target);
    if (el) {
      interactCtx = interact(el, options);
      if (eventOptions) {
        initEvent(interactCtx, eventOptions);
      }
    }

    return () => {
      interactCtx = null;
    };
  }, [target, options]);
  return {
    context: interactCtx,
  };
}
