import { useRef, useEffect } from 'react';

/**
 * 用来保存更新前一次的状态
 *
 * ！！ 实际没啥用
 *
 * @param {any} data
 * @param {boolean} shouldInitialize
 * @returns {any}
 *
 * @example
 *
 * function Component() {
 *    const [data, setData] = useState();
 *    const prevData = useProvious(data);
 *    if(prevData!== data) {
 *       doSomething();
 *    }
 * }
 *
 * */
export default function usePrevious<T>(data: T, shouldInitialize = false) {
  const prevRef = useRef(shouldInitialize ? data : undefined);

  useEffect(() => {
    prevRef.current = data;
  });

  return prevRef.current;
}
