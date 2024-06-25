import { useContext } from 'react';
import { ElementResizeContext } from './useElementResize';

/**
 * 获取当前元素大小
 * */
export default function useElementResize() {
  const size = useContext(ElementResizeContext);

  return size;
}
