/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { NUMBER_OF_COLOMUS } from '../constants';
import useDebounce from '../hooks/useDebounce';
import { ContainerRect } from './Canvas';

interface CanvasBackgroundProps {
  offsetTop: number;
  containerInfo: ContainerRect;
}

// 写死不想动态算了
const spacing = 3;

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ offsetTop, containerInfo }: CanvasBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width: canvasWidth, height: canvasHeight, cellHeight, cellWidth, rowCount } = containerInfo;
  const rowCountPlus = rowCount + 1;

  const clearCanvas = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  // TODO:平滑滚动
  const render = (context: CanvasRenderingContext2D) => {
    clearCanvas(context);

    // 随着容器的滚动，背景需要偏移
    const offset = offsetTop % cellHeight;
    // 计算背景小方块实际宽高
    const _width = Math.round(cellWidth - spacing * 2);
    const _height = Math.round(cellHeight - spacing * 2);

    context.fillStyle = '#f1f1f1';

    for (let i = 0; i < rowCountPlus; i += 1) {
      for (let j = 0; j < NUMBER_OF_COLOMUS; j += 1) {
        context.fillRect(
          /* x */
          Math.round(j * cellWidth + spacing),
          /* y */
          Math.round(i * cellHeight + spacing) - offset,
          _width,
          _height,
        );
      }
    }
  };

  const debounce = useDebounce();
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

      // clearCanvas(context);

      debounce(() => {
        render(context);
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cellHeight, cellWidth, canvasWidth, offsetTop],
  );

  return (
    <canvas
      data-label="bg-canvas"
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
