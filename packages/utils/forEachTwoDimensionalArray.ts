import doWhile from './doWhile';

/**
 * 二维数组遍历函数
 */
export default function forEachTwoDimensionalArray<T = any>(
  array: T[][],
  callback: (v: T, i: number) => void
) {
  doWhile(array, subArray => {
    if (!subArray) {
      return;
    }
    doWhile(subArray, callback);
  });
}
