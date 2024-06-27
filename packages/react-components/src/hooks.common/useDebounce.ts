import useAutoClearSetTimeout from './useAutoClearSetTimeout';

/**
 * debounce。**注意** 需要为每个debounce都要执行一次useDebounce。
 * @returns {(fn: function, interval: number)=>void} debounce
 *
 * @example
 *
 * const debounce = useDebounce();
 *
 * useEffect(()=>{
 *  debounce(doSomething, 300);
 * },[deps]);
 *
 * */
const useDebounce = () => useAutoClearSetTimeout(true);

export default useDebounce;
