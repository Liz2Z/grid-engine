import computeRectSpace from '../computeRectSpace';
export const DEFAULT_ELEMENT_HEIGHT = 8;
export const DEFAULT_ELEMENT_WIDTH = 8;

const layouts = [
  [
    1,
    {
      left: 0,
      top: 0,
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_HEIGHT,
    },
  ],
  [
    2,
    {
      left: 8,
      top: 0,
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_HEIGHT,
    },
  ],
  [
    3,
    {
      left: 16,
      top: 0,
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_HEIGHT,
    },
  ],
];

test('添加到末尾', () => {
  const rects = new Map(layouts);

  const { left, top } = computeRectSpace(rects, DEFAULT_ELEMENT_WIDTH, DEFAULT_ELEMENT_HEIGHT);

  expect(left).toBe(24);
  expect(top).toBe(0);
});

test('添加到下方', () => {
  const rects = new Map([
    ...layouts,
    [
      4,
      {
        left: 24,
        top: 0,
        width: DEFAULT_ELEMENT_WIDTH,
        height: DEFAULT_ELEMENT_HEIGHT,
      },
    ],
  ]);

  const { left, top } = computeRectSpace(rects, DEFAULT_ELEMENT_WIDTH, DEFAULT_ELEMENT_HEIGHT);

  expect(left).toBe(0);
  expect(top).toBe(8);
});

const layouts3 = [
  ['df38258f4fe2450687c15ac65e025545', { top: 0, left: 0, height: 6, width: 7 }],
  ['f247d44768d0474fab76991496dbdbea', { top: 14, left: 7, height: 4, width: 4 }],
  ['edec8b99f16a45e9b8089360eeca48dc', { top: 12, left: 7, height: 2, width: 4 }],
  ['6064e12ddc50494cb271d47b006bbd6c', { top: 12, left: 26, height: 6, width: 10 }],
  ['16f539751a444f21a1a0275f1d95b27a', { top: 1, left: 7, height: 6, width: 15 }],
  ['06e0d4e744f5464ba3818c0d1b0bdce6', { top: 6, left: 0, height: 6, width: 7 }],
];

test('添加到：[22, 0]', () => {
  const rects = new Map(layouts3);
  const { left, top } = computeRectSpace(rects, 8, 8);
  expect(left).toBe(22);
  expect(top).toBe(0);
});
