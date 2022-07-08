/* eslint-disable @typescript-eslint/naming-convention */
/**
 *
 * 一个事件系统
 *
 */
class Broadcast {
  channelMap: Record<string, Broadcast.ListenerRecord[]> = {};

  /**
   * 找到与当前emit的 channelName 所匹配的 channel
   *
   * @description
   * 对应关系：
   *
   * ```
   *  emit        ->   on
   *  -------------------
   *  *           ->   *
   *  name        ->   name, *
   *  scope:*     ->   scope:*, *
   *  scope:name  ->   scope:name, scope:*, *
   *  scope:scope2:name -> scope:scope2:name, scope:scope2:*, scope:*, *
   * ```
   */
  // TODO 冒泡？ 取消冒泡？
  // TODO 会出现emit("*")  emit("scope:*") 这种？
  private findMatchChannelNames(channelName: string): string[] | undefined {
    if (!channelName) {
      return undefined;
    }
    if (/\*.+/.test(channelName)) {
      throw Error('通配符只允许出现在最后一位');
    }
    if (/^:|:$/.test(channelName)) {
      throw Error('channelName 必须满足 `scope:name` 格式');
    }

    const pices = channelName.split(':');
    const scopes = pices.slice(0, -1);
    const name = pices[pices.length - 1];
    const matches = scopes.map((_, i) => `${pices.slice(0, i + 1).join(':')}:*`);

    if (name !== '*') {
      matches.push(channelName);
    }

    matches.unshift('*');
    matches.reverse();

    return matches;
  }

  /**
   *
   * @description
   * 对应关系：
   *
   * ```
   *  emit                ->   on
   *  ------------------------------------------------------------------------
   *  *                   ->   *
   *  name                ->   name, *
   *  scope:name          ->   scope:name, scope:*, *
   *  scope:*             ->   scope:*, *

   *  scope:scope2:name   ->   scope:scope2:name, scope:scope2:*, scope:*, *
   * ```
   */
  emit(channelName: string, ...args: unknown[]): void {
    const channelNames = this.findMatchChannelNames(channelName);

    if (!channelNames) {
      return;
    }

    const { channelMap } = this;

    channelNames
      .map(name => channelMap[name] || [])
      .flat(1)
      .forEach(record => {
        if (record.type === 'once') {
          this.off(channelName, record.listener);
        }

        // TODO Event
        const event: Broadcast.TriggerEvent = { realKey: channelName };

        record.listener.call(undefined, event, ...args);
      });
  }

  on(channelName: string, listener: Broadcast.Listener): void {
    (this.channelMap[channelName] || (this.channelMap[channelName] = [])).push({
      listener,
      type: 'normal',
    });
  }

  once(channelName: string, listener: Broadcast.Listener): void {
    (this.channelMap[channelName] || (this.channelMap[channelName] = [])).push({
      listener,
      type: 'once',
    });
  }

  private indexOf(listener: Broadcast.Listener, channel: Broadcast.ListenerRecord[]) {
    let index = -1;

    channel.some((record, i) => {
      const bool = record.listener === listener;
      if (bool) {
        index = i;
      }
      return bool;
    });

    return index;
  }

  off(channelName?: string, listener?: Broadcast.Listener): void {
    if (!channelName) {
      this.channelMap = {};
      return;
    }

    const channel = this.channelMap[channelName];
    if (!channel) {
      return;
    }

    // 没有提供listener，就全部清除
    if (!listener) {
      this.channelMap[channelName] = [];
      return;
    }

    // 找到对应的listener，并删除
    const index = this.indexOf(listener, channel);

    if (index === -1) {
      return;
    }

    channel.splice(index, 1);
  }
}

module Broadcast {
  export interface TriggerEvent {
    realKey: string;
  }

  export type Listener = (triggerEvent: Broadcast.TriggerEvent, ...args: any[]) => void;

  export interface ListenerRecord {
    type: 'normal' | 'once';
    listener: Listener;
  }
}

export default Broadcast;
