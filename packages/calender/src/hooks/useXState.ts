import { useEffect, useRef, useState } from 'preact/compat';

function useXState<T>(initState: T): [T, (state: T, callback?: Function) => void, () => T] {
  const [state, setState] = useState(initState);
  const copyState = useRef(state);
  const isUpdate = useRef<Parameters<typeof setXState>[1] | null>();

  function setXState(state: T, callback?: Function): void {
    setState((prev) => {
      isUpdate.current = callback;
      const res = typeof state === 'function' ? state(prev) : state;
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