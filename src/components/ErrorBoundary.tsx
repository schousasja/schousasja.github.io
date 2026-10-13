import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-ivory px-6 text-center text-brand-blue">
          <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold flex items-center justify-center rounded-full mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif mb-4">Advisory Session Interrupted</h2>
          <p className="text-sm text-brand-blue/70 max-w-md mb-8 leading-relaxed">
            A temporary client interface exception occurred. Your saved progress is preserved. Please refresh to resume your session.
          </p>
          <button
            onClick={this.handleReset}
            className="btn-briefing flex items-center gap-3 py-3 px-8"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Advisory
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
