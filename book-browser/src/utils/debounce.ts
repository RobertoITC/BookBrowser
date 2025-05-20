// File: src/utils/debounce.ts
/**
 * Returns a debounced version of the provided function.
 * @param fn the function to debounce
 * @param delay milliseconds to wait before invoking fn
 */
export function debounce<Func extends (...args: any[]) => void>(
    fn: Func,
    delay: number
): (...args: Parameters<Func>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<Func>) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
