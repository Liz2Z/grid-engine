import useDidUpdate from '../hooks.common/useDidUpdate';
import usePrevious from '../hooks.common/usePrevious';
import type * as Types from '../types';
import { useCanvasState } from './useCanvasState';

export default function useIndicatorPositionReset({
  position,
  disabled,
  id,
  setIndicatorPosition,
}: {
  position: Types.Position;
  disabled: boolean;
  id: string;
  setIndicatorPosition: (position: Types.Position) => void;
}) {
  const canvasState = useCanvasState();

  const isWorking = canvasState.working === id;
  const isHovering = canvasState.hovering === id;
  const isFocusing = canvasState.focusing === id;
  const previousIsWorking = usePrevious(isWorking);

  // 重置大小或移动操作结束后，将指示器归位
  useDidUpdate(() => {
    if (previousIsWorking !== isWorking && !isWorking) {
      setIndicatorPosition(position);
    }
  }, [position, isWorking, previousIsWorking]);

  // 元素position发生改变，当元素处于聚焦状态时，此时需要重置指示器位置
  useDidUpdate(() => {
    if (!disabled && !isWorking && (isHovering || isFocusing)) {
      setIndicatorPosition(position);
    }
  }, [position]);
}
