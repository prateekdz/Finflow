import { DEFAULT_TICKER_ITEMS } from '../../data/mockData';

export function TickerBar() {
  const items = [...DEFAULT_TICKER_ITEMS, ...DEFAULT_TICKER_ITEMS];

  return (
    <div className="overflow-hidden border-b border-slate-200/70 bg-slate-950 text-slate-100 dark:border-slate-800">
      <div className="ticker-track hover:[animation-play-state:paused]">
        {items.map((item, index) => {
          const positive = item.change.startsWith('+');
          return (
            <div key={`${item.label}-${index}`} className="mx-2 my-2 flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${positive ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
              <span className="font-semibold">{item.label}</span>
              <span>{item.value}</span>
              <span className={positive ? 'text-emerald-300' : 'text-rose-300'}>{item.change}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
