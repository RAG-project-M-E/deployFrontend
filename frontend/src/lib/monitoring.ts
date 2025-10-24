/**
 * Simple monitoring and logging utility for LexAI
 * Can be extended with external services like Sentry, LogRocket, etc.
 */

export interface LogEvent {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class Monitor {
  private logs: LogEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  // Logging methods
  info(message: string, metadata?: Record<string, unknown>) {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log("error", message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, metadata);
    }
  }

  private log(
    level: LogEvent["level"],
    message: string,
    metadata?: Record<string, unknown>
  ) {
    const event: LogEvent = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.logs.push(event);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to external service if configured
    this.sendToExternalService(event);
  }

  // Performance tracking
  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    };
  }

  recordMetric(
    name: string,
    duration: number,
    metadata?: Record<string, unknown>
  ) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.push(metric);

    // Send to external service if configured
    this.sendMetricToExternalService(metric);
  }

  // User interaction tracking
  trackUserAction(action: string, metadata?: Record<string, unknown>) {
    this.info(`User action: ${action}`, metadata);
  }

  // API call tracking
  trackAPICall(endpoint: string, status: number, duration: number) {
    this.recordMetric(`API: ${endpoint}`, duration, {
      status,
      endpoint,
    });

    if (status >= 400) {
      this.error(`API call failed: ${endpoint}`, { status, duration });
    }
  }

  // Get logs (useful for debugging)
  getLogs(level?: LogEvent["level"]): LogEvent[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  // Get metrics
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((metric) => metric.name === name);
    }
    return [...this.metrics];
  }

  // Clear logs and metrics
  clear() {
    this.logs = [];
    this.metrics = [];
  }

  // External service integration placeholder
  private sendToExternalService(_event: LogEvent) {
    // TODO: Integrate with external logging service
    // Example: Sentry, LogRocket, Datadog, etc.
  }

  private sendMetricToExternalService(_metric: PerformanceMetric) {
    // TODO: Integrate with external monitoring service
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
  }

  // Page view tracking
  trackPageView(path: string) {
    this.info("Page view", { path });
  }
}

// Singleton instance
export const monitor = new Monitor();

// Helper hook for React components
export function useMonitor() {
  return monitor;
}
