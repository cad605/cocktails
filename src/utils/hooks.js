import {
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";

/**
 * `useSafeDispatch` takes a `dispatch` function from `useReducer` and
 * creates a ref to the component. It returns a memoized callback that
 * only executes the original `dispatch` if the component is still mounted
 * @param {*} dispatch
 * @returns memoized callback function
 */
function useSafeDispatch(dispatch) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return (mounted.current = false);
  }, []);

  return useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}

const defaultInitialState = { status: "idle", data: null, error: null };
/**
 * `useAsync` accepts an optional `initalState` to initialize the reducer.
 * It returns a `run` function that takes a promise, runs it, and
 * update the state. It also exposes `setData`, `setError`, and `reset` functions
 * used to update state directly
 * @param {*} initalState
 * @returns
 */
function useAsync(initalState) {
  const initalStateRef = useRef({
    ...defaultInitialState,
    ...initalState,
  });

  const asyncReducer = (state, newState) => ({ ...state, ...newState });

  const [{ status, data, error }, dispatch] = useReducer(
    asyncReducer,
    initalStateRef.current
  );

  const safeDispatch = useSafeDispatch(dispatch);

  const setData = useCallback(
    (data) => safeDispatch({ data, status: "resolved" }),
    [safeDispatch]
  );
  const setError = useCallback(
    (error) => safeDispatch({ error, status: "rejected" }),
    [safeDispatch]
  );
  const reset = useCallback(
    () => safeDispatch(initalStateRef.current),
    [safeDispatch]
  );

  const run = useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }

      safeDispatch({ status: "pending" });

      return promise.then(
        (data) => {
          setData(data);
        },
        (error) => {
          setError(error);
        }
      );
    },
    [safeDispatch, setData, setError]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

/**
 * 
 * @param {*} key
 * @param {*} defaultValue
 * @param {*} param2
 * @returns
 */
function useLocalStorageState(
  key,
  defaultValue = "",
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = useState(() => {
    const localStorageValue = window.localStorage.getItem(key);

    if (localStorageValue) {
      return deserialize(localStorageValue);
    }

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState];
}

export { useAsync, useLocalStorageState };
