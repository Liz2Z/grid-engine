import { useRef, useEffect, useCallback } from 'react';

export default function useMountedState(): () => boolean {
  const ref = useRef(false);
  const isMounted = useCallback(() => ref.current, []);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  });

  return isMounted;
}
