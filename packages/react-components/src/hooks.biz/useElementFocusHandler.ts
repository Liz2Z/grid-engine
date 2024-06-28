import React from 'react';
import type * as Types from '../types';

export const useFocusHandler = ({
  disabled,
  isFocusing,
  setState,
}: {
  disabled: boolean;
  isFocusing: boolean;
  setState: React.Dispatch<Partial<Types.ElementState>>;
}) => {
  const elRef = React.useRef<HTMLDivElement>(null);

  /**
   * 当Element被点击后获得聚焦状态
   */
  const handler = React.useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

        // TODO: 组件卸载
        setState({ isFocusing: false });
        document.removeEventListener('mousedown', handleGlobalMouseDown);
      };

      setState({ isFocusing: true });
      document.addEventListener('mousedown', handleGlobalMouseDown);
    },
    [disabled, isFocusing],
  );

  return {
    handler,
    elRef,
  };
};
