import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 rounded-full bg-indigo-500 p-3 text-white shadow-xl transition hover:-translate-y-0.5 md:bottom-6"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
