import { useEffect, useRef, useCallback } from 'react';
import noWork from '../shared/noWork';

type MouseEventHandler = (event: MouseEvent) => void;

type MouseMoveHandler = (
  event: MouseEvent,
  distance: { directionX: number; directionY: number }
) => void;

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
    []
  );

  return mouseDownHandler;
}
