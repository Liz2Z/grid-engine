import React from 'react';
import GridEngine from '@lazymonkey/grid-engine-rc';

const Card: React.FC = () => {
  const mouseDownHandler = GridEngine.useElementMoveHandler();

  return (
    <div style={{ height: '100%', position: 'relative' }} onMouseDown={mouseDownHandler}>
      <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6, right: 6, backgroundColor: '#f1f1f1' }}></div>
    </div>
  );
};

export default React.memo(Card);
