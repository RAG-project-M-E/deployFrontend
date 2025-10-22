"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);

    // You can integrate with error tracking services here
    // Example: Sentry, LogRocket, etc.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorLogger = (window as any).errorLogger;
      if (errorLogger) {
        errorLogger.logError({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-[#F9F8F6] p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertTriangle className="text-red-500" size={48} />
              </div>
            </div>
            <h1 className="text-2xl font-playfair font-bold text-[#0A1F44] mb-3">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-600 mb-6">
              Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenileyin veya
              daha sonra tekrar deneyin.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#D4AF37] text-white px-6 py-3 rounded-full hover:opacity-90 transition-all font-medium"
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full border border-gray-300 text-[#0A1F44] px-6 py-3 rounded-full hover:bg-[#F9F8F6] transition-all font-medium"
              >
                Tekrar Dene
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Hata Detayları (Geliştirici Modu)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
