import React from 'react';
import type * as Types from '../types';

/**
 * 点击空白处时，让组件失去焦点
 */
export const useGlobalBlurHandler = (ctx: readonly [Types.CanvasState, React.Dispatch<Partial<Types.CanvasState>>]) => {
  const [state, dispatch] = ctx;

  // 当点击的元素不为当前组件节点或子节点，
  // 让组件失去焦点
  const realHandler = (event: MouseEvent) => {
    if (!state.focusing) {
      return;
    }

    const evtTarget = event.target as HTMLElement;
    const elements = [...document.querySelectorAll('[data-ge-element]')];

    const terminal = elements.some(element => {
      return evtTarget === element || element.contains(evtTarget);
    });

    if (terminal) {
      return;
    }

    dispatch({ focusing: undefined });
  };

  const handlerRef = React.useRef(realHandler);

  React.useEffect(() => {
    handlerRef.current = realHandler;
  });

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      handlerRef.current(event);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);
};
