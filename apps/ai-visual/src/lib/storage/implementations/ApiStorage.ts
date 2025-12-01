import { IStorage, StorageOptions, ApiStorageConfig } from "../types";

/**
 * API 存储实现
 * 通过调用后端 API 接口来存储和获取数据
 */
export class ApiStorage implements IStorage {
  private config: ApiStorageConfig;

  constructor(config: ApiStorageConfig) {
    this.config = {
      timeout: 10000,
      headers: {},
      ...config,
    };
  }

  private async fetch<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 10000
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...this.config.headers,
          ...(options.headers as Record<string, string>),
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.config.onError?.(err);
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const url = new URL(this.config.getUrl, window.location.origin);
      url.searchParams.append("key", key);

      const response = await this.fetch<{ data: T | null; expiresAt?: number }>(
        url.toString()
      );

      // 检查是否过期
      if (response.expiresAt && response.expiresAt < Date.now()) {
        await this.remove(key);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`[ApiStorage] Failed to get key "${key}":`, error);
      return null;
    }
  }

  async set<T = any>(
    key: string,
    value: T,
    options?: StorageOptions
  ): Promise<void> {
    try {
      await this.fetch(this.config.setUrl, {
        method: "POST",
        body: JSON.stringify({
          key,
          value,
          expiresIn: options?.expiresIn,
          metadata: options?.metadata,
        }),
      });
    } catch (error) {
      console.error(`[ApiStorage] Failed to set key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.fetch(this.config.removeUrl, {
        method: "DELETE",
        body: JSON.stringify({ key }),
      });
    } catch (error) {
      console.error(`[ApiStorage] Failed to remove key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.config.clearUrl) {
        await this.fetch(this.config.clearUrl, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("[ApiStorage] Failed to clear:", error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.config.getUrl, {
        method: "HEAD",
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
