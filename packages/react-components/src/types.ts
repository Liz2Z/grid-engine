/**
 * 画布的尺寸信息
 */
export interface ContainerRect {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  rowCount: number;
}

/**
 * 用来表示元素在Canvas位置的类型。
 * 各个字段的值都是整数，单位：格。
 * */
export interface Layout {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * 用来进行CSS布局的类型。
 * 各个字段的值为浮点型。单位：px;
 */
export interface Position {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * 元素移动的限制区域大小
 * 缩放的限制尺寸
 *
 * */
export interface LimitRect {
  width: number;
  height: number;
  minHeight: number;
  minWidth: number;
  cellHeight: number;
  cellWidth: number;
}

export interface ElementState {
  isHovering: boolean;
  isWorking: boolean;
  isFocusing: boolean;
  indicatorPosition: Position;
}
