import React from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}) {
  const buttonLabel = action?.label || actionLabel;
  const buttonAction = action?.onClick || onAction;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-5xl opacity-60">{icon}</div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-xs text-center">
        {description}
      </p>
      {buttonLabel && buttonAction && (
        <button
          onClick={buttonAction}
          className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
