import handleDropEffect from './handleDropEffect.new';

/**
 * 自动布局计算
 */
// TODO: 某些情况可以不用计算掉落，从而节省运行时间
export default function handleNodeRemove(rects, movedId) {
  let result = new Map(rects);
  result.delete(movedId);
  result = handleDropEffect(result);
  return result;
}
