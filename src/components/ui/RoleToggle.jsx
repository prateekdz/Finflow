export function RoleToggle({ role, onChange }) {
  return (
    <div className="grid w-full grid-cols-2 rounded-full p-1" style={{ background: 'var(--bg-base)' }}>
      {['viewer', 'admin'].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="rounded-full px-4 py-2 text-sm font-semibold capitalize transition"
          style={
            role === value
              ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' }
              : { color: 'var(--text-secondary)' }
          }
        >
          {value}
        </button>
      ))}
    </div>
  );
}
