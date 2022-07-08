import debounce from './debounce';

// ie edge 部分支持 DOM observer
const isPartialSupport = /(rv:11\.0)|(Edge)/i.test(window.navigator.userAgent);

function objectValuesDiff(prev: { [key: string]: any }, cur: { [key: string]: any }, attributes: string[]) {
  try {
    return attributes.some(attr => cur[attr] !== prev[attr]);
  } catch (err) {
    return true;
  }
}

function getAttributes(target: { [key: string]: any }, attributes: string[]): { [key: string]: any } {
  const obj: { [key: string]: any } = {};

  attributes.forEach(attr => {
    obj[attr] = target[attr];
  });

  return obj;
}

/**
 * 监听DOM元素大小位置改变。
 *
 * 通过监听window.resize，元素的子元素位置及数量改变来监听元素
 *
 *
 * */
export default function observeElementSize(el: HTMLElement, attributes: string[], callback: (el: HTMLElement) => void) {
  let prevAttrs = {};

  const onSizeChange = debounce(() => {
    const curAttrs = getAttributes(el, attributes);

    if (objectValuesDiff(prevAttrs, curAttrs, attributes)) {
      prevAttrs = curAttrs;
      callback(el);
    }
  });

  /**
   *
   * childList: 设为 true 以监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点。
   *
   * subtree: 设为 true 以将监视范围扩展至目标节点整个节点树中的所有节点。MutationObserverInit 的
   *          其他值也会作用于此子树下的所有节点，而不仅仅只作用于目标节点。默认值为 false。
   *
   * attributes: 设为 true 以监视元素的属性值变更，如果未设置attributeFilter属性，则监听所有属性。
   *
   * attributeFilter：要监视的特定属性名称的数组。!!! 在ie/Edge中，如果设置此属性，必须把attributes设为true。!!!
   *
   * characterData：设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变化。在这里不用设置。
   *
   * */
  const observer = new MutationObserver(onSizeChange);

  const options: MutationObserverInit = {
    childList: true,
    subtree: true, // TODO: 不确定，这个属性对性能的影响
    attributeFilter: ['class', 'style', 'height', 'width'], // 只监听可能引起尺寸变化的属性
  };

  let disconnected = false;

  if (isPartialSupport) {
    options.attributes = true;
  }

  observer.observe(el, options); // MutationObserver

  window.addEventListener('resize', onSizeChange); // window resize

  return () => {
    if (disconnected) {
      return;
    }

    disconnected = true;
    observer.disconnect();
    window.removeEventListener('resize', onSizeChange);
  };
}
