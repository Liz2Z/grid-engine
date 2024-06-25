import React, { useContext, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

/**
 * 用于在元素layout信息改变后，通知子组件重置大小
 * */
export const ElementResizeContext = React.createContext<{
  height: number;
  width: number;
}>({ height: 0, width: 0 });

/**
 * 用于在元素layout信息改变后，通知子组件重置大小
 * */
export function useElementResize(fn: (size: { height: number; width: number }) => void) {
  const size = useContext(ElementResizeContext);
  const debounce = useDebounce();

  useEffect(() => {
    debounce(() => {
      fn(size);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);
}
