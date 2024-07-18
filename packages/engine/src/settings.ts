interface ISettings {
  /** 列数量 36列 */
  NUMBER_OF_COLUMNS: number;
  /** 行数量 xx 列 */
  NUMBER_OF_ROWS: number;
  /** 元素尺寸 */
  ELEMENT_SIZE: {
    width: number;
    height: number;
  };
  /** 元素与元素之间的间隔。单位：px */
  ELEMENT_SPACING: number;
  /** 网格高度。单位：px */
  CELL_HEIGHT?: number;
}

export const settings: ISettings = {
  NUMBER_OF_COLUMNS: 36,
  NUMBER_OF_ROWS: -1,

  ELEMENT_SIZE: {
    height: 8,
    width: 8,
  },
  ELEMENT_SPACING: 12,
};
