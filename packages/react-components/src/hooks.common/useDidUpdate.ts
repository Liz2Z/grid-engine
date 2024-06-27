import { useRef, useEffect } from 'react';

/**
 * @param {Function} cb
 * @param {Array} deps
 *
 * @example
 * function Component() {
 *      const [a, setA] = useState(1);
 *      useDidUpdate(()=>{
 *          console.log('update', a);
 *      },[a])
 * }
 *
 * */
export default function useDidUpdate(cb: () => void, deps: any[]) {
  const didMountedRef = useRef(false);

  useEffect(
    () => {
      if (!didMountedRef.current) {
        didMountedRef.current = true;
        return undefined;
      }
      return cb();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}
