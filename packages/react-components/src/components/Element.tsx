/* ******************************************************************
布局：
  - 指示器的布局不能依赖于元素。指示器在拖动的时候，元素也需要移动，
  如果指示器依赖于元素进行布局，计算将非常麻烦
****************************************************************** */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import { ContainerRect } from './Canvas';
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

/**
 * 用来表示元素在Canvas位置的类型。
 * 各个字段的值都是整型。
 * */
export interface Layout {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * 用来进行CSS布局的类型。
 * 各个字段的值为浮点型。单位px;
 */

export interface Position {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * 元素移动的限制区域大小
 * 缩放的限制尺寸
 *
 * */
export interface LimitRect {
  width: number;
  height: number;
  minHeight: number;
  minWidth: number;
}

export interface ElementProps {
  id: string;
  container?: ContainerRect; // 由父组件注入
  layout?: Layout;
  disabled?: boolean;
  children?: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  onLayoutChange?: (id: string, rect: GridEngine.Rect) => void;
  onWorking?: (isWorking: boolean) => void;
}

const defaultLayout = {
  top: 0,
  left: 0,
  width: 8,
  height: 8,
};

const useFocusHandler = ({
  disabled,
  canvasElRef,
}: {
  disabled: boolean;
  canvasElRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isFocusing, setIsFocusing] = useState(false); // focus状态显示边框

  /**
   * 当Element被点击后获得聚焦状态
   */
  const handler = useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isFocusing || disabled || (e && !e.currentTarget.contains(e.target as Node))) {
        return;
      }

      // 当点击的元素不为当前组件节点或子节点，
      // 让组件失去焦点
      const handleGlobalMouseDown = (event: MouseEvent) => {
        const canvasEl = canvasElRef.current;

        if (!canvasEl) {
          document.removeEventListener('mousedown', handleGlobalMouseDown);
          return;
        }

        if (canvasEl === event.target || canvasEl.contains(event.target as Node)) {
          return;
        }

        // TODO: 组件卸载
        setIsFocusing(false);
        document.removeEventListener('mousedown', handleGlobalMouseDown);
      };

      setIsFocusing(true);
      document.addEventListener('mousedown', handleGlobalMouseDown);
    },
    [disabled, isFocusing],
  );

  return [isFocusing, handler] as const;
};

