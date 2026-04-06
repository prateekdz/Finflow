import { cn } from "@/lib/utils";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50">
      <button
        type="button"
        className="absolute inset-0 bg-transparent"
        onClick={() => onOpenChange?.(false)}
        aria-label="Close dialog"
      />
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ className, children }) => (
  <div className={cn("rounded-3xl border border-border/70 bg-card p-6 shadow-2xl", className)}>{children}</div>
);

export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-xl font-semibold text-foreground">{children}</h3>;
export const DialogFooter = ({ children }) => <div className="mt-6 flex justify-end gap-3">{children}</div>;
export const DialogTrigger = ({ children }) => children;