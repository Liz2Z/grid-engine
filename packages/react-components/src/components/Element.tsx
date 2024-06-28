/* ******************************************************************
布局：
  - 指示器的布局不能依赖于元素。指示器在拖动的时候，元素也需要移动，
  如果指示器依赖于元素进行布局，计算将非常麻烦
****************************************************************** */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import diffObjectValues from '@lazymonkey/grid-engine-utils/diffObjectValues';
import ResizeIndicator from './ResizeIndicator';
import useResizeSignal from '../hooks.biz/useResizeSignal';
import useElementMoveHandler from '../hooks.biz/useElementMoveHandler';
import useElementResizeHandler from '../hooks.biz/useElementResizeHandler';
import useResetIndicatorPosition from '../hooks.biz/useIndicatorPositionReset';
import { layoutUnitToStyleUnit, styleUnitToLayoutUnit } from './utils';
import { IsWorkingContext } from '../hooks.exports/useIsWorking';
import { ElementResizeContext } from '../hooks.exports/useElementResize';
import { ElementMoveInteraction } from '../hooks.exports/useElementMoveHandler';
import { settings } from '@lazymonkey/grid-engine/src/settings';
import GridEngine from '@lazymonkey/grid-engine';
import type * as Types from '../types';
import { useFocusHandler } from '../hooks.biz/useElementFocusHandler';

export interface ElementProps {
  containerRect?: Types.ContainerRect; // 由父组件注入
  onWorking?: (isWorking: boolean) => void; // 由父组件注入
  containerRef?: React.RefObject<HTMLDivElement>; // 由父组件注入

  id: string;
  layout?: Types.Layout;
  disabled?: boolean;
  children?: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  onLayoutChange?: (id: string, rect: GridEngine.Rect) => void;
}

const defaultLayout = {
  top: 0,
  left: 0,
  width: 2,
  height: 2,
};

export const CanvasElement = ({
  containerRef: _containerRef,
  containerRect,
  onWorking = noWork,

  id,
  children,
  layout = defaultLayout,
  disabled = false,
  onLayoutChange = noWork,
  minHeight = 1,
  minWidth = 1,
}: ElementProps) => {
  if (typeof containerRect === 'undefined') {
    throw Error('Canvas.Element 必须作为 Canvas 组件的子组件使用');
  }

  const containerRef = _containerRef!; // omit undefined

  /** 大小/位置 的限制 */
  const limitRect = useMemo<Types.LimitRect>(
    () => ({
      ...containerRect,
      minHeight: containerRect.cellHeight * minHeight,
      minWidth: containerRect.cellWidth * minWidth,
    }),
    [containerRect, minHeight, minWidth],
  );

  /** Canvas Element CSS 布局信息 */
  const position = useMemo<Types.Position>(
    () => layoutUnitToStyleUnit(layout, containerRect.cellHeight, containerRect.cellWidth, settings.ELEMENT_SPACING),
    [containerRect, layout],
  );

  /** 元素尺寸改变的信号，用于通知子组件重新渲染 */
  const resizeSignal = useResizeSignal(position);

  const [state, setState] = React.useReducer(
    (state: Types.ElementState, partial: Partial<Types.ElementState>): Types.ElementState => ({
      ...state,
      ...partial,
    }),
    {
      isHovering: false,
      isWorking: false,
      isFocusing: false,
      indicatorPosition: position,
    },
  );

  const { handler: focus, elRef } = useFocusHandler({ disabled, isFocusing: state.isFocusing, setState });

  // TODO 忘记这么写的意义了，看看能不能删掉
  // 指示器状态
  const originalPositionRef = useRef<Types.Position>(position);

  /**
   * 切换hover状态
   */
  const hoverStart = useCallback(
    (e: React.MouseEvent) => {
      if (state.isWorking || state.isHovering || disabled || !e.currentTarget.contains(e.target as HTMLElement)) {
        // 当重置大小的时候，鼠标快速移动会经常触发这个函数，
        // 但是这个时候我们没必要做任何操作，直接返回
        return;
      }
      originalPositionRef.current = position;
      setState({ isHovering: true, indicatorPosition: position });
    },
    [disabled, state.isHovering, state.isWorking, position],
  );

  const hoverEnd = useCallback(() => {
    if (state.isWorking || disabled /* || !e.currentTarget.contains(e.target) */) {
      return;
    }
    setState({ isHovering: false });
  }, [disabled, state.isWorking]);

  /**
   * 准备开始重置大小
   */
  const handleResizeStart = useCallback(() => {
    originalPositionRef.current = position;

    if (!state.isFocusing) {
      focus();
    }

    onWorking(true);
    setState({ isWorking: true, indicatorPosition: position });
  }, [focus, state.isFocusing, onWorking, position]);

  // 用于性能优化减少 props.onLayoutChange的调用次数
  const previousRectRef = useRef({});

  /**
   * 重新设置元素 位置、尺寸
   */
  const handleResizing = ({ position: _position }: { position: Types.Position }) => {
    const { cellWidth, cellHeight } = containerRect;
    const newRect = styleUnitToLayoutUnit(_position, cellHeight, cellWidth, settings.ELEMENT_SPACING);
    const isChanged = diffObjectValues(newRect, previousRectRef.current);

    setState({ indicatorPosition: _position });

    if (isChanged) {
      previousRectRef.current = newRect;
      onLayoutChange(id, newRect);
    }
  };

  /**
   * 重置结束🔚
   */
  const handleResizeEnd = () => {
    onWorking(false);
    setState({ isWorking: false });
  };

  // 元素重置大小交互
  const onResizeStart = useElementResizeHandler(
    originalPositionRef.current,
    state.indicatorPosition,
    limitRect,
    handleResizeStart,
    handleResizing,
    handleResizeEnd,
    containerRef.current!,
  );

  // 元素移动交互
  const onMoveStart = useElementMoveHandler(
    originalPositionRef.current,
    state.indicatorPosition,
    limitRect,
    handleResizeStart,
    handleResizing,
    handleResizeEnd,
  );

  // 在特定情况下，重新设置指示器位置
  useResetIndicatorPosition({
    position,
    disabled,
    state,
    setState,
  });

  const isElementActive = state.isFocusing || state.isWorking;
  const isIndicatorVisible = !disabled && (state.isHovering || state.isFocusing || state.isWorking);

  //
  // 因为指示器是受hover状态控制，鼠标移入显示，移出隐藏。如果将onMouseEnter 监听
  // 放在内层 div上，当鼠标移入指示器时就会触发moveleave，导致指示器直接消失。将
  // onMouseEnter 监听放在外层就可以解决此问题，因为事件冒泡，只要鼠标还在外层div
  // 的子元素内，都会触发mouseEnter。
  //
  return (
    <div onMouseEnter={hoverStart} onMouseLeave={hoverEnd}>
      {/* 尺寸设置指示器 */}
      {isIndicatorVisible && (
        <ResizeIndicator position={state.indicatorPosition} isWorking={state.isWorking} onResizeStart={onResizeStart} />
      )}

      {/* 内容 */}
      <div
        role="none"
        ref={elRef}
        style={position}
        onClick={focus}
        className={cn('lm-grid-layout-element', isElementActive && '__active')}
      >
        <ElementMoveInteraction.Provider value={disabled ? noWork : onMoveStart}>
          <ElementResizeContext.Provider value={resizeSignal}>
            <IsWorkingContext.Provider value={state.isWorking}>
              <div className="lm-grid-layout-element-children">{children}</div>
            </IsWorkingContext.Provider>
          </ElementResizeContext.Provider>
        </ElementMoveInteraction.Provider>
      </div>
    </div>
  );
};
