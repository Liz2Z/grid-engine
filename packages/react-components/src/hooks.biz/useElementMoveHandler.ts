import { useCallback } from 'react';
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
  originalPosition: Types.Position,
  currentPosition: Types.Position,
  limitRect: Types.LimitRect,
  onChangeStart: () => void,
  onChange: (v: {
    event: MouseEvent;
    position: Types.Position;
    move: { directionX: number; directionY: number };
  }) => void,
  onChangeEnd: () => void,
) {
  /**
   * 开始移动元素
   */
  const handleMove = useCallback(
    (e: MouseEvent, { directionX, directionY }: { directionX: number; directionY: number }) => {
      const { left, top } = originalPosition;
      let newPosition = currentPosition;

      newPosition = {
        ...originalPosition,
        top: top + directionY,
        left: left + directionX,
      };

      newPosition = correctMoveLayout(newPosition, limitRect);

      onChange({ event: e, position: newPosition, move: { directionX, directionY } });
    },
    [originalPosition, currentPosition, limitRect, onChange],
  );

  const returnOnMoveStart = useMouseEvent({
    onMouseDown: onChangeStart,
    onMouseMove: handleMove,
    onMouseUp: onChangeEnd,
  });

  return returnOnMoveStart;
}
