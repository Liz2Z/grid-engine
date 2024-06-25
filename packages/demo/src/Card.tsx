import * as React from 'react';
import { useElementMoveHandler } from '@lazymonkey/grid-engine-rc';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const mouseDownHandler = useElementMoveHandler();

  return (
    <div className="h-full relative" onMouseDown={mouseDownHandler}>
      <div className="absolute inset-0 bg-purple-200 text-ellipsis overflow-hidden indent-1 whitespace-nowrap text-slate-700 text-lg">
        {children}
      </div>
    </div>
  );
};

export default React.memo(Card);
