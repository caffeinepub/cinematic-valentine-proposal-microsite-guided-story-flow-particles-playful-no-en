import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RuntimeErrorFallback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Filter out known non-fatal warnings
    if (error.message?.includes('raft-editor') || error.message?.includes('disallowed origin')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Filter out known non-fatal warnings
    if (error.message?.includes('raft-editor') || error.message?.includes('disallowed origin')) {
      return;
    }
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-container">
          <div className="error-fallback-content">
            <h1 className="error-fallback-title">Something went wrong</h1>
            <p className="error-fallback-message">
              We encountered an error loading the experience. Please refresh the page to try again.
            </p>
            {this.state.error && (
              <details className="error-fallback-details">
                <summary>Error details</summary>
                <pre className="error-fallback-stack">{this.state.error.message}</pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="error-fallback-button"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
