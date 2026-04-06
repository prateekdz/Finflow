import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 800, shouldCount = true) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!shouldCount) {
      setCount(target); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const currentCount = Math.floor(target * eased);

      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, shouldCount]);

  return count;
}
