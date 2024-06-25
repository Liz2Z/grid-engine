/**
 * 操作类型检测，判断是否需要执行碰撞检测或掉落检测。
 * PS.无论是碰撞还是掉落检测都是很耗时的操作，我们通过判断用户操作类型尽量避免去做检测
 *  */
export default function operationDetect(prevRect, nextRect) {
  const topChange = nextRect.top - prevRect.top;
  const leftChange = nextRect.left - prevRect.left;
  const widthChange = nextRect.width - prevRect.width;
  const heightChange = nextRect.height - prevRect.height;

  let shouldDetectCollision = false;
  let shouldDetectDrop = false;

  // > 0   增大
  // === 0 不变
  // < 0   减小
  if (
    widthChange > 0 ||
    heightChange > 0 ||
    (heightChange < 0 && topChange !== 0)
  ) {
    // 需要进行碰撞检测
    // - 宽度增加
    // - 高度增加
    // - 高度减小同时物体向下移动
    shouldDetectCollision = true;
  }

  if (widthChange < 0 || heightChange !== 0) {
    // 需要进行掉落检测
    // - 宽度缩小
    // - 高度改变
    shouldDetectDrop = true;
  }

  if (
    (heightChange === 0 && topChange !== 0) ||
    (widthChange === 0 && leftChange !== 0)
  ) {
    // 需要进行碰撞、掉落检测
    // - 物体的上下左右移动
    shouldDetectCollision = true;
    shouldDetectDrop = true;
  }

  return [shouldDetectCollision, shouldDetectDrop];
}
