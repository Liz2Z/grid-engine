export default function debounce<Fn extends (...args: any[]) => void>(callback: Fn, debounce: number = 300): Fn {
  let timer: number | undefined;

  return ((...args: any[]) => {
    if (typeof timer !== 'undefined') {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      timer = undefined;
      callback(...args);
    }, debounce);
  }) as Fn;
}
