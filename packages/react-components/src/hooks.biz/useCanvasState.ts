import React from 'react';
import type * as Types from '../types';

const CanvasStateContext = React.createContext<Types.CanvasState>({} as Types.CanvasState);

export const CanvasStateProvider = CanvasStateContext.Provider;

export const useCanvasState = () => {
  return React.useContext(CanvasStateContext);
};

export type CanvasStateDispatch = React.Dispatch<Partial<Types.CanvasState>>;

const DispatchContext = React.createContext<CanvasStateDispatch>(() => {
  /*  */
});

export const DispatchProvider = DispatchContext.Provider;

export const useDispatch = () => {
  return React.useContext(DispatchContext);
};
