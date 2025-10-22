/**
 * API utility for backend communication
 * Centralized API calls with error handling and monitoring
 */

import { config } from "./config";
import { monitor } from "./monitoring";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface ChatMessage {
  question: string;
  conversationId?: string;
}

export interface ChatResponse {
  answer: string;
  sources?: Array<{
    title: string;
    content: string;
    tag: string;
  }>;
  conversationId: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const duration = performance.now() - startTime;
      monitor.trackAPICall(endpoint, response.status, duration);

      if (!response.ok) {
        const errorText = await response.text();
        monitor.error(`API request failed: ${endpoint}`, {
          status: response.status,
          error: errorText,
        });

        return {
          error: errorText || "Request failed",
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      const duration = performance.now() - startTime;

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          monitor.error(`API request timeout: ${endpoint}`, {
            timeout: this.timeout,
          });
          return {
            error: "Request timeout",
            status: 408,
          };
        }

        monitor.error(`API request error: ${endpoint}`, {
          error: error.message,
        });
        return {
          error: error.message,
          status: 500,
        };
      }

      monitor.trackAPICall(endpoint, 500, duration);
      return {
        error: "Unknown error occurred",
        status: 500,
      };
    }
  }

  // Chat endpoints
  async sendMessage(message: ChatMessage): Promise<ApiResponse<ChatResponse>> {
    monitor.trackUserAction("api-send-message");
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(message),
    });
  }

  // Saved answers endpoints
  async getSavedAnswers(): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    return this.request("/api/saved-answers", {
      method: "GET",
    });
  }

  async saveAnswer(data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
    monitor.trackUserAction("api-save-answer");
    return this.request("/api/saved-answers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteSavedAnswer(id: string): Promise<ApiResponse<void>> {
    monitor.trackUserAction("api-delete-saved-answer");
    return this.request(`/api/saved-answers/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request("/api/health", {
      method: "GET",
    });
  }
}

export const api = new ApiClient();
export default api;
