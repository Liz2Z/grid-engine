import { useCanvasState as _useCanvasState } from '../hooks.biz/useCanvasState';
import type * as Types from '../types';

/**
 * 用于获取当前元素是否正处于 拖拽或重置大小的 状态中
 *
 * */
export const useCanvasState = (): Types.CanvasState => {
  return _useCanvasState();
};
