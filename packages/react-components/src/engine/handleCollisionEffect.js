import rectangleCollisionDetect from './rectangleCollisionDetect';

/**
 * 找到所有可能被移动元素碰撞所影响的元素 及 被其直接碰撞到的元素
 */
function findEffects(rects, movedId, movedRect) {
  const effects = new Map();
  const directlyEffects = [];

  rects.forEach((rect, id) => {
    if (id === movedId || rect.top + rect.height <= movedRect.top) {
      // 排除自己及不可能发生碰撞的元素
      return;
    }
    const effect = rect;
    const isDirectlyCollision = rectangleCollisionDetect(rect, movedRect);

    if (isDirectlyCollision) {
      // 与移动元素发生直接碰撞
      directlyEffects.push(effect);
    }

    if (rect.top < movedRect.top) {
      // 当一个元素的高度高于移动元素，不管它是否被碰撞，都不会对其做任何操作
      return;
    }

    effects.set(id, effect);
  });

  return [effects, directlyEffects];
}

/**
 * 当元素被拖拽发生位移时，被拖拽的元素与其它元素发生碰撞，需要根据碰撞的结果
 * 来判断被拖拽元素最终被放置的位置
 */
function correctLayout(rect, effects) {
  const { top: currectTop } = rect;
  let correctedTop = currectTop;
  let i = 0;
  let effect = effects[i];

  do {
    const nextTop = effect.top + effect.height;
    if (effect.top < currectTop && nextTop > correctedTop) {
      // 当碰撞到高度更高（top更小）的元素时，被拖拽元素自动下移至被碰撞元素下方
      correctedTop = nextTop;
    }
    i += 1;
    effect = effects[i];
  } while (effect);

  return {
    ...rect,
    top: correctedTop,
  };
}

/**
 * 元素移动方向有4种：上、下、左、右。
 *
 * 1. 向上移动时，当移动至与上面元素的top相同才做操作，否则忽略
 *
 */
function performWorkOnEffect(rects, movedId, movedRect, effects) {
  rects.forEach((rect, id) => {
    if (id === movedId) {
      return;
    }

    const isCollision = rectangleCollisionDetect(rect, movedRect);

    if (isCollision) {
      const newRect = {
        ...rect,
        top: rect.top + 1,
      };

      rects.set(id, newRect); // 更新
      effects.push([id, newRect]); //
    }
  });

  const next = effects.shift();

  if (next) {
    performWorkOnEffect(rects, next[0], next[1], effects);
  }
}

function flushEffects(rects, movedRect) {
  let i = 1;
  const end = movedRect.height + 1;

  do {
    // 被碰撞的元素向下移动一个单位
    const newRect = {
      ...movedRect,
      height: i,
    };
    const effects = [];

    performWorkOnEffect(rects, null, newRect, effects);

    i += 1;
  } while (i < end);

  return rects;
}

/**
 * 处理移动元素后可能产生的碰撞情况，返回新的布局。
 *
 * 1. 检测移动元素后是否会产生碰撞，如果产生碰撞，则进入下一步
 * 2. 找出所有可能发生碰撞的元素
 * 3. 清除碰撞副作用，计算新的布局
 * 4. 返回
 */
export default function handleCollisionEffect(rects, movedId, movedRect) {
  const [effects, directlyEffects] = findEffects(rects, movedId, movedRect);

  if (!directlyEffects.length) {
    return rects;
  }

  // 矫正被移动元素的位置
  const correctedRect = correctLayout(movedRect, directlyEffects);

  const result = flushEffects(effects, {
    ...movedRect,
    height: correctedRect.top - movedRect.top + movedRect.height,
  });

  result.set(movedId, correctedRect);

  return new Map([...rects, ...result]);
}
