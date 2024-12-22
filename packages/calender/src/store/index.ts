import { PropsWithChildren } from '@/types/common';
import { InternalStoreAPI } from '@/types/store';
import { createContext, createElement, Context } from 'preact';
import { useContext, useEffect, useLayoutEffect, useMemo } from 'preact/hooks';
import { isUndef } from '@/utils/is';

const isSSR = isUndef(window) || !window.navigator;
const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;
/**
 * @zh 数据共享
 */
export function createStore<State>() {
  const StoreContext = createContext<InternalStoreAPI<State> | null>(null);

  // 共享顶级组件
  function StoreProvider({
    children,
    store,
  }: PropsWithChildren<{ store: InternalStoreAPI<State> }>) {
    return createElement(StoreContext.Provider, { value: store, children });
  }
  // hooks
  function useStore() {
    useIsomorphicLayoutEffect(() => {});
    // store 操作
    function getItem() {}
    function setItem() {}
    function clear() {}
    function removeItem() {}

    return {
      getItem,
      setItem,
      clear,
      removeItem,
    };
  }

  /**
   * For handling often occurring state changes (Transient updates)
   * See more: https://github.com/pmndrs/zustand/blob/master/readme.md#transient-updates-for-often-occuring-state-changes
   */
  const useInternalStore = () => {
    const storeCtx = useContext(StoreContext);

    if (isUndef(storeCtx)) {
      throw new Error('StoreProvider is not found');
    }

    return useMemo(() => storeCtx, [storeCtx]);
  };
  return {
    StoreProvider,
    useStore,
    useInternalStore,
  };
}
