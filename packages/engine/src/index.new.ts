import diffObjectValues from '@lazymonkey/grid-engine-utils/diffObjectValues';
import performAutoLayout from './performAutoLayout.new';
import handleNodeRemove from './handleNodeRemove.new';
import resolveLayoutConflicts from './resolveLayoutConflicts.new';
import appendElement from './appendElement.new';
import resolveLayouts from './resolveLayouts.new';
import { settings as _settings } from './settings';
import Broadcast from './Broadcast';

class GridEngine extends Broadcast {
  rects: GridEngine.Rects = new Map();

  toJSON(): GridEngine.Layouts {
    const obj: GridEngine.Layouts = {};

    this.rects.forEach((rect, id) => {
      obj[id] = rect;
    });

    return obj;
  }

  fromJSON(layouts: GridEngine.Layouts): GridEngine {
    // 存在未布局元素
    this.rects = resolveLayouts(layouts, (id: string) => {
      this.emit('layout:none', id);
    });

    // 解决布局冲突
    this.rects = resolveLayoutConflicts(this.rects, () => {
      this.emit('layout:conflicted');
    });

    this.emit('data:initialized');
    this.emit('layout:changed');
    return this;
  }

  /**
   * 仅仅是添加节点，并不会处理布局冲突
   *
   * @param id 节点ID
   * @param size 节点尺寸
   */
  add(id: string, size: GridEngine.Size = _settings.ELEMENT_SIZE): GridEngine {
    appendElement(id, this.rects, size);
    this.emit('element:added');
    this.emit('layout:changed');
    return this;
  }

  rm(id: string): GridEngine {
    const stringId = String(id);
    this.rects = handleNodeRemove(this.rects, stringId);
    this.emit('element:removed');
    this.emit('layout:changed');
    return this;
  }

  replace(oldId:string, newId:string) {
   const rect =  this.rects.get(oldId)
   if(!rect) {
    return this;
   }
   this.rects.delete(oldId)
   this.rects.set(newId, rect)
   this.emit('element:replaced');
   this.emit('layout:changed');
   return this;
  }

  setRect = (id: string, rect: GridEngine.Rect): GridEngine => {
    const stringId = String(id);
    const nextRect = { ...rect };
    const prevRect = this.rects.get(stringId);

    if (!prevRect) {
      // 当前元素不存在布局记录
      this.add(stringId);

      this.rects = performAutoLayout(this.rects, stringId, nextRect);

      this.emit('layout:changed');
      return this;
    }

    const rectHasChanged = diffObjectValues(prevRect, nextRect);

    if (!rectHasChanged) {
      return this;
    }

    this.rects = performAutoLayout(this.rects, stringId, nextRect);

    this.emit('layout:changed');
    return this;
  };

  onLayoutConflict(callback: () => void) {
    this.on('layout:conflicted', callback);
    return () => {
      this.off('layout:conflicted', callback);
    };
  }

  onNotLayout(callback: (id: string) => void) {
    const handler = (e: Broadcast.TriggerEvent, id: string) => callback(id);
    this.on('layout:none', handler);
    return () => {
      this.off('layout:none', handler);
    };
  }

  subscribe(callback: () => void) {
    this.on('layout:changed', callback);
    return () => {
      this.off('layout:changed', callback);
    };
  }
}

module GridEngine {
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

  export const settings = _settings;
}

export default GridEngine;
