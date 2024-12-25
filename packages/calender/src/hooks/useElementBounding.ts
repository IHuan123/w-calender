import { RefObject } from 'preact';
import { useEffect } from 'preact/hooks';
import { elementResizeObserver } from '@/utils/resizeObserver';
import { useXState } from './';

export default function useElementBounding(
  el: RefObject<HTMLElement>,
  callback?: (e: { width: number; height: number }) => void
) {
  const [size, setSize, getSize] = useXState({ width: 0, height: 0 });

  let ctx: ReturnType<typeof elementResizeObserver> | null = null;
  useEffect(() => {
    if (el) {
      ctx = elementResizeObserver(el.current!, (res) => {
        setSize(res);
        callback?.(res);
      });
    }

    return () => {
      ctx?.disconnect();
    };
  }, [el]);
  return {
    size,
    getSize,
  };
}
