import createMatrix from '../matrix/createMatrix';
import { transformBlockTop } from '../matrix/transform';
import sortRects from './sortRects';
import forEachTwoDimensionalArray from '../shared/forEachTwoDimensionalArray';

/**
 * 检测空白行
 */
function checkSpaceLine(line, offset, width) {
  // TODO: 二分检测？数据量不大，似乎没必要
  let i = offset;
  const end = offset + width;

  do {
    if (line[i] === 1) {
      return false;
    }

    i += 1;
  } while (i < end);

  return true;
}

/**
 * 单个元素节点的掉落检测
 */
function nodeDropDetect(matrix, rect, lineIndex) {
  if (lineIndex < 0) {
    // 元素已处于最顶端
    return 0;
  }

  const { left, width } = rect;
  const line = matrix[lineIndex];

  if (!line) {
    // 没有此行
    return nodeDropDetect(matrix, rect, lineIndex - 1);
  }

  const isWideEnough = checkSpaceLine(line, left, width);
  if (!isWideEnough) {
    // 宽度不够，return
    return lineIndex + 1;
  }

  return nodeDropDetect(matrix, rect, lineIndex - 1);
}

/**
 * 掉落检测及副作用处理
 * */
// TODO: 可以继续优化
export default function handleDropEffect(rects) {
  const matrix = createMatrix(rects);
  const sortedRects = sortRects(rects);

  forEachTwoDimensionalArray(sortedRects, ([id, rect]) => {
    if (rect.top <= 0) {
      // 排除掉已经处于顶端的
      return;
    }

    // 掉落检测后的 新定位信息
    const newTop = nodeDropDetect(matrix, rect, rect.top - 1);

    if (newTop === rect.top) {
      // 没有发生变化，无需进行更新操作
      return;
    }

    const newRect = {
      ...rect,
      top: newTop,
    };

    rects.set(id, newRect);

    transformBlockTop(matrix, rect, newRect, id);
  });

  return rects;
}
