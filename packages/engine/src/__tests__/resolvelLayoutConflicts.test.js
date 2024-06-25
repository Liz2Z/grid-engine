import resolvelLayoutConflicts from '../resolvelLayoutConflicts';

const noConflictData = [
  [
    1,
    {
      left: 0,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
  [
    2,
    {
      left: 8,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
];
const noConflictMap = new Map(noConflictData);

test('错误数据校正处理：无冲突情况', () => {
  expect(resolvelLayoutConflicts(noConflictMap, () => undefined)).toBe(
    noConflictMap
  );
});

const conflictData = [
  ...noConflictData,
  [
    3,
    {
      left: 0,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
];

function toString(map) {
  const result = [];

  map.forEach((value, key) => {
    result.push([key, value]);
  });

  return JSON.stringify(result);
}

test('错误数据校正处理：有冲突情况', () => {
  const result = resolvelLayoutConflicts(
    new Map(conflictData),
    () => undefined
  );
  expect(result).not.toBe(conflictData);
  expect(toString(result)).toMatchSnapshot();
});
