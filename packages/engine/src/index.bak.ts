// @ts-nocheck
import diffObjectValues from '@lazymonkey/grid-engine-utils/diffObjectValues';
import noWork from '@lazymonkey/grid-engine-utils/noWork';
import performAutoLayout from './performAutoLayout';
import handleNodeRemove from './handleNodeRemove';
import resolvelLayoutConflicts from './resolvelLayoutConflicts';
import appendElement from './appendElement';
import correctLayouts from './correctLayouts';
import { Rect, Layouts, Rects, Size } from './types';
import { DEFAULT_SIZE } from './constants';

interface VoidFn {
  (): void;
}

interface NotLayoutHandler {
  (id: string, append: (size?: Size) => void): void;
}

export interface LayoutEngine {
  reset: (layouts: Layouts) => void;
  notify: VoidFn;
  subscribe: (cb: VoidFn) => VoidFn;
  toJSON: () => Layouts;
  appendElement: (id: string, size?: Size) => Rects;
  removeElement: (id: string) => void;
  setLayout: (id: string, rect: Rect) => void;
  onLayoutConflict: (conflictHandler: VoidFn) => void;
  onNotLayout: (notLayoutHandler: NotLayoutHandler) => void;
}

export default function createEngine(defaultLayouts?: Layouts): LayoutEngine {
  let notify: VoidFn = noWork;
  let rects: Rects = new Map();
  let conflictHandler: VoidFn = noWork; // 布局冲突回调
  let notLayoutHandler: NotLayoutHandler | undefined; // 存在未布局元素回调

  const onLayoutConflict = (cb: VoidFn) => {
    conflictHandler = cb;
    return () => {
      conflictHandler = noWork;
    };
  };

  const onNotLayout = (cb: NotLayoutHandler) => {
    notLayoutHandler = cb;
    return () => {
      notLayoutHandler = undefined;
    };
  };

  /**
   * 订阅布局改变
   */
  const subscribe = (cb: VoidFn) => {
    notify = cb;
    return () => {
      notify = noWork;
    };
  };

  /**
   * 输出布局信息
   */
  const toJSON = () => {
    const obj: Layouts = {};

    rects.forEach((rect, id) => {
      obj[id] = rect;
    });

    return obj;
  };

  /**
   * 添加元素
   */
  const publicAppendElement = (id: string, size: Size = DEFAULT_SIZE) => {
    return appendElement(id, rects, size);
  };

  /**
   * 删除元素
   * */
  const removeElement = (id: string) => {
    const stringId = String(id);
    rects = handleNodeRemove(rects, stringId);
  };

  /**
   * 改变元素布局
   * */
  const setLayout = (id: string, rect: Rect) => {
    const stringId = String(id);
    const nextRect = { ...rect };
    const prevRect = rects.get(stringId);

    if (!prevRect) {
      // 当前元素不存在布局记录
      // rects.set(stringId, nextRect);
      publicAppendElement(stringId);
      notify();
      return;
    }

    const isRectChanged = diffObjectValues(prevRect, nextRect);
    if (!isRectChanged) {
      // rect未改变
      return;
    }

    rects = performAutoLayout(rects, stringId, nextRect);

    notify();
  };

  /**
   *重置
   */
  const reset = (layouts: Layouts) => {
    rects = correctLayouts(layouts, notLayoutHandler); // 校正数据 TODO: typescript
    rects = resolvelLayoutConflicts(rects, conflictHandler); // 解决布局冲突
    // notify();
  };

  // 初始化
  if (defaultLayouts) {
    reset(defaultLayouts);
  }

  return {
    reset,
    notify,
    subscribe,
    toJSON,
    appendElement: publicAppendElement,
    removeElement,
    setLayout,
    onNotLayout,
    onLayoutConflict,
  };
}
