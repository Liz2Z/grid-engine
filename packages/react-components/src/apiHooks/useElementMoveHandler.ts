import React, { useContext } from 'react';

/**
 * 用于元素拖拽移动交互 context
 * */
export const ElementMoveInteraction = React.createContext<(event: React.MouseEvent<HTMLElement>) => void>(
  () => undefined,
);

/**
 * 用于元素拖拽移动交互
 * */
export default function useElementMoveHandler() {
  return useContext(ElementMoveInteraction);
}
