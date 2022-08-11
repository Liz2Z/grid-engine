import computeRectSpace from '../computeRectSpace.new';
import json from './data.json';

// 7.3 s
test('添加到下方', () => {
  const rects = new Map([]);

  for (let i = 0, len = json.length; i < len; i += 1) {
    const [id, item] = json[i];

    const { left, top } = computeRectSpace(rects, item.width, item.height);

    rects.set(id, { ...item, left, top });
  }

  expect(true).toBe(true);
});
