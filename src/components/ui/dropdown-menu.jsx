export const DropdownMenu = ({ children }) => children;
export const DropdownMenuContent = ({ children }) => children;
export const DropdownMenuItem = ({ children, ...props }) => <div {...props}>{children}</div>;
export const DropdownMenuLabel = ({ children }) => children;
export const DropdownMenuSeparator = () => <hr />;
export const DropdownMenuTrigger = ({ children }) => children;