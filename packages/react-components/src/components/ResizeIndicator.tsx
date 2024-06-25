// TODO: 可以优化，不需要这么多节点
import React, { MouseEventHandler } from 'react';
import cn from 'classnames';

type ElementOf<T> = T extends (infer E)[] ? E : T;

// 用于重置大小的DOM锚点名
//                      上左  上   上右   右   右下  下    左下  左
export type Anchors = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
export type Anchor = ElementOf<Anchors>;

const anchors: Anchors = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

// 用于移动的线
export type Lines = ['n', 'e', 's', 'w'];
export type Line = ElementOf<Lines>;

const lines = ['n', 'e', 's', 'w'];

interface Position {
  top: number;
  left: number;
  height: number;
  width: number;
}

interface ResizeIndicatorProps {
  position: Position;
  isWorking: boolean;
  onResizeStart: MouseEventHandler;
}

const ResizeIndicator = ({ position, isWorking, onResizeStart }: ResizeIndicatorProps) => {
  return (
    <div className={cn('lm-grid-layout-resize-indicator', isWorking && '__active')} style={position}>
      {anchors.map(anchor => (
        <div
          key={anchor}
          data-direction={anchor}
          role="none"
          onMouseDown={onResizeStart}
          className="lm-grid-layout-resize-anchor"
        />
      ))}

      {lines.map(line => (
        <div
          key={line}
          data-direction={line}
          role="none"
          onMouseDown={onResizeStart}
          className="lm-grid-layout-resize-line"
        />
      ))}
    </div>
  );
};

export default React.memo(ResizeIndicator);
