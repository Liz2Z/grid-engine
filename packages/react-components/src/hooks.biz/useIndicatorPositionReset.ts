import useDidUpdate from '../hooks.common/useDidUpdate';
import usePrevious from '../hooks.common/usePrevious';
import type * as Types from '../types';

export default function useIndicatorPositionReset(
  position: Types.Position,
  isWorking: boolean,
  isHovering: boolean,
  isFocusing: boolean,
  disabled: boolean,
  setIndicatorPosition: (position: Types.Position) => void,
) {
  const previousIsWorking = usePrevious(isWorking);

  useDidUpdate(() => {
    if (previousIsWorking !== isWorking && !isWorking) {
      // 重置大小或移动操作结束后，将指示器归位
      setIndicatorPosition(position);
    }
  }, [isWorking, position, previousIsWorking]);

  useDidUpdate(() => {
    if (!disabled && !isWorking && (isHovering || isFocusing)) {
      // 当元素处于聚焦状态时，元素position发生改变，此时需要重置指示器位置
      setIndicatorPosition(position);
    }
  }, [position]);
}
