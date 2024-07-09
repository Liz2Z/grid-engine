import React from 'react';
import { useCanvasState, useDispatch } from './useCanvasState';

export const useFocusHandler = ({ disabled, id }: { id: string; disabled: boolean }) => {
  const elRef = React.useRef<HTMLDivElement>(null);
  const canvasState = useCanvasState();
  const dispatch = useDispatch();

  /**
   * 当Element被点击后获得聚焦状态
   */
  const handler = React.useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const isFocusing = canvasState.focusing === id;

      if (isFocusing || disabled || (e && !e.currentTarget.contains(e.target as Node))) {
        return;
      }

      // 当点击的元素不为当前组件节点或子节点，
      // 让组件失去焦点
      const handleGlobalMouseDown = (event: MouseEvent) => {
        const el = elRef.current;

        if (!el) {
          document.removeEventListener('mousedown', handleGlobalMouseDown);
          return;
        }

        if (el === event.target || el.contains(event.target as Node)) {
          return;
        }

        dispatch({ focusing: undefined });
        document.removeEventListener('mousedown', handleGlobalMouseDown);
      };

      dispatch({ focusing: id });
      document.addEventListener('mousedown', handleGlobalMouseDown);
    },
    [disabled, id, canvasState.focusing],
  );

  return {
    handler,
    elRef,
  };
};
