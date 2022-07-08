import { Rect } from '../engine/types';

export default function mapToObject(
  map: Map<string, Rect>
): { [key: string]: Rect } {
  const obj: { [key: string]: Rect } = {};

  map.forEach((rect, id) => {
    obj[id] = rect;
  });

  return obj;
}
