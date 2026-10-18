/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<F extends (...args: any[]) => void>(
  fn: F,
  delay: number
) {
  let timer: NodeJS.Timeout;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}
