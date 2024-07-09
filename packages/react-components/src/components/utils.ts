import type * as Types from '../types';

/**
 * 将布局引擎单位转成css px 单位
 */
export const layoutUnitToStyleUnit = (
  layout: Types.Layout,
  cellHeight: number,
  cellWidth: number,
  spacing: number,
): Types.Position => {
  const { top, left, height, width } = layout;

  const halfSpacing = spacing / 2;
  return {
    top: top * cellHeight + halfSpacing,
    left: left * cellWidth + halfSpacing,
    height: height * cellHeight - spacing,
    width: width * cellWidth - spacing,
  };
};

export const styleUnitToLayoutUnit = (
  style: Types.Position,
  cellHeight: number,
  cellWidth: number,
  spacing: number,
): Types.Layout => {
  const halfSpacing = spacing / 2;

  const result = {
    top: Math.round((style.top - halfSpacing) / cellHeight) || 0,
    left: Math.round((style.left - halfSpacing) / cellWidth) || 0,
    height: Math.round((style.height + spacing) / cellHeight) || 1,
    width: Math.round((style.width + spacing) / cellWidth) || 1,
  };

  return result;
};

export const isNil = (value: any): boolean => {
  return value === null || value === undefined;
};
