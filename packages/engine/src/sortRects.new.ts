import { RectInMatrix } from './matrix/createMatrix.new';

export default function sortRects(rects: Map<string, RectInMatrix>) {
  const result: [string, RectInMatrix][][] = [];

  rects.forEach((rect, id) => {
    const { top } = rect;

    if (!result[top]) {
      result[top] = [];
    }

    result[top].push([id, rect]);
  });

  return result.flat(1);
}
