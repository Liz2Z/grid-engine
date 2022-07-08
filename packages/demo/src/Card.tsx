import React from 'react';
import { useElementMoveHandler } from '@lazymonkey/grid-engine-rc';

const Card: React.FC = () => {
  const mouseDownHandler = useElementMoveHandler();

  return (
    <div className="h-full relative" onMouseDown={mouseDownHandler}>
      <div className="absolute inset-0 bg-purple-200"></div>
    </div>
  );
};

export default React.memo(Card);
