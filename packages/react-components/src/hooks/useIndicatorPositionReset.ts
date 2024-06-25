import { Position } from '../components/Element';
import useDidUpdate from './useDidUpdate';
import usePrevious from './usePrevious';

export default function useIndicatorPositionReset(
  position: Position,
  isWorking: boolean,
  isHovering: boolean,
  isFocusing: boolean,
  disabled: boolean,
  setIndicatorPosition: (position: Position) => void,
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
