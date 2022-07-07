import { useRef, useCallback, useEffect } from 'react';

/**
 * 可以自动注销的setTimeout。**注意：** `useAutoClearSetTimeout`返回的函数只能在一个地方调用，
 * 如果有多个地方用到，你需要多次执行`useAutoClearSetTimeout`。
 * @param {boolean} clearPrevious
 * @returns {(fn: function, timeout: number)=>void} setAutoClearTimeout
 *
 *
 * @example
 * // Absolutely not Ok
 * const doSomething_1 = ()=>{};
 * const doSomething_2 = ()=>{};
 * const setAutoClearTimeout = useAutoClearSetTimeout();
 * setAutoClearTimeout(doSomething_1,100);
 * setAutoClearTimeout(doSomething_2,100);
 *
 * // Ok
 * const setAutoClearTimeout_1 = useAutoClearSetTimeout();
 * const setAutoClearTimeout_2 = useAutoClearSetTimeout();
 *
 * useEffect(()=>{
 *  setAutoClearTimeout_1(doSomething_1,100);
 *  setAutoClearTimeout_2(doSomething_2,100);
 * }, [deps]);
 * */
export default function useAutoClearSetTimeout(clearPrevious: boolean = true) {
  const timerRef = useRef<number>();

  const setAutoClearTimeout = useCallback(
    (fn: () => void, timeout: number) => {
      if (clearPrevious && timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(fn, timeout);
    },
    [clearPrevious],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return setAutoClearTimeout;
}
