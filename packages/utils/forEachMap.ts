/**
 * Map结构数据遍历器
 * 【注】map结构自带遍历器，但是没有中断功能。
 *
 * 遍历Map，当回调函数显示的返回`false`则中止遍历。
 *
 * @param {Map} map
 * @param {function} callback
 * */
export default function forEachMap(
  map: Map<any, any>,
  callback: (key: any, value: any, done: () => void) => void
) {
  if (map.size === 0) {
    return;
  }

  const gen = map.entries();
  let shouldBreak = false;
  const doneFn = () => {
    shouldBreak = true;
  };

  do {
    const { done, value } = gen.next();

    if (done) {
      return;
    }

    //                         key    value    done
    callback(value[0], value[1], doneFn);

    if (shouldBreak) {
      return;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
}
