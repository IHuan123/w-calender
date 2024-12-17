import { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { elementResizeObserver } from '@/utils/resizeObserver';

export default function useElementBounding(
  el: RefObject<HTMLElement>,
  callback?: (e: { width: number; height: number }) => void
) {
  let [size, setSize] = useState({ width: 0, height: 0 });
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
  return size;
}
