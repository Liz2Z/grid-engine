import React from 'react';
import type * as Types from '../types';

export type CanvasStateDispatch = React.Dispatch<Partial<Types.CanvasState>>;

const CanvasStateContext = React.createContext<readonly [Types.CanvasState, CanvasStateDispatch]>([
  {} as Types.CanvasState,
  () => {},
]);

export const CanvasStateProvider = CanvasStateContext.Provider;

export const useCanvasStateReducer = () => {
  const [state, dispatch] = React.useReducer(
    (state: Types.CanvasState, partial: Partial<Types.CanvasState>): Types.CanvasState => ({
      ...state,
      ...partial,
    }),
    {
      hovering: undefined,
      working: undefined,
      focusing: undefined,
    },
  );

  const ctx = React.useMemo(() => [state, dispatch] as const, [state, dispatch]);

  return ctx;
};

export const useCanvasState = () => {
  return React.useContext(CanvasStateContext)[0];
};

export const useDispatch = () => {
  return React.useContext(CanvasStateContext)[1];
};
