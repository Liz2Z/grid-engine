import React from 'react';
import type * as Types from '../types';

export const useElementState = (position: Types.Position) => {
  const [state, setState] = React.useState(() => ({
    isHovering: false,
    isWorking: false,
    isFocusing: false,
    indicatorPosition: position,
  }));

  return [state, setState] as const;
};
