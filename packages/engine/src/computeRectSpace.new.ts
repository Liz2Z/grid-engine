/**
 * FIXME: 是否可以使用纯数学的方法解决
 */
import { settings } from './settings';
import createMatrix, { RectInMatrix } from './matrix/createMatrix.new';
import { bitWiseAnd, bitWiseOr, bitWiseXOr, leftShift, rightShift } from './operators';

const MAX_LOOP = 100000; /* 10万 */

/**
 * 假设：
 * width : 4
 * 总宽度 : 10
 *
 * 结果   : 111 111 0000
 *
 *
 * @param width
 * @returns
 */
const getBitLine = width => {
  return leftShift(2 ** width - 1, settings.NUMBER_OF_COLUMNS - width);
};

/**
 * 由左到右，由上往下，找到满足宽高条件的空白矩形。
 *
 * @param {number[]} matrix
 * @param {number} minWidth
 * @param {number} minHeight
 *
 */
export function findSpaceRect(
  matrix: (number | undefined)[],
  minWidth: number,
  minHeight: number,
): {
  left: number;
  top: number;
} {
  const bitLine = getBitLine(minWidth);
  let t = 0;

  do {
    let result = 0;
    // 集齐 minHeight 行的数据进行按位或
    for (let i = 0; i < minHeight; i += 1) {
      result = bitWiseOr(result, matrix[t + i] || 0);
    }

    // 从左到右扫描
    //
    //
    for (let l = 0, count = settings.NUMBER_OF_COLUMNS - minWidth; l <= count; l += 1) {
      const newBitLine = rightShift(bitLine, l);

      const diffResult = bitWiseAnd(newBitLine, result);

      if (diffResult === 0) {
        return {
          left: l,
          top: t,
        };
      }
    }

    t += 1;
  } while (t < MAX_LOOP);

  throw Error(`超出最大支持行数：${MAX_LOOP}`);
}

/**
 * 从左到右，从上到下，找到一个矩形的空白位置，
 * 放置新添加的元素。
 * */
export default function computeRectSpace(
  rects: Map<string, RectInMatrix>,
  width: number,
  height: number,
): { top: number; left: number } {
  const matrix = createMatrix(rects);
  const { top, left } = findSpaceRect(matrix, width, height);
  return { top, left };
}
