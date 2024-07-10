import React from 'react';
import useMouseEvent from '../hooks.common/useMouseEvent';
import type * as Types from '../types';

/**
 * 矫正move结果
 */
const correctMoveLayout = (position: Types.Position, limitRect: Types.LimitRect): Types.Position => {
  const result = { ...position };

  // 左侧不允许超限
  const diffLeft = 0 - position.left;
  if (diffLeft > 0) {
    result.left += diffLeft;
  }

  // 顶部不允许超限
  const diffTop = 0 - position.top;
  if (diffTop > 0) {
    result.top += diffTop;
  }

  // 右侧不允许超限
  const diffRight = limitRect.width - position.width - position.left;
  if (diffRight <= 0) {
    result.left += diffRight;
  }

  return result;
};

/**
 * 卡片移动交互 hook
 *
 * */
export default function useElementMoveHandler(
  onChangeStart: () => void,
  onChange: (v: {
    event: MouseEvent;
    position: Types.Position;
    move: { directionX: number; directionY: number };
  }) => void,
  onChangeEnd: () => void,
  {
    currentPosition,
    limitRect,
  }: {
    currentPosition: Types.Position;
    limitRect: Types.LimitRect;
  },
) {
  // 当鼠标开始拖动时，要基于元素原始的位置计算当前位置
  const originalPositionRef = React.useRef<Types.Position>(currentPosition);

  /**
   * 开始移动元素
   */
  const handleMove = React.useCallback(
    (e: MouseEvent, { directionX, directionY }: { directionX: number; directionY: number }) => {
      const { left, top } = originalPositionRef.current;
      let newPosition = currentPosition;

      newPosition = {
        ...originalPositionRef.current,
        top: top + directionY,
        left: left + directionX,
      };

      newPosition = correctMoveLayout(newPosition, limitRect);

      onChange({ event: e, position: newPosition, move: { directionX, directionY } });
    },
    [currentPosition, limitRect, onChange],
  );

  const returnOnMoveStart = useMouseEvent({
    onMouseDown: () => {
      originalPositionRef.current = currentPosition;
      onChangeStart();
    },
    onMouseMove: handleMove,
    onMouseUp: onChangeEnd,
  });

  return returnOnMoveStart;
}
