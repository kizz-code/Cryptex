/**
 * ErrorBoundary — React class component that catches unhandled render errors
 * anywhere in the component tree below it and shows a recovery UI.
 *
 * Why a class component? React's componentDidCatch / getDerivedStateFromError
 * lifecycle methods are only available on class components as of React 18.
 */

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to an error-tracking service (Sentry, etc.)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl">
            ⚠
          </div>
          <div>
            <h3 className="text-gray-200 font-semibold mb-1">Something went wrong</h3>
            <p className="text-gray-500 text-sm font-mono max-w-md">{this.state.message}</p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-surface-700 hover:bg-surface-600 border border-surface-600
                       rounded-lg text-sm font-mono text-gray-300 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
