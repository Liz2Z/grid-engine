import computeRectSpace from '../computeRectSpace';
import json from './data.json';
const { performance } = require('perf_hooks');

test('添加到下方', () => {
  const rects = new Map([]);

  const start = performance.now();

  for (let i = 0, len = json.length; i < len; i += 1) {
    const [id, item] = json[i];

    const { left, top } = computeRectSpace(rects, item.width, item.height);

    rects.set(id, { ...item, left, top });
  }

  console.log(performance.now() - start);

  expect(true).toBe(true);
});
