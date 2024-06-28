import useDidUpdate from '../hooks.common/useDidUpdate';
import usePrevious from '../hooks.common/usePrevious';
import type * as Types from '../types';

export default function useIndicatorPositionReset({
  position,
  disabled,
  state,
  setState,
}: {
  position: Types.Position;
  disabled: boolean;
  state: Types.ElementState;
  setState: React.Dispatch<Partial<Types.ElementState>>;
}) {
  const previousIsWorking = usePrevious(state.isWorking);

  // 重置大小或移动操作结束后，将指示器归位
  useDidUpdate(() => {
    if (previousIsWorking !== state.isWorking && !state.isWorking) {
      setState({ indicatorPosition: position });
    }
  }, [position, state.isWorking, previousIsWorking]);

  // 元素position发生改变，当元素处于聚焦状态时，此时需要重置指示器位置
  useDidUpdate(() => {
    if (!disabled && !state.isWorking && (state.isHovering || state.isFocusing)) {
      setState({ indicatorPosition: position });
    }
  }, [position]);
}
