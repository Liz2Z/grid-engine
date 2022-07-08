import { useCallback, useRef, useEffect } from 'react';
import observeElementSize from '@lazymonkey/grid-engine-utils/elementSizeObserver';
import useMountedState from './useMountedState';

/**
 * 监听DOM元素大小位置改变。
 *
 * 注意：每监听一个元素，都需要一个单独的hook。
 *
 * @example
 *  const observeElSize = useElementSizeObserver();
 *
 *  const onElMount = (el) =>{
 *    observeElSize(el, ['clientWidth', 'clientHeight'], el=>{
 *      // doSomething
 *    });
 *  }
 *
 *  <div ref={onElMount}></div>
 *
 * */
export default function useElementSizeObserver() {
  const ref = useRef<() => void>();
  const isMounted = useMountedState();

  const disconnect = useCallback(() => {
    if (typeof ref.current !== 'undefined') {
      ref.current();
    }
  }, []);

  const observe = useCallback(
    (el, attributes, callback) => {
      disconnect();

      ref.current = observeElementSize(el, attributes, (_el: HTMLElement) => {
        if (!isMounted()) {
          return;
        }

        callback(_el);
      });
    },
    [disconnect, isMounted],
  );

  useEffect(() => {
    return disconnect;
  }, [disconnect]);

  return observe;
}
