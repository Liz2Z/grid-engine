import { useRef, useMemo } from 'react';
import * as Types from '../types'

export default function useResizeSignal(nextSize: Types.Position) {
  const curSizeRef = useRef({
    width: nextSize.width,
    height: nextSize.height,
  });

  /**
   * 当元素宽高改变后，触发一个信号，通过context告诉子组件需要resize
   * */
  const useResizeSignal = useMemo(() => {
    const curSize = curSizeRef.current;

    if (curSize.width !== nextSize.width || curSize.height !== nextSize.height) {
      // 尺寸发生改变，记录新的尺寸数据
      curSizeRef.current = {
        width: nextSize.width,
        height: nextSize.height,
      };
    }

    return curSizeRef.current;
  }, [nextSize]);

  return useResizeSignal;
}
