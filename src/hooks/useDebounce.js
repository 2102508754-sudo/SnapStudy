import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating `value` until `delay` ms of silence.
 * Classic debouncing pattern: prevents rapid state updates on fast inputs.
 *
 * @param {any}    value  - The value to debounce (e.g. a search query)
 * @param {number} delay  - Milliseconds to wait after the last change
 * @returns {any}           The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule the update
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel if value changes before delay expires (the core of debouncing)
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
