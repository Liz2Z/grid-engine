import { useRef, useCallback } from 'react';
import useMouseEvent from './useMouseEvent';
import { Position, LimitRect } from '../components/Element';
import { Anchor } from '../components/ResizeIndicator';

/**
 * 矫正resize结果
 */
const correctPosition = (newPosition: Position, currentPosition: Position, limitRect: LimitRect): Position => {
  const result = { ...newPosition };

  // 左侧不允许超限
  const diffLeft = 0 - newPosition.left;
  if (diffLeft > 0) {
    result.left += diffLeft;
    result.width -= diffLeft;
  }

  // 顶部不允许超限
  const diffTop = 0 - newPosition.top;
  if (diffTop > 0) {
    result.top += diffTop;
    result.height -= diffTop;
  }

  // 右侧不允许超限
  const diffRight = 0 + limitRect.width - newPosition.width - newPosition.left;
  if (diffRight <= 0) {
    result.width += diffRight;
  }

  // 最小高宽限制
  if (result.width < limitRect.minWidth) {
    result.width = limitRect.minWidth;
    result.left = currentPosition.left;
  }
  if (result.height < limitRect.minHeight) {
    result.height = limitRect.minHeight;
    result.top = currentPosition.top;
  }

  return result;
};

export default function useElementResizeHandler(
  originalPosition: Position,
  indicatorPosition: Position,
  limitRect: LimitRect,
  onChangeStart: () => void,
  onChange: (v: Position) => void,
  onChangeEnd: () => void,
) {
  const workingInProgressAnchor = useRef<Anchor>();

  /**
   * anchor mouseDown 监听函数
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const { target } = event;
      const { direction } = (target as HTMLElement).dataset;

      workingInProgressAnchor.current = direction as Anchor;
      onChangeStart();
    },
    [onChangeStart],
  );

  /**
   * anchor mouseMove 监听函数
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent, { directionX, directionY }: { directionX: number; directionY: number }) => {
      const { left, top, width, height } = originalPosition;
      let newPosition = indicatorPosition;

      switch (workingInProgressAnchor.current) {
        case 'nw': // 左上↖
          newPosition = {
            top: top + directionY,
            left: left + directionX,
            width: width - directionX,
            height: height - directionY,
          };
          break;
        case 'n': // 上👆
          newPosition = {
            ...indicatorPosition,
            top: top + directionY,
            height: height - directionY,
          };
          break;
        case 'ne': // 右上↗
          newPosition = {
            left,
            top: top + directionY,
            width: width + directionX,
            height: height - directionY,
          };
          break;
        case 'e': // 右👉
          newPosition = {
            ...indicatorPosition,
            width: width + directionX,
          };
          break;
        case 'se': // 右下↘
          newPosition = {
            top,
            left,
            width: width + directionX,
            height: height + directionY,
          };
          break;
        case 's': // 下👇
          newPosition = {
            ...indicatorPosition,
            height: height + directionY,
          };
          break;
        case 'sw': // 左下↙
          newPosition = {
            top,
            left: left + directionX,
            width: width - directionX,
            height: height + directionY,
          };
          break;
        case 'w': // 左👈
          newPosition = {
            ...indicatorPosition,
            left: left + directionX,
            width: width - directionX,
          };
          break;
        default:
          break;
      }

      newPosition = correctPosition(newPosition, indicatorPosition, limitRect);

      onChange(newPosition);
    },
    [originalPosition, indicatorPosition, limitRect, onChange],
  );

  /**
   *  mouseUp 监听函数
   */
  const handleMouseUp = useCallback(() => {
    workingInProgressAnchor.current = undefined;
    onChangeEnd();
  }, [onChangeEnd]);

  const returnMouseDown = useMouseEvent({
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  });

  return returnMouseDown;
}
