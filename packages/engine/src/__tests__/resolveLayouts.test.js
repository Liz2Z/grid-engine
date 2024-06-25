import resolveLayouts from '../resolveLayouts';
const DEFAULT_ELEMENT_HEIGHT = 8;
const DEFAULT_ELEMENT_WIDTH = 8;

test('布局数据校正', () => {
  const layouts = {
    1: {
      left: 0,
      top: 0,
      width: 8,
      height: 8,
    },
    3: null,
  };
  const correctedLayouts = {
    ...layouts,
    3: {
      left: 8,
      top: 0,
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_HEIGHT,
    },
  };

  const layoutsMap = new Map(Object.entries(correctedLayouts));

  expect(resolveLayouts(layouts)).toEqual(layoutsMap);
});
