import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Element from './Element';
import { settings } from '@lazymonkey/grid-engine/src/settings';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import CanvasBackground from './CanvasBackground';
import useMountedState from '../hooks/useMountedState';
import observeElementSize from '@lazymonkey/grid-engine-utils/elementSizeObserver';
import useDidUpdate from '../hooks/useDidUpdate';

type ElementType = typeof Element;

interface CanvasProps {
  onMount?: (size: { cellHeight: number; cellWidth: number }) => void;
  children: React.ReactElement<any, ElementType> | React.ReactElement<any, ElementType>[];
  bg?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ContainerRect {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  rowCount: number;
}

const computeElRect = (el: HTMLElement) => {
  const { width, height } = el.getBoundingClientRect();
  const cellWidth = width / settings.NUMBER_OF_COLUMNS;

  // =================  方案一  ========================
  //
  // 将布局容器固定等分（水平xx 等分，竖直 xx 等分），这样，不论容器宽高如何变化，
  // 内部元素尺寸相对容器尺寸是固定的。但是元素的自身的宽高比会随容器宽高变化而变化。
  //
  // const cellHeight = height / NUMBER_OF_ROWS;

  // =================  方案二  ========================
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
  }
}

/**
 * 监听dom变化以重新计算大小
 * 
 * @param elRef track 元素
 * @param onChange 
 */
const useTrackResizeObserver = (elRef: React.RefObject<HTMLDivElement>, onChange: (val: ContainerRect) => void) => {
  const isMounted = useMountedState();
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  })

  /**
   * 监听dom变化以重新计算大小
   * */
  useEffect(() => {
    if (!elRef.current) {
      return;
    }

    // 初始化的时候先计算一次
    onChangeRef.current(computeElRect(elRef.current));

    return observeElementSize(elRef.current, ['clientWidth', 'clientHeight'], (_el: HTMLElement) => {
      if (!isMounted()) {
        return;
      }
      onChangeRef.current(computeElRect(_el));
    });
  }, [])
}

const Canvas = ({ children, onMount = noWork, bg = false, className, style }: CanvasProps) => {
  const [containerRect, setContainerRect] = useState<ContainerRect>();
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState(0);
  const trackElRef = useRef<HTMLDivElement>(null);



  useTrackResizeObserver(trackElRef, setContainerRect);

  // 将画布尺寸数据传递给外层组件，以防他们需要这些值做布局计算
  useDidUpdate(()=>{
    if(containerRect) {
      onMount(containerRect);
    }
  },[containerRect])


  const scrollHandler = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    setScrollTop(currentTarget.scrollTop);
  }, []);

  //  子元素需要根据container的宽高布局来计算，所以需要等待container dom挂载之后，
  //  先获取container的信息，然后再渲染子元素
  const content = containerRect
    ? React.Children.map(children, child =>
      React.cloneElement(child, {
        onWorking: setIsWorking,
        container: containerRect,
      }),
    )
    : null;


  return (
    <div className={classNames('lm-grid-layout-canvas', className)} style={style}>
      <div className="lm-grid-layout-canvas-track" ref={trackElRef} onScroll={scrollHandler}>
        {content}
      </div>

      {containerRect && bg ? <CanvasBackground offsetTop={scrollTop} containerInfo={containerRect} /> : null}

      {/* 当有子元素开始拖拽，或重置大小时，显示蒙版，不让鼠标与其它元素产生交互事件而影响执行效率 */}
      {isWorking && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default React.memo(Canvas);
