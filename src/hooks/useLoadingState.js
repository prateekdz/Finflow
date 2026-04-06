import { useEffect, useState } from 'react';

export function useLoadingState(trigger, debounceMs = 300) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    const timer = setTimeout(() => setIsLoading(false), debounceMs);
    return () => clearTimeout(timer);
  }, [trigger, debounceMs]);

  return isLoading;
}
