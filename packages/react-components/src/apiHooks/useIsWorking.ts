import React, { useContext } from 'react';

export const IsWorkingContext = React.createContext<boolean>(false);

/**
 * 用于获取当前元素是否正处于 拖拽或重置大小的 状态中
 *
 * */
export const useIsWorking = (): boolean => {
  const isWorking = useContext(IsWorkingContext);
  return isWorking;
};
