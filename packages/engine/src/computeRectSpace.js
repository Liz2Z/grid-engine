/**
 * FIXME: 是否可以使用纯数学的方法解决
 *
 *  */
import { settings } from './settings';
import createMatrix from './matrix/createMatrix';
import createLinkedList from './linkedList';

// 默认长36的Int8Array
const zeroArray = new Int8Array(settings.NUMBER_OF_COLUMNS);

/**
 * 找到所有足够宽的空白。
 *
 * */
function findWideEnoughSpaces(line, width) {
  let size = 0; // 记录当前宽度
  let offset;
  const spaces = []; // 记录宽零起点
  const record = () => {
    if (size < width) {
      // 宽度不够，废弃
      return;
    }

    spaces.push({
      offset,
      width: size,
    });
  };

  for (let i = 0, len = line.length; i < len; i += 1) {
    const item = line[i];

    if (item === 0) {
      size += 1;
      if (offset === undefined) {
        offset = i;
      }
      if (i === len - 1) {
        record();
      }
    } else {
      // 当前位为1，记录，重置
      record();
      size = 0;
      offset = undefined;
    }
  }
  return spaces;
}

function findIntersection({ offset: offset1, width: width1 }, { offset: offset2, width: width2 }) {
  const offset = offset1 > offset2 ? offset1 : offset2;
  const end1 = offset1 + width1;
  const end2 = offset2 + width2;
  const end = end1 < end2 ? end1 : end2;
  const width = end - offset;

  return { offset, width };
}

/**
 * space。指的是宽度足够放下新元素的空白。
 * */
function createSpace(top, offset, width, height = 1) {
  return {
    top, // 坐标
    offset, // 坐标
    width,
    height, // 空白当前有效高度，当高度不够，当前空白将被放弃
    next: null,
    prev: null,
  };
}

/**
 * 以行为单位，递归遍历matrix
 * */
function stepLine(matrix, end, callback) {
  let index = 0;
  let line;
  let _continue = true;
  const done = () => {
    _continue = false;
  };

  while (_continue && index < end) {
    line = matrix[index] || zeroArray;
    callback(line, index, done);
    index += 1;
  }
}

/**
 * 将空白记录与当前行的有效空白求交集
 *
 * */
// FIXME: 帮我取个名字
function temp1(validSpaces, space, minWidth) {
  const intersection = [];
  validSpaces.forEach((_space, index) => {
    const result = findIntersection(_space, space);
    if (result.width < minWidth) {
      return;
    }

    if (result.offset === _space.offset && result.width === _space.width) {
      // FIXME: 这里的处理不好
      validSpaces.splice(index, 1);
    }

    intersection.push(result);
  });
  return intersection;
}

/**
 * 由左到右，由上往下，找到满足宽高条件的空白矩形。
 */
export function findSpaceRect(matrix, minWidth, minHeight) {
  let result;
  const spaces = createLinkedList();
  let spaceMap = {};

  stepLine(matrix, minHeight + matrix.length + 1, (line, index, done) => {
    const validSpaces = findWideEnoughSpaces(line, minWidth);

    if (!validSpaces.length) {
      // 当前行没有有效宽度的空白，说明之前的空白全部无效（高度不够）
      spaces.clear();
      spaceMap = {};
      return;
    }

    spaces.step((space, _done) => {
      // 遍历已记录的空白，校验是否还有效，如果有效高度是否已足够，及其他操作。。。、

      // 将空白记录与当前行空白求交集：
      // 情况一：
      // ————————          ———————— // 已记录的空白
      // ————        ——————————————
      //
      // 情况二：
      // ————————          ————————
      // ——————————    ————————————
      //
      // 情况三：
      // ————————          ————————
      // ————————————       ———————
      //
      // 情况四：
      // ————————          ————————
      // ————————          ————————
      //
      // 情况五：
      // ————————          ————————
      // ——————              ——————
      //
      // 情况六：
      // ————————          ————————
      // ————————   ———     ———————
      // or （中间有很多小空白）
      // ————————  — ——  —  ———————
      //
      const intersection = temp1(validSpaces, space, minWidth);

      const { offset, width, top, height } = space;
      const increaseHeight = height + 1;
      const recordId = `${offset}-${width}`;

      if (!intersection.length) {
        // 已记录的空白与当前行的空白没有交集，说明这个space高度不够，可以移除
        spaces.remove(space);
        delete spaceMap[recordId];
        return;
      }

      if (increaseHeight === minHeight) {
        // 满足高度，已找到
        result = { offset, top };
        _done();
        return;
      }

      // 一般只会有一个交集，除了【情况六】，我们需要根据这个交集的数据来更新空白记录。
      // 如果出现【情况六】，则要用第一个交集的信息更新原空白，并将其它交集插入在原空白记录后面。
      // 因为我们查找的优先级是【从左往右】
      //
      intersection.forEach(({ width: _width, offset: _offset }, _index) => {
        const newSpace = createSpace(top, _offset, _width, increaseHeight);

        if (_index === 0) {
          spaces.replace(space, newSpace);
          delete spaceMap[recordId];
        } else {
          spaces.insertAfter(space, newSpace);
        }
        // 这个必须放在delete 下方
        const newId = `${_offset}-${_width}`;
        spaceMap[newId] = true;
      });
    });

    if (result) {
      done();
      return;
    }

    // 每遍历一行时，除了需要更新原有的空白记录，还需要查找是否有符合条件的新空白。。。
    validSpaces.forEach(({ offset, width }) => {
      const id = `${offset}-${width}`;
      if (spaceMap[id]) {
        // 不是新的空白
        return;
      }
      const space = createSpace(index, offset, width);
      spaces.append(space);
      spaceMap[id] = true;
    });
  });

  if (!result) {
    // 如果执行到这里，说明有【BUG】
    if (process.env.NODE_ENV === 'development') {
      throw Error('未找到空白');
    } else {
      console.error('computeSpaceRect: 未找到空白');
    }
    return {};
  }

  return result;
}

/**
 * 从左到右，从上到下，找到一个矩形的空白位置，
 * 放置新添加的元素。
 *
 * - 通过二进制map计算获得
 * - 通过数学方法计算获得
 * @typedef {{offset:number;top:number;width:number;height:number;}} Rect
 *
 * @param {Rect[]} rects
 * @param {number} width
 * @param {number} height
 *
 * @returns {{top:number;offset:number;}}
 * */
export default function computeSpaceRect(rects, width, height) {
  const matrix = createMatrix(rects);
  const { top, offset } = findSpaceRect(matrix, width, height);
  return { top, left: offset };
}
