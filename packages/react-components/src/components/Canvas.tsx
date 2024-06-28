import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { CanvasElement } from './Element';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import useDidUpdate from '../hooks.common/useDidUpdate';
import type * as Types from '../types';
import { useTrackResizeObserver } from '../hooks.biz/useTrackerResizeObserver';

type ElementType = typeof CanvasElement;

export interface CanvasProps {
  children: React.ReactElement<any, ElementType> | React.ReactElement<any, ElementType>[];
  className?: string;
  style?: React.CSSProperties;

  onMount?: (size: { cellHeight: number; cellWidth: number }) => void;
  Background?: React.FC<{
    offsetTop: number;
    containerInfo: Types.ContainerRect;
  }>;
}

export const Canvas = ({ children, onMount = noWork, Background, className, style }: CanvasProps) => {
  const [containerRect, setContainerRect] = useState<Types.ContainerRect>();
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState(0);
  const trackElRef = useRef<HTMLDivElement>(null);

  useTrackResizeObserver(trackElRef, setContainerRect);

  // 将画布尺寸数据传递给外层组件，以防他们需要这些值做布局计算
  useDidUpdate(() => {
    if (containerRect) {
      onMount(containerRect);
    }
  }, [containerRect]);

  const scrollHandler = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    setScrollTop(currentTarget.scrollTop);
  }, []);

  return (
    <div className={classNames('lm-grid-layout-canvas', className)} style={style}>
      <div className="lm-grid-layout-canvas-track" ref={trackElRef} onScroll={scrollHandler}>
        {/* 子元素需要根据container的宽高布局来计算，所以需要等待container dom挂载之后 ， */}
        {/* 先获取container的信息，然后再渲染子元素 */}
        {containerRect
          ? React.Children.map(children, child =>
              React.cloneElement(child, {
                onWorking: setIsWorking,
                containerRect: containerRect,
                containerRef: trackElRef,
              }),
            )
          : null}
      </div>

      {containerRect && !!Background ? <Background offsetTop={scrollTop} containerInfo={containerRect} /> : null}

      {/* 当有子元素开始拖拽，或重置大小时，显示蒙版，不让鼠标与其它元素产生交互事件而影响执行效率 */}
      {isWorking && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 110,
          }}
        />
      )}
    </div>
  );
};
