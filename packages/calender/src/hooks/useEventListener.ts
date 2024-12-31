import { useEffect, useRef } from 'preact/compat';
import { defaultWindow } from '@/constant/_configurable';
import { isObject, unref } from '@/utils';
import type { Arrayable, Fn, RefType } from '@/types/utils';

interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any;
  removeEventListener: (event: Events, fn?: any, options?: any) => any;
}

export type WindowEventName = keyof WindowEventMap;
export type DocumentEventName = keyof DocumentEventMap;

export interface GeneralEventListener<E = Event> {
  (evt: E): void;
}

export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn;

export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn;

export function useEventListener<E extends keyof DocumentEventMap>(
  target: DocumentOrShadowRoot,
  event: Arrayable<E>,
  listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn;

export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: RefType<HTMLElement | null | undefined>,
  event: Arrayable<E>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): () => void;

export function useEventListener<Names extends string, EventType = Event>(
  target: RefType<InferEventTarget<Names> | null | undefined>,
  event: Arrayable<Names>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn;

export function useEventListener<EventType = Event>(
  target: RefType<EventTarget | null | undefined>,
  event: Arrayable<string>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn;

export default function useEventListener(...args: any[]) {
  let target = useRef<EventTarget>();
  let events: Arrayable<string>;
  let listeners: Arrayable<Function>;
  let options: boolean | AddEventListenerOptions | undefined;

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target.current = defaultWindow;
  } else {
    [, events, listeners, options] = args;
    target.current = unref(args[0]);
  }
  if (!target) return () => {};
  if (!Array.isArray(events)) events = [events];
  if (!Array.isArray(listeners)) listeners = [listeners];

  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };

  const register = (el: any, event: string, listener: any, options: any) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };

  const stop = () => {
    cleanup();
  };

  useEffect(() => {
    cleanup();
    let el = unref(target);

    if (el) {
      // create a clone of options, to avoid it being changed reactively on removal
      const optionsClone = isObject(options) ? { ...options } : options;
      cleanups.push(
        ...(events as string[]).flatMap((event) => {
          return (listeners as Function[]).map((listener) =>
            register(el, event, listener, optionsClone)
          );
        })
      );
    }

    return () => {
      stop();
    };
  }, [target, options]);

  return stop;
}
