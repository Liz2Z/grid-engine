/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { ContainerRect, GridEngine } from '@lazymonkey/grid-engine-rc';

interface CanvasBackgroundProps {
  offsetTop: number;
  containerInfo: ContainerRect;
}




// TODO:平滑滚动
const render = (context: CanvasRenderingContext2D, { offsetTop, containerInfo }: {
  containerInfo: ContainerRect
  offsetTop: number
}) => {
  const {settings} = GridEngine;
  const { width: canvasWidth, height: canvasHeight, cellHeight, cellWidth, rowCount } = containerInfo;
  const rowCountPlus = rowCount + 1;

  // clear canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // 随着容器的滚动，背景需要偏移
  const offset = offsetTop % cellHeight;

  // 计算背景小方块实际宽高
  const _width = Math.round(cellWidth - settings.ELEMENT_SPACING);
  const _height = Math.round(cellHeight - settings.ELEMENT_SPACING);

  const lineWidth = 2;

  context.setLineDash([5, 5])
  context.strokeStyle = 'rgba(224, 224, 224, 1)';
  context.lineWidth = lineWidth;

  for (let i = 0; i < rowCountPlus; i += 1) {
    for (let j = 0; j < settings.NUMBER_OF_COLUMNS; j += 1) {
      context.strokeRect(
        /* x */
        Math.round(j * cellWidth + settings.ELEMENT_SPACING / 2 + lineWidth / 2),
        /* y */
        Math.round(i * cellHeight + settings.ELEMENT_SPACING / 2 + lineWidth / 2) - offset,
        _width - lineWidth,
        _height - lineWidth,
      );
    }
  }
};

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ offsetTop, containerInfo }: CanvasBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(
    () => {
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
          offsetTop
        });
      });
    },
    [containerInfo, offsetTop],
  );

  const { width: canvasWidth, height: canvasHeight, } = containerInfo;

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
};

export default React.memo(CanvasBackground);
