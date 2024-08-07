import { settings } from '../settings';
import { bitWiseAnd, bitWiseOr, bitWiseXOr } from '../operators';
import getBitLine from './getBitLine';

export const currentIdRef: { current: undefined | string } = { current: undefined };
export const fromRef: { current: undefined | string } = { current: undefined };

const fillMatrixWith_1 = (matrix: (number | undefined)[], left: number, top: number, width: number, height: number) => {
  let y = top;
  const endY = top + height;
  const newBitLine = getBitLine(width, left);

  do {
    const line = matrix[y];

    if (!line) {
      matrix[y] = newBitLine;
    } else {
      if (process.env.NODE_ENV === 'development') {
        const conflict = bitWiseAnd(line, newBitLine);

        if (conflict !== 0) {
          console.log(
            '%c【冲突】%c 该位置已被置为1，再次设置可能是个错误。\n' +
              `%cOldBit:${line.toString(2)};\n` +
              `%cNewBit:${newBitLine.toString(2)};\n` +
              `%cConflictBit:${conflict.toString(2)};\n` +
              `line: ${y};\n` +
              `id: ${currentIdRef.current};\n` +
              `calledBy fn: ${fromRef.current};`,
            'background: red;color:white;',
            'color: #555;',
            'color: #aaa',
          );
        }
      }

      matrix[y] = bitWiseOr(line, newBitLine);
    }

    y += 1;
  } while (y < endY);

  return matrix;
};

/**
 * 1111 1111 1111 1111 1111 1111 1111 1111 1111
 */
const BitLine_1 = 2 ** settings.NUMBER_OF_COLUMNS - 1;

const fillMatrixWith_0 = (matrix: (number | undefined)[], left: number, top: number, width: number, height: number) => {
  let y = top;
  const endY = top + height;
  // 把 0b1111 0000 1111  位置置 0

  // 1. 生成 0b11110000
  // 2. 与36位的 1 进行异或
  // 3.  0b1111 0000 xor 0b1111 1111 1111 1111 1111 1111 1111 1111 1111 === 0b1111 1111 1111 1111 1111 1111 1111 0000 1111
  const newBitLine = bitWiseXOr(getBitLine(width, left), BitLine_1);

  do {
    if (matrix[y]) {
      matrix[y] = bitWiseAnd(matrix[y]!, newBitLine);
    }

    y += 1;
  } while (y < endY);

  return matrix;
};

/**
 * 填充矩阵
 * */
export const fillMatrix = (
  matrix: (number | undefined)[],
  fill: 0 | 1,
  left: number,
  top: number,
  width: number,
  height: number,
) => {
  if (fill === 1) {
    return fillMatrixWith_1(matrix, left, top, width, height);
  }

  return fillMatrixWith_0(matrix, left, top, width, height);
};

export interface RectInMatrix {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * 将仪表盘上所有元素位置信息转换成一个由 1(有)或0（无）组成的矩阵地图表示
 * ```
 * 1 1 0 0 1 0 0
 * 1 1 0 0 0 1 1
 * 0 0 0 0 0 0 0
 * ```
 * */
export default function createMatrix(rects: Map<string, RectInMatrix>): (number | undefined)[] {
  const matrix: (number | undefined)[] = [];

  rects.forEach(({ left, top, width, height }, id) => {
    if (process.env.NODE_ENV === 'development') {
      currentIdRef.current = id;
      fromRef.current = `createMatrix calledBy ${createMatrix.caller?.name}`;
    }

    fillMatrix(matrix, 1, left, top, width, height);
  });

  return matrix;
}

export function matrixToString(matrix: (number | undefined)[]) {
  let str = '';

  matrix.forEach(item => {
    let substr = (item || getBitLine(0, 0)).toString(2);
    substr =
      Array(settings.NUMBER_OF_COLUMNS - substr.length)
        .fill(0)
        .join('') + substr;
    str += `${substr}\n`;
  });

  return str;
}
