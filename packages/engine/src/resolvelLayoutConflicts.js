/**
 * 校正程序
 * */
import rectangleCollisionDetect from './rectangleCollisionDetect';
import handleDropEffect from './handleDropEffect';
import appendElement from './appendElement';

/**
 * 根据key从map中获取value，如果不存在，则创建
 * */
function getValue(map, key) {
  let value = map.get(key);

  if (!value) {
    value = new Map();
    map.set(key, value);
  }

  return value;
}

/**
 * 根据布局数据，创建冲突关系网。
 */
export function createRelationship(rects) {
  const rectQueue = Array.from(rects);
  const relationship = new Map();

  function loop(_rectQueue) {
    if (!_rectQueue.length) {
      return;
    }

    // 取出一项，与其他项进行冲突比较
    const [targetId, targetRect] = _rectQueue.pop();

    rectQueue.forEach(([id, rect]) => {
      const isCollision = rectangleCollisionDetect(targetRect, rect);

      if (!isCollision) {
        // 未冲突
        return;
      }

      const current = getValue(relationship, id);
      const target = getValue(relationship, targetId);

      target.set(id, current);
      current.set(targetId, target);
    });

    loop(_rectQueue);
  }

  loop(rectQueue);

  return relationship;
}

/**
 * 找到最高优先级的项（与其他项冲突最多的）
 */
function findHighestPriority(map) {
  let size = 0;
  let key = null;
  map.forEach((value, _key) => {
    if (size < value.size) {
      size = value.size;
      key = _key;
    }
  });
  return [key, size];
}

function clear(relationship, rects, key) {
  rects.delete(key);

  const target = relationship.get(key);
  relationship.delete(key);

  if (!target) {
    return;
  }

  target.forEach((value, _key) => {
    relationship.get(_key).delete(key);
  });
}

/**
 * 清除掉无效的冲突关系，返回有效的冲突
 *
 * */
function flushInvalidRelationship(relationship, rects) {
  const result = [];
  for (let i = 0, { size } = relationship; i < size; i += 1) {
    //
    const [key, _size] = findHighestPriority(relationship);

    if (_size > 0) {
      result.push(key);
    } else {
      break;
    }

    clear(relationship, rects, key);
  }

  return result;
}

/**
 * 解决原始数据中的节点布局冲突
 */
// TODO: 性能优化
export default function resolvelLayoutConflicts(rects, conflictHandler) {
  if (!rects.size) {
    return rects;
  }

  const relationship = createRelationship(rects);

  if (!relationship.size) {
    return rects;
  }

  const copyedRects = new Map(rects);
  
  const conflicts = flushInvalidRelationship(relationship, copyedRects);

  let result = copyedRects;

  result = handleDropEffect(copyedRects);

  conflicts.forEach(key => {
    // FIXME: 连续的appendElement及掉落检测可以共用一个matrix，以简省操作时间
    result = appendElement(key, result);
  });

  conflictHandler();

  return result;
}
