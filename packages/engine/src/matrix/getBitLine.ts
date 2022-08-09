import { NUMBER_OF_COLOMUS } from '../constants';
import { leftShift } from '../operators';

/**
 * 假设：
 * width : 4
 * left  : 4
 * 总宽度 : 10
 *
 * 结果   : 1111 000 000
 *
 * @param width
 * @param left
 * @returns
 */
const getBitLine = (width: number, left: number) => {
  // 左移运算符的限制：超出 32 位的值，则自动丢弃
  // 等同于  number << shift;
  return leftShift(2 ** width - 1, NUMBER_OF_COLOMUS - left - width);
};

export default getBitLine;
