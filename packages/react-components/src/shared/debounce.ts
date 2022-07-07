export default function debounce<Fn extends (...args: any[]) => void>(callback: Fn, debounce: number = 300): Fn {
  let timer: number | undefined;

  return ((...args: any[]) => {
    if (typeof timer !== 'undefined') {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
      callback(...args);
    }, debounce);
  }) as Fn;
}
