export default function doWhile<T = any>(array: T[], callback: (v: T, i: number) => void) {
  let i = 0;
  const len = array.length;

  do {
    callback(array[i], i);
    i += 1;
  } while (i < len);
}
