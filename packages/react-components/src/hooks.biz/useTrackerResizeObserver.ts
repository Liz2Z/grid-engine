import React, { useEffect, useRef } from 'react';
import useMountedState from '../hooks.common/useMountedState';
import observeElementSize from '@lazymonkey/grid-engine-utils/elementSizeObserver';
import { settings } from '@lazymonkey/grid-engine/src/settings';
import type * as Types from '../types';

const computeElRect = (el: HTMLElement) => {
  const width = el.clientWidth;
  const height = el.clientHeight;
  const cellWidth = width / settings.NUMBER_OF_COLUMNS;

  // =================  方案一  ========================
  //
  // 将布局容器固定等分（水平xx 等分，竖直 xx 等分），这样，不论容器宽高如何变化，
  // 内部元素尺寸相对容器尺寸是固定的。但是元素的自身的宽高比会随容器宽高变化而变化。
  //
  if (settings.NUMBER_OF_ROWS > 0) {
    const cellHeight = height / settings.NUMBER_OF_ROWS;

    return {
      width,
      height,
      cellWidth,
      cellHeight,
      rowCount: settings.NUMBER_OF_ROWS,
    };
  }

  // =================  方案二  ========================
  //
  // 布局容器垂直 xx 等分，网格宽度随容器宽度变化，但高度固定
  // 这样在容器宽度变化时，垂直方向上的可视元素数量不变，不保证元素的宽高比
  //
  if (settings.CELL_HEIGHT) {
    return {
      width,
      height,
      cellWidth,
      cellHeight: settings.CELL_HEIGHT + settings.ELEMENT_SPACING,
      rowCount: Math.ceil(height / settings.CELL_HEIGHT),
    };
  }

  // =================  方案三  ========================
  //
  // 假设为正方形，即高度===宽度，求出有竖列上有多少个单元格，舍弃小数位
  // 根据纵向单元格数量矫正单元格精确高度。这样我们第一屏上始终都是完整的单元格，
  // 且能让卡片在不同容器大小的情况下保证宽高比。
  //
  const rowCount = Math.round(height / cellWidth);
  const cellHeight = height / rowCount;

  return {
    width,
    height,
    cellWidth,
    cellHeight,
    rowCount,
  };
};

/**
 * 监听dom变化以重新计算大小
 *
 */
export const useTrackResizeObserver = (): {
  containerRect: Types.ContainerRect | undefined;
  trackElRef: React.RefObject<HTMLDivElement>;
} => {
  const [containerRect, setContainerRect] = React.useState<Types.ContainerRect>();
  const trackElRef = useRef<HTMLDivElement>(null);
  const isMounted = useMountedState();

  /**
   * 监听dom变化以重新计算大小
   * */
  useEffect(() => {
    if (!trackElRef.current) {
      return;
    }

    // 初始化的时候先计算一次
    setContainerRect(computeElRect(trackElRef.current));

    return observeElementSize(trackElRef.current, ['clientWidth', 'clientHeight'], (_el: HTMLElement) => {
      if (!isMounted()) {
        return;
      }
      setContainerRect(computeElRect(_el));
    });
  }, []);

  return {
    containerRect,
    trackElRef,
  };
};
