export default function sortRects(rects) {
  const result = [];

  rects.forEach((rect, id) => {
    const { top } = rect;

    if (!result[top]) {
      result[top] = [];
    }

    result[top].push([id, rect]);
  });

  return result;
}
