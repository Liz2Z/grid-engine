import { useEffect, useRef, useCallback } from 'react';
import noWork from '@lazymonkey/grid-engine-utils/noWork';

type MouseEventHandler = (event: MouseEvent) => void;

type MouseMoveHandler = (event: MouseEvent, distance: { directionX: number; directionY: number }) => void;

interface EventHandlers {
  onMouseDown?: MouseEventHandler;
  onMouseMove?: MouseMoveHandler;
  onMouseUp?: MouseEventHandler;
}

export default function useMouseEvent({
  onMouseDown = noWork,
  onMouseMove = noWork,
  onMouseUp = noWork,
}: EventHandlers) {
  const isOn = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const mouseDownRef = useRef<MouseEventHandler>(noWork);
  const mouseMoveRef = useRef<MouseMoveHandler>(noWork);
  const mouseUpRef = useRef<MouseEventHandler>(noWork);

  useEffect(() => {
    mouseDownRef.current = onMouseDown;
    mouseMoveRef.current = onMouseMove;
    mouseUpRef.current = onMouseUp;
  });

  const mouseMoveHandler = useCallback((event: MouseEvent) => {
    if (!isOn.current) {
      return;
    }

    const { clientX, clientY } = event;

    // 这里能得到的信息：
    // 1. directionX > 0 代表当前鼠标在滑动起点的右方，directionX < 0 代表当前鼠标在滑动起点的左方
    // 2. directionY > 0 代表当前鼠标在滑动起点的下方，directionY < 0 代表当前鼠标在滑动起点的上方
    // 3. directionX 和 directionY 的绝对值越大，代表鼠标距离滑动起点越远
    // 这里不能的到的信息：
    // 1. directionX 和 directionY 的正负和大小并不能判断当前移动的方向
    //
    // 如何拿到鼠标移动的方向呢？
    // 用户自行保存上一次的 directionX 和 directionY，然后和当前的进行比较即可
    mouseMoveRef.current(event, {
      directionX: clientX - startX.current,
      directionY: clientY - startY.current,
    });
  }, []);

  const mouseUpHandler = useCallback((event: MouseEvent) => {
    if (!isOn.current) {
      return;
    }

    isOn.current = false;
    mouseUpRef.current(event);

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isOn.current) {
        /**
         * 本意是防止如果在 mousedown之后切换屏幕导致 mouseup 不触发，事件没法移除
         * 导致内存泄漏。
         *
         * 实际测试中发现在chrome中的表现为：
         *
         * 如果在mousedown之后，进入mousemove阶段切换屏幕，再次切换回来时，还是为
         * 离开时（mousemove）的状态，且,再次点击鼠标时，会首先触发 mouseup 再触发
         * mousedown，也就是说mousedown后，mouseup总是会被执行的。
         *
         * 未测试其它浏览器的表现，所以还是留着这段代码。
         * */
        // document.removeEventListener('mousemove', mouseMoveHandler);
        // document.removeEventListener('mouseup', mouseUpHandler);
        mouseUpHandler(event.nativeEvent);
      }

      isOn.current = true;
      startX.current = event.clientX;
      startY.current = event.clientY;

      mouseDownRef.current(event.nativeEvent);

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return mouseDownHandler;
}
