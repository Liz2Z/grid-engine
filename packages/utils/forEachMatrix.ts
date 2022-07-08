export default function forEachMatrix(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  callback: (x: number, y: number, breakLoop: () => void) => void
) {
  let shouldBreak = false;
  const breakLoop = () => {
    shouldBreak = true;
  };
  for (let x = startX; x < endX; x += 1) {
    for (let y = startY; y < endY; y += 1) {
      callback(x, y, breakLoop);
      if (shouldBreak) {
        return;
      }
    }
  }
}
