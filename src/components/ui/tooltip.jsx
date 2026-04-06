export function Tooltip({ content, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block group-focus-within:block">
        {content}
      </span>
    </span>
  );
}
