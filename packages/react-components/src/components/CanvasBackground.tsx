import React, { useEffect, useRef } from 'react';
import { settings } from '@lazymonkey/grid-engine/src/settings';
import { ContainerRect } from './Canvas';

export interface CanvasBackgroundProps {
  offsetTop: number;
  containerInfo: ContainerRect;
}

const render = (
  context: CanvasRenderingContext2D,
  {
    offsetTop,
    containerInfo,
  }: {
    containerInfo: ContainerRect;
    offsetTop: number;
  },
) => {
  const { width: canvasWidth, height: canvasHeight, cellHeight, cellWidth, rowCount } = containerInfo;
  const rowCountPlus = rowCount + 1;

  // clear canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // 随着容器的滚动，背景需要偏移
  const offset = offsetTop % cellHeight;

  // 计算背景小方块实际宽高
  const _width = Math.round(cellWidth - settings.ELEMENT_SPACING);
  const _height = Math.round(cellHeight - settings.ELEMENT_SPACING);

  context.fillStyle = 'rgba(224, 224, 224, 0.1)';

  for (let i = 0; i < rowCountPlus; i += 1) {
    for (let j = 0; j < settings.NUMBER_OF_COLUMNS; j += 1) {
      context.fillRect(
        /* x */
        Math.round(j * cellWidth + settings.ELEMENT_SPACING / 2),
        /* y */
        Math.round(i * cellHeight + settings.ELEMENT_SPACING / 2) - offset,
        _width,
        _height,
      );
    }
  }
};

export const CanvasBackground: React.FC<CanvasBackgroundProps> = React.memo(
  ({ offsetTop, containerInfo }: CanvasBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      requestAnimationFrame(() => {
        render(context, {
          containerInfo,
          offsetTop,
        });
      });
    }, [containerInfo, offsetTop]);

    const { width: canvasWidth, height: canvasHeight } = containerInfo;

    return (
      <canvas
        data-label="lm-bg-canvas"
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
      />
    );
  },
);