export const CanvasElement = ({
  id,
  children,
  container,
  layout = defaultLayout,
  disabled = false,
  onLayoutChange = noWork,
  onWorking = noWork,
  minHeight = 1,
  minWidth = 1,
}: ElementProps) => {
  if (typeof container === 'undefined') {
    throw Error('Canvas.Element 组件必须作为 Canvas组件的子组件使用');
  }

  const [isHovering, setIsHovering] = useState(false); // hover状态显示resize指示器
  const [isWorking, setIsWorking] = useState(false); // 当resize指示器工作时
  const canvasElRef = useRef<HTMLDivElement>(null);

  // 获取重置大小/位置时的限制区域
  const limitRect = useMemo<LimitRect>(
    () => ({
      width: container.width,
      height: container.height,
      minHeight: container.cellHeight * minHeight,
      minWidth: container.cellWidth * minWidth,
    }),
    [container, minHeight, minWidth],
  );

  // 元素 CSS 布局样式
  const position = useMemo<Position>(() => {
    const { cellHeight, cellWidth } = container;
    return layoutUnitToStyleUnit(layout, cellHeight, cellWidth, settings.ELEMENT_SPACING);
  }, [container, layout]);

  const resizeSignal = useResizeSignal(position); // 元素尺寸改变的信号，用于通知子组件重新渲染

  const [isFocusing, focusHandler] = useFocusHandler({ disabled, canvasElRef });

  // 指示器状态
  const originalPositionRef = useRef<Position>(position);
  const [indicatorPosition, setIndicatorPosition] = useState<Position>(position);

  /**
   * 切换hover状态
   */
  const hoverStart = useCallback(
    (e: React.MouseEvent) => {
      if (isWorking || isHovering || disabled || !e.currentTarget.contains(e.target as HTMLElement)) {
        // 当重置大小的时候，鼠标快速移动会经常触发这个函数，
        // 但是这个时候我们没必要做任何操作，直接返回
        return;
      }
      originalPositionRef.current = position;
      setIsHovering(true);
      setIndicatorPosition(position);
    },
    [disabled, isHovering, isWorking, position],
  );

  const hoverEnd = useCallback(() => {
    if (isWorking || disabled /* || !e.currentTarget.contains(e.target) */) {
      return;
    }
    setIsHovering(false);
  }, [disabled, isWorking]);

  /**
   * 准备开始重置大小
   */
  const handleResizeStart = useCallback(() => {
    originalPositionRef.current = position;

    if (!isFocusing) {
      focusHandler();
    }

    onWorking(true);
    setIsWorking(true);
    setIndicatorPosition(position);
  }, [focusHandler, isFocusing, onWorking, position]);

  // 用于性能优化减少 props.onLayoutChange的调用次数
  const previousRectRef = useRef({});
  const previousPositionRef = useRef({});

  /**
   * 重新设置元素 位置、尺寸
   */
  const handleResizing = useCallback(
    (_position: Position) => {
      const { cellWidth, cellHeight } = container;
      const newRect = styleUnitToLayoutUnit(_position, cellHeight, cellWidth, settings.ELEMENT_SPACING);
      const isChanged = diffObjectValues(newRect, previousRectRef.current);
      previousRectRef.current = newRect;

      if (isChanged) {
        onLayoutChange(id, newRect);
      } else {
      }

      setIndicatorPosition(_position);
      previousPositionRef.current = _position;
    },
    [container, id, onLayoutChange],
  );

  /**
   * 重置结束🔚
   */
  const handleResizeEnd = useCallback(() => {
    onWorking(false);
    setIsWorking(false);
  }, [onWorking]);

  // 元素重置大小交互
  const onResizeStart = useElementResizeHandler(
    originalPositionRef.current,
    indicatorPosition,
    limitRect,
    handleResizeStart,
    handleResizing,
    handleResizeEnd,
  );

  // 元素移动交互
  const onMoveStart = useElementMoveHandler(
    originalPositionRef.current,
    indicatorPosition,
    limitRect,
    handleResizeStart,
    handleResizing,
    handleResizeEnd,
  );

  // 在特定情况下，重新设置指示器位置
  useResetIndicatorPosition(position, isWorking, isHovering, isFocusing, disabled, setIndicatorPosition);

  const isStyleActive = isFocusing || isWorking;
  const isIndicatorEnabled = !disabled && (isHovering || isFocusing || isWorking);

  /**
   * 因为指示器是受hover状态控制，鼠标移入显示，移出隐藏。如果将onMouseEnter 监听
   * 放在内层 div上，当鼠标移入指示器时就会触发moveleave，导致指示器直接消失。将
   * onMouseEnter 监听放在外层就可以解决此问题，因为事件冒泡，只要鼠标还在外层div
   * 的子元素内，都会触发mouseEnter。
   *
   * */
  return (
    <div onMouseEnter={hoverStart} onMouseLeave={hoverEnd}>
      {/* 尺寸设置指示器 */}
      {isIndicatorEnabled && (
        <ResizeIndicator
          position={indicatorPosition}
          isWorking={isWorking}
          // onMoveStart={onMoveStart}
          onResizeStart={onResizeStart}
        />
      )}

      {/* 内容 */}
      <div
        role="none"
        ref={canvasElRef}
        style={position}
        onClick={focusHandler}
        className={cn('lm-grid-layout-element', isStyleActive && '__active')}
      >
        <ElementMoveInteraction.Provider value={!disabled ? onMoveStart : noWork}>
          <ElementResizeContext.Provider value={resizeSignal}>
            <IsWorkingContext.Provider value={isWorking}>
              <div className="lm-grid-layout-element-children">{children}</div>
            </IsWorkingContext.Provider>
          </ElementResizeContext.Provider>
        </ElementMoveInteraction.Provider>
      </div>
    </div>
  );
};
