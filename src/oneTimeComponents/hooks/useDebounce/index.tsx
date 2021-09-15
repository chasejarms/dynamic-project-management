import { useState, useEffect } from "react";
import { useSkipNEffects } from "../useSkipNEffects";

export function useDebounce(value: any, delay: number, n?: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useSkipNEffects(
        n || 0,
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay]
    );
    return debouncedValue;
}
