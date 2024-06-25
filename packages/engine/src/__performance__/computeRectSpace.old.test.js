import computeRectSpace from '../computeRectSpace';
import json from './data.json';

test('添加到下方', () => {
  const rects = new Map([]);

  for (let i = 0, len = json.length; i < len; i += 1) {
    const [id, item] = json[i];

    const { left, top } = computeRectSpace(rects, item.width, item.height);

    rects.set(id, { ...item, left, top });
  }

  expect(true).toBe(true);
});
