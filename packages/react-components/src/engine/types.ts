export interface Size {
  height: number;
  width: number;
}

export interface Rect {
  height: number;
  width: number;
  left: number;
  top: number;
}

export interface Layouts {
  [key: string]: Rect;
}

export type Rects = Map<string, Rect>;
