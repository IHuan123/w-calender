import { PropsWithChildren } from '@/types/common';
import { InternalStoreAPI } from '@/types/store';
import { createContext, createElement } from 'preact';
import { useContext, useEffect, useLayoutEffect } from 'preact/hooks';
import { isUndef } from '@/utils/is';

const isSSR = isUndef(window) || !window.navigator;
const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;
/**
 * @zh 数据共享
 */
export default function createStore<State>() {
  const StoreContext = createContext<InternalStoreAPI<State> | null>(null);

  // 共享顶级组件
  function StoreProvider({
    children,
    store,
  }: PropsWithChildren<{ store: InternalStoreAPI<State> }>) {
    return createElement(StoreContext.Provider, { value: store, children });
  }
  // hooks
  function useStore() {}

  return {
    StoreProvider,
  };
}
