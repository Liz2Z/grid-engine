import operationDetect from './operationDetect';
import handleDropEffect from './handleDropEffect.new';
import handleCollisionEffect from './handleCollisionEffect';

/**
 * 自动布局计算
 */
export default function performAutoLayout(rects, movedId, movedRect) {
  let result = new Map(rects);

  result.set(movedId, movedRect);

  // 检测操作类型
  const prevRect = rects.get(movedId);
  const [shouldDetectCollision, shouldDetectDrop] = operationDetect(prevRect, movedRect);

  if (shouldDetectCollision) {
    // 元素移动过程中发生碰撞
    result = handleCollisionEffect(result, movedId, movedRect);
  }

  if (shouldDetectDrop) {
    // 元素移动过程中会发生掉落
    result = handleDropEffect(result);
  }

  return result;
}
