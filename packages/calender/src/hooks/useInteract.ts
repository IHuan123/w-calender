import interact from 'interactjs';
import { Options, Target, Listeners } from '@interactjs/types';
import { useEffect } from 'preact/hooks';

export interface InteractEventOptions {
  draggableOptions?: { listeners: Listeners };
}
/**
 * @zh 手势hooks
 */
export default function useInteract(
  el: Target,
  options?: Options,
  eventOptions?: InteractEventOptions
) {
  let interactCtx;

  useEffect(() => {
    interactCtx = interact(el, options).draggable(eventOptions?.draggableOptions);
    return () => {
      interactCtx = null;
    };
  }, [el, options]);
  return {
    context: interactCtx,
  };
}
