import { useRef, RefObject } from 'preact/compat';
import useInteract, { UseInteractTarget } from '@/hooks/useInteract';

import { isUndef } from '@/utils';
import useXState from './useXState';

export type PointerPosition = {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};
export type ScrollParent = Element | RefObject<Element>;
export type UsePointerMoveEventOptions = {
  scrollParent?: ScrollParent;
  limitCurrentTarget?: boolean;
  onDown?: (e: { event: any; x: number; y: number; downOffset: PointerPosition | null }) => void;
  onMove?: (e: {
    event: any;
    x: number;
    y: number;
    dy: number;
    dx: number;
    downOffset: PointerPosition | null;
  }) => void;
  onUp?: (e: { event: any; x: number; y: number; downOffset: PointerPosition | null }) => void;
};

const defaultOptions = {
  limitCurrentTarget: true,
  onDown() {},
  onMove() {},
  onUp() {},
};

export function usePointerMoveDistance() {
  let prevMoveY = useRef<number | null | undefined>(),
    dy = useRef(0),
    prevMoveX = useRef<number | null | undefined>(),
    dx = useRef(0);
  function getMoveDistance(cur: number, prev: number | null | undefined) {
    if (!isUndef(prev)) {
      return cur - prev;
    }
    return 0;
  }
  return {
    getDXY: (x: number, y: number) => {
      dx.current = getMoveDistance(x, prevMoveX.current);
      dy.current = getMoveDistance(y, prevMoveY.current);
      prevMoveY.current = y;
      prevMoveX.current = x;

      return {
        dx: dx.current,
        dy: dy.current,
      };
    },
    clearDXY() {
      prevMoveY.current = prevMoveX.current = null;
      dy.current = dx.current = 0;
    },
  };
}

export default function usePointerMoveEvent(
  target: UseInteractTarget,
  options: UsePointerMoveEventOptions = defaultOptions
) {
  let eventOptions = {
    ...defaultOptions,
    ...options,
  };
  let isTapContainerEle = useRef(false);
  const { getDXY, clearDXY } = usePointerMoveDistance();
  const [oldPosition, setOldPosition, getOldPosition] = useXState<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  useInteract(target, void 0, void 0, function (ctx) {
    ctx.on('down', function (event) {
      isTapContainerEle.current = event.interactable.target === event.originalEvent.target;
      if (isTapContainerEle.current) {
        const { x, y, originalEvent } = event;

        setOldPosition({
          x,
          y,
          offsetX: originalEvent.offsetX,
          offsetY: originalEvent.offsetY,
        });
        eventOptions.onDown({ event, x, y, downOffset: getOldPosition() });
      }
    });
    ctx.on('move', function (event) {
      if (isTapContainerEle.current) {
        const { x, y } = event.originalEvent;
        const { dx, dy } = getDXY(x, y);
        eventOptions.onMove({ event, x, y, dy: dy, dx: dx, downOffset: getOldPosition() });
      }
    });
    ctx.on('up', function (event) {
      if (isTapContainerEle.current) {
        const { y, x } = event.originalEvent;
        isTapContainerEle.current = false;
        eventOptions.onUp({ event, x, y, downOffset: getOldPosition() });
        setOldPosition(null);
        clearDXY();
      }
    });
  });
}
