import { createRelationship } from '../resolvelLayoutConflicts';

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
    3,
    {
      left: 8,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
];

const conflictData = [
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
      left: 0,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
  [
    3,
    {
      left: 8,
      top: 0,
      width: 8,
      height: 8,
    },
  ],
];

test('关系网测试： 有冲突', () => {
  expect(createRelationship(new Map(conflictData)).size).toBe(2);
});

test('关系网测试： 无冲突', () => {
  expect(createRelationship(new Map(noConflictData)).size).toBe(0);
});
