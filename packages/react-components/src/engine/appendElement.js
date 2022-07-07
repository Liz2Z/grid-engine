import computeRectSpace from './computeRectSpace';
import { DEFAULT_SIZE } from '../constants';

/**
 * 添加节点
 * */
export default function appendElement(id, rects, size = DEFAULT_SIZE) {
  const stringId = String(id);

  // 根据 新添加元素的尺寸，计算其放置坐标
  const { left = 0, top = 0 } = computeRectSpace(
    rects,
    size.width,
    size.height
  );

  const _rect = {
    top,
    left,
    ...size,
  };

  rects.set(stringId, _rect);

  return rects;
}
