import { settings } from '../settings';

let currentId: string;

export const fillArray = (
  array: (0 | 1)[] | Int8Array,
  value: 0 | 1,
  start: number,
  end: number,
): (0 | 1)[] | Int8Array => {
  let i = start;

  while (i < end) {
    if (process.env.NODE_ENV !== 'production' && array[i] === value && value === 1) {
      console.log(
        `%c【冲突】%c 该位置已被置为${value}，再次设置可能是个错误。%c start: ${start}; end: ${end}; current: ${i}; id: ${currentId}`,
        'background: red;color:white;',
        'color: #555;',
        'color: #aaa',
      );
    }

    // eslint-disable-next-line no-param-reassign
    array[i] = value;
    i += 1;
  }

  return array;
};

/**
 * 填充矩阵
 * */
export const fillMatrix = (
  matrix: Int8Array[],
  value: 0 | 1,
  left: number,
  top: number,
  width: number,
  height: number,
) => {
  let line!: Int8Array;
  let y = top;
  const endY = top + height;
  const endX = left + width;

  do {
    line = matrix[y];

    if (!line) {
      // eslint-disable-next-line no-param-reassign
      matrix[y] = new Int8Array(settings.NUMBER_OF_COLUMNS);
      line = matrix[y];
    }

    fillArray(line, value, left, endX);
    y += 1;
  } while (y < endY);

  return matrix;
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
export default function createMatrix(rects: Map<string, RectInMatrix>) {
  const matrix: Int8Array[] = [];

  rects.forEach(({ left, top, width, height }, id) => {
    currentId = id;
    fillMatrix(matrix, 1, left, top, width, height);
  });

  return matrix;
}
