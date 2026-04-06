import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
          <h3 className="text-lg font-bold">Something went wrong on this page</h3>
          <p className="mt-2 text-sm">Refresh the page to try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
