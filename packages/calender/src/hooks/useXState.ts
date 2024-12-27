import { useEffect, useRef, useState } from 'preact/compat';
import { Dispatch, StateUpdater } from 'preact/hooks';

function useXState<T>(initState: T | (() => T)): [T, Dispatch<StateUpdater<T>>, () => T] {
  const [state, setState] = useState(initState);
  const copyState = useRef(state);
  const isUpdate = useRef<Parameters<typeof setXState>[1] | null>();

  function setXState(state: StateUpdater<T>, callback?: Function) {
    setState((prev) => {
      isUpdate.current = callback;
      const res = typeof state === 'function' ? (state as (prevState: T) => T)(prev) : state;
      copyState.current = res;
      return res;
    });
  }

  function getState() {
    return copyState.current;
  }
  useEffect(() => {
    if (typeof isUpdate.current === 'function') {
      isUpdate.current();
    }
  });

  return [state, setXState, getState];
}

export default useXState;
