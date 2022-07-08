import correctLayouts from '../correctLayouts';
import { DEFAULT_ELEMENT_HEIGHT, DEFAULT_ELEMENT_WIDTH } from '../../../react-components/src/constants';

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

  expect(correctLayouts(layouts)).toEqual(layoutsMap);
});
