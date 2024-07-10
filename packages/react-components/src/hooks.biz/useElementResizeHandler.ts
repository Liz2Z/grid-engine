import { useEffect, useRef } from 'react';
import useMouseEvent from '../hooks.common/useMouseEvent';
import { Anchor } from '../components/ResizeIndicator';
import type * as Types from '../types';
import { settings } from '../settings';

/**
 * 矫正resize结果，防止超出容器范围
 */
const correctPosition = (
  newPosition: Types.Position,
  currentPosition: Types.Position,
  limitRect: Types.LimitRect,
): Types.Position => {
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

const isTouchBottomCheck = ({ event, trackerEl }: { trackerEl: HTMLElement; event: MouseEvent }) => {
  // 鼠标距离滚动容器底部还有 3px 的时候，认为触底，正常情况下这个判断依据应该是 0 ，
  // 但是有时候会存在 1px 误差，因此这里加了 3px 的容错。
  // 比如，当全屏幕情况，即，容器高度等于window.innerHeight，触底时的情况应该是 ：
  // clientY === window.innerHeight，但是 clientY 总是会少 1px
  const TOUCH_BOTTOM_RANGE = settings.TOUCH_BOTTOM_RANGE; /* 默认 3px */

  const { clientY } = event;
  const isTouchBottom = window.innerHeight - clientY <= TOUCH_BOTTOM_RANGE;

  if (isTouchBottom) {
    return true;
  }
  const rect = trackerEl.getBoundingClientRect();
  return rect.y + rect.height - clientY <= TOUCH_BOTTOM_RANGE;
};

const defaultState = () => ({
  /** 记录 mousedown 时容器的 scrollTop */
  originalScrollTop: 0,
  /** 记录该 hook 内部增量 */
  increase: 0,
  /* 记录鼠标移动的信息 */
  prevMove: { directionX: 0, directionY: 0 },
  /* 鼠标移动到底部后，固定不动一定时间后，自动触发滚动事件 */
  hasTimer: false,
  frameTimestamp: 0,
});

/**
 * resize 时，鼠标向下拖动触底后，物理上移动距离无法继续增加，所以需要通过算法补偿，以获得虚拟的移动距离
 */
const useTouchBottom = ({
  trackerEl,
  limitRect,
  onChange,
}: {
  trackerEl: HTMLElement;
  limitRect: Types.LimitRect;
  onChange: (move: { directionX: number; directionY: number }) => void;
}) => {
  const cacheRef = useRef(defaultState());
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const recordTimer = () => {
    // 保证同一时间只会有一个
    if (cacheRef.current.hasTimer) {
      return;
    }

    cacheRef.current.hasTimer = true;

    requestAnimationFrame(timestamp => {
      if (!cacheRef.current.hasTimer) {
        return;
      }

      // 有的时候，requestAnimationFrame 执行间隔仅有 0.0000000000000x ms，因此这里需要做个截流
      if (timestamp - cacheRef.current.frameTimestamp > 11) {
        cacheRef.current.frameTimestamp = timestamp;

        // 开始触发
        const { originalScrollTop, prevMove } = cacheRef.current;
        const AUTO_INCREASE_SPEED = settings.AUTO_INCREASE_SPEED;
        cacheRef.current.increase += AUTO_INCREASE_SPEED;
        trackerEl.scrollTop = originalScrollTop + cacheRef.current.increase;

        onChangeRef.current({
          ...prevMove,
          directionY: prevMove.directionY + cacheRef.current.increase,
        });
      }

      cacheRef.current.hasTimer = false;
      recordTimer();
    });
  };

  const resetTimer = () => {
    cacheRef.current.hasTimer = false;
    cacheRef.current.frameTimestamp = 0;
  };

  /* 初始化状态，准备 */
  const setup = () => {
    cacheRef.current = defaultState();
    cacheRef.current.originalScrollTop = trackerEl.scrollTop;
  };

  const clear = () => {
    cacheRef.current = defaultState();
  };

  const trigger = ({ event, move }: { event: MouseEvent; move: { directionX: number; directionY: number } }) => {
    const {
      originalScrollTop,
      prevMove: { directionY: prevDirectionY },
      increase,
    } = cacheRef.current;

    cacheRef.current.prevMove = move;

    resetTimer();

    // 鼠标在起点下方
    const isAtBottom = move.directionY >= 0;
    // 鼠标从上往下滑动
    const isBottomToTop = move.directionY < prevDirectionY;

    const isIncreaseActive = increase > 0;

    const AUTO_INCREASE_SPEED = settings.AUTO_INCREASE_SPEED;

    if (isAtBottom) {
      const isTouchBottom = isTouchBottomCheck({ trackerEl, event });

      if (isTouchBottom) {
        // 触底, 鼠标只要移入这个区域，不再关心具体滑动方向，都认为是向下划动
        cacheRef.current.increase += AUTO_INCREASE_SPEED;
        trackerEl.scrollTop = originalScrollTop + cacheRef.current.increase;
        recordTimer();
      } else {
        if (isBottomToTop) {
          if (isIncreaseActive) {
            cacheRef.current.increase -= AUTO_INCREASE_SPEED;
          }
        }
      }
    } else {
      if (isBottomToTop) {
        if (isIncreaseActive) {
          cacheRef.current.increase -= AUTO_INCREASE_SPEED;
        }
      }
    }

    return {
      directionX: move.directionX,
      directionY: move.directionY + cacheRef.current.increase,
    };
  };

  return { trigger, clear, setup };
};

export default function useElementResizeHandler(
  onChangeStart: () => void,
  onChange: (v: { position: Types.Position; move: { directionX: number; directionY: number } }) => void,
  onChangeEnd: () => void,
  {
    indicatorPosition,
    limitRect,
    trackerEl,
  }: {
    indicatorPosition: Types.Position;
    limitRect: Types.LimitRect;
    trackerEl: HTMLElement;
  },
) {
  /* 记录鼠标拖拽的锚地的方向 */
  const workingInProgressAnchor = useRef<Anchor>();
  /* 记录鼠标开始拖动时原始位置，后续的计算依赖此数据 */
  const originalPositionRef = useRef<Types.Position>(indicatorPosition);

  const touchBottomHandler = useTouchBottom({
    trackerEl,
    limitRect,
    onChange: (move: { directionX: number; directionY: number }) => {
      const { height } = originalPositionRef.current;

      const newPosition = {
        ...indicatorPosition,
        height: height + move.directionY,
      };

      onChange({ move, position: newPosition });
    },
  });

  return useMouseEvent({
    onMouseDown: (event: MouseEvent) => {
      const { target } = event;
      const { direction } = (target as HTMLElement).dataset;
      workingInProgressAnchor.current = direction as Anchor;
      originalPositionRef.current = indicatorPosition;
      touchBottomHandler.setup();
      onChangeStart();
    },
    onMouseMove: (event: MouseEvent, move: { directionX: number; directionY: number }) => {
      const { left, top, width, height } = originalPositionRef.current;
      let { directionX, directionY } = move;
      let newPosition = indicatorPosition;

      switch (workingInProgressAnchor.current) {
        case 'nw' /* 左上↖ */:
          newPosition = {
            top: top + directionY,
            left: left + directionX,
            width: width - directionX,
            height: height - directionY,
          };
          break;
        case 'n' /* 上👆 */:
          newPosition = {
            ...indicatorPosition,
            top: top + directionY,
            height: height - directionY,
          };
          break;
        case 'ne' /* 右上↗ */:
          newPosition = {
            left,
            top: top + directionY,
            width: width + directionX,
            height: height - directionY,
          };
          break;
        case 'e' /* 右👉 */:
          newPosition = {
            ...indicatorPosition,
            width: width + directionX,
          };
          break;
        case 'se' /* 右下↘  */: {
          const result = touchBottomHandler.trigger({ event, move });
          directionY = result.directionY;
          // directionX = result.directionX;

          newPosition = {
            top,
            left,
            width: width + directionX,
            height: height + directionY,
          };
          break;
        }
        case 's' /* 下👇 */: {
          const result = touchBottomHandler.trigger({ event, move });
          directionY = result.directionY;
          // directionX = result.directionX; 不影响X

          newPosition = {
            ...indicatorPosition,
            height: height + directionY,
          };
          break;
        }
        case 'sw' /* 左下↙ */: {
          const result = touchBottomHandler.trigger({ event, move });
          directionY = result.directionY;
          // directionX = result.directionX;

          newPosition = {
            top,
            left: left + directionX,
            width: width - directionX,
            height: height + directionY,
          };
          break;
        }
        case 'w' /* 左👈 */:
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

      onChange({
        move: { directionX, directionY },
        position: newPosition,
      });
    },
    onMouseUp: () => {
      workingInProgressAnchor.current = undefined;
      touchBottomHandler.clear();
      onChangeEnd();
    },
  });
}
