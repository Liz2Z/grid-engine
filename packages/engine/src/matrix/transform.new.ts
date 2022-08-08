import { fillMatrix, RectInMatrix } from './createMatrix.new';

/**
 * 完全的移动
 */
function transformBlock(matrix: number[], from: RectInMatrix, to: RectInMatrix) {
  // 清零
  fillMatrix(matrix, 0, from.left, from.top, from.width, from.height);
  // 置 一
  fillMatrix(matrix, 1, to.left, to.top, to.width, to.height);
}

/**
 * 其它参数不变，只改变元素top属性
 */
export function transformBlockTop(matrix: number[], from: RectInMatrix, to: RectInMatrix) {
  const topDiff = to.top - from.top;

  if (topDiff === 0) {
    // 没有变化，不做操作
    return;
  }

  const changeZoneHeight = Math.abs(topDiff);
  const { left, width, height } = from;

  if (changeZoneHeight > height) {
    // 已经完全移动，没有覆盖区域
    transformBlock(matrix, from, to);
    return;
  }

  if (topDiff < 0) {
    // 上移
    const _top = from.top + (height - changeZoneHeight);
    // 清零
    fillMatrix(matrix, 0, left, _top, width, changeZoneHeight);
    // 置一
    fillMatrix(matrix, 1, left, to.top, width, changeZoneHeight);
  } else {
    // 清零
    fillMatrix(matrix, 0, left, from.top, width, changeZoneHeight);
    // 置一
    const _top = from.top + height;
    fillMatrix(matrix, 1, left, _top, width, changeZoneHeight);
  }
}
