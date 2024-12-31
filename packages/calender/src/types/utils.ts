import { RefObject } from 'preact/compat';
export type Arrayable<T> = T[] | T;

export type ElementOf<T> = T extends (infer E)[] ? E : never;

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any;
/**
 * Compatible with versions below TypeScript 4.5 Awaited
 */
export type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then: (onfulfilled: infer F, ...args: infer _) => any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
    ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
      ? Awaited<V> // recursively unwrap the value
      : never // the argument to `then` was not callable
    : T; // non-object or non-thenable

export type Promisify<T> = Promise<Awaited<T>>;

export type PromisifyFn<T extends AnyFn> = (...args: ArgumentsType<T>) => Promisify<ReturnType<T>>;

/**
 * Void function
 */
export type Fn = () => void;

export type RefType<T> = T | RefObject<T>;
