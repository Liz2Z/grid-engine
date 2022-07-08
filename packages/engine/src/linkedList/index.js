// FIXME: 没有容错（参数）

/**
 * 创建单向链表
 */
export default function createLinkedList() {
  let firstNode = null;
  let lastNode = null;

  function clear() {
    firstNode = null;
    lastNode = null;
  }

  /**
   * 添加到链表末尾
   */
  function append(node) {
    if (firstNode === null) {
      // 当前链表为空
      firstNode = node;
      lastNode = node;
    } else {
      const prev = lastNode;
      prev.next = node;
      lastNode = node;
      lastNode.prev = prev;
    }
  }

  function insertAfter(target, newNode) {
    const { next } = target;
    /* eslint-disable no-param-reassign */
    target.next = newNode;
    newNode.prev = target;
    if (next) {
      newNode.next = next;
      next.prev = newNode;
    }
    /* eslint-enable no-param-reassign */
  }

  function replace(target, newNode) {
    const { prev, next } = target;
    /* eslint-disable no-param-reassign */
    if (prev) {
      prev.next = newNode;
      newNode.prev = prev;
    } else if (target === firstNode) {
      // target是当前链表第一个
      firstNode = newNode;
    } else {
      // target不是此链表里的项，不做操作
      return;
    }

    if (next) {
      newNode.next = next;
      next.prev = newNode;
    }
    /* eslint-enable no-param-reassign */
  }

  /**
   * 移除
   * */
  function remove(node) {
    if (firstNode === lastNode) {
      // 唯一一个
      if (node === firstNode) {
        // 确认是当前链表中的节点
        clear();
      }
    } else if (firstNode === node) {
      // 第一个
      firstNode = node.next;
    } else if (lastNode === node) {
      // 最后一个
      lastNode = node.prev;
    } else {
      const { prev, next } = node;
      prev.next = next;
      next.prev = prev;
    }
  }

  /**
   * 遍历node链表
   * */
  function step(callback) {
    let current = firstNode;
    let _continue = true;
    const done = () => {
      _continue = false;
    };
    while (current !== null && _continue) {
      callback(current, done);
      current = current.next;
    }
  }

  function getFirst() {
    return firstNode;
  }

  return {
    append,
    clear,
    getFirst,
    insertAfter,
    remove,
    replace,
    step,
  };
}
