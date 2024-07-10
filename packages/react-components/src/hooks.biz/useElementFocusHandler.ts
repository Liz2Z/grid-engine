import React from 'react';
import { useCanvasState, useDispatch } from './useCanvasState';

export const useFocusHandler = ({ disabled, id }: { id: string; disabled: boolean }) => {
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

      dispatch({ focusing: id });
    },
    [disabled, id, canvasState.focusing],
  );

  return handler;
};
