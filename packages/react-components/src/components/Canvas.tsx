import React from 'react';
import classNames from 'classnames';
import { CanvasElement } from './Element';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import useDidUpdate from '../hooks.common/useDidUpdate';
import type * as Types from '../types';
import { useTrackResizeObserver } from '../hooks.biz/useTrackerResizeObserver';
import { CanvasStateProvider, useCanvasStateReducer } from '../hooks.biz/useCanvasState';
import { isNil } from './utils';
import { useTrackerScrollHandler } from '../hooks.biz/useTrackerScrollHandler';
import { useGlobalBlurHandler } from '../hooks.biz/useGlobalBlurHandler';

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
  const ctx = useCanvasStateReducer();

  const { trackElRef, containerRect } = useTrackResizeObserver();

  const [scrollTop, setScrollTop] = useTrackerScrollHandler();

  useGlobalBlurHandler(ctx);

  // 将画布尺寸数据传递给外层组件，以防他们需要这些值做布局计算
  useDidUpdate(() => {
    if (containerRect) {
      onMount(containerRect);
    }
  }, [containerRect]);

  return (
    <CanvasStateProvider value={ctx}>
      <div className={classNames('lm-grid-layout-canvas', className)} style={style}>
        <div className="lm-grid-layout-canvas-track" ref={trackElRef} onScroll={setScrollTop}>
          {/* 子元素需要根据container的宽高布局来计算，所以需要等待container dom挂载之后 ， */}
          {/* 先获取container的信息，然后再渲染子元素 */}
          {containerRect
            ? React.Children.map(children, child =>
                React.cloneElement(child, {
                  containerRect: containerRect,
                  containerRef: trackElRef,
                }),
              )
            : null}
        </div>

        {containerRect && !!Background ? <Background offsetTop={scrollTop} containerInfo={containerRect} /> : null}

        {/* 当有子元素开始拖拽，或重置大小时，显示蒙版，不让鼠标与其它元素产生交互事件而影响执行效率 */}
        {isNil(ctx[0].working) ? null : (
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
    </CanvasStateProvider>
  );
};
