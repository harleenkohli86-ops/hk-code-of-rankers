/**
 * Thin fetch wrapper for the HK backend (/api/*).
 * Login sessions are httpOnly cookies set by the server, so nothing sensitive
 * is stored in the browser (no localStorage tokens, no JSON "database").
 */

export interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T & { success?: boolean; message?: string };
  message: string;
}

export async function api<T = any>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    const ok = res.ok && data?.success !== false;
    return {
      ok,
      status: res.status,
      data: data || {},
      message: data?.message || (ok ? '' : `Request failed (${res.status}).`),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: {} as any,
      message: 'Could not connect to the server. Check your internet connection and try again.',
    };
  }
}

export const apiGet = <T = any>(path: string) => api<T>('GET', path);
export const apiPost = <T = any>(path: string, body: unknown = {}) => api<T>('POST', path, body);
export const apiPut = <T = any>(path: string, body: unknown = {}) => api<T>('PUT', path, body);
export const apiPatch = <T = any>(path: string, body: unknown = {}) => api<T>('PATCH', path, body);
export const apiDelete = <T = any>(path: string) => api<T>('DELETE', path);
