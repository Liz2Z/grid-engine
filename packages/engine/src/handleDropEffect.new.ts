import createMatrix, { RectInMatrix } from './matrix/createMatrix.new';
import { transformBlockTop } from './matrix/transform.new';
import sortRects from './sortRects.new';
import getBitLine from './matrix/getBitLine';
import { bitWiseAnd, bitWiseXOr } from './operators';

/**
 * 检测空白行
 */
function checkSpaceLine(line, bitLine) {
  const diffResult = bitWiseAnd(bitWiseXOr(line, bitLine), bitLine);
  return diffResult === bitLine;
}

/**
 * 单个元素节点的掉落检测
 */
function nodeDropDetect(matrix: (number | undefined)[], bitLine: number, lineIndex: number) {
  if (lineIndex < 0) {
    // 元素已处于最顶端
    return 0;
  }

  const line = matrix[lineIndex];

  // 没有此行
  if (!line) {
    return nodeDropDetect(matrix, bitLine, lineIndex - 1);
  }

  const isWideEnough = checkSpaceLine(line, bitLine);

  if (!isWideEnough) {
    // 宽度不够，return
    return lineIndex + 1;
  }

  return nodeDropDetect(matrix, bitLine, lineIndex - 1);
}

/**
 * 掉落检测及副作用处理。
 *
 * 方法：遍历所有节点，然后将其上移，直到产生碰撞或到达顶端。
 *
 * 1. 将当前所有的元素转换成 matrix
 * 2. 根据元素 width left 生成 bitLine
 * 3. 将 bitLine 与 matrix 中上一行的bitLine 进行 按异或 后 按位与 与bitLine 比较
 *
 * */
// TODO 可以继续优化
export default function handleDropEffect(rects: Map<string, RectInMatrix>) {
  const sortedRects: [string, RectInMatrix][] = sortRects(rects);

  const matrix = createMatrix(rects);

  for (let i = 0, len = sortedRects.length; i < len; i += 1) {
    const [id, rect] = sortedRects[i];

    // 排除掉已经处于顶端的
    if (rect.top <= 0) {
      continue;
    }

    // 掉落检测后的 新定位信息
    const bitLine = getBitLine(rect.width, rect.left);
    const newTop = nodeDropDetect(matrix, bitLine, rect.top - 1);

    if (newTop === rect.top) {
      continue;
    }

    const newRect = {
      ...rect,
      top: newTop,
    };

    rects.set(id, newRect);

    transformBlockTop(matrix, rect, newRect, id);
  }

  return rects;
}
