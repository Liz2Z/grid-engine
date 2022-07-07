/**
 * 校正程序
 * */
import appendElement from './appendElement';

const defaultNotLayoutHandler = (id, append) => {
  append();
};

/**
 * 对传入的id集合及布局信息进行校准。
 *
 */
export default function correctLayouts(
  layouts,
  notLayoutHandler = defaultNotLayoutHandler
) {
  let result = new Map();
  const notLayoutIds = [];
  const entries = Object.entries(layouts);

  if (!entries.length) {
    return result;
  }

  // - 遍历layouts对象
  // - 如果值存在，将键值添加至result map，否则将键放入notLayoutIds
  entries.forEach(([id, rect]) => {
    if (rect) {
      result.set(id, rect);
      return;
    }

    notLayoutIds.push(id);
  });

  if (notLayoutIds.length) {
    // 遍历notLayoutIds，并依次执行appendElement
    notLayoutIds.forEach(id => {
      const append = size => {
        result = appendElement(id, result, size);
      };

      // 依次触发 notLayoutHandler， 并传入当前元素 id，及回调函数
      // 用户可以选择是否调用回调函数将当前元素添加进布局
      notLayoutHandler(id, append);
    });
  }

  // 返回result map
  return result;
}
