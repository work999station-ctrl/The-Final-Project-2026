/**
 * Lightweight fetch wrapper that resolves the right API base URL
 * depending on whether the app runs in:
 *   - the browser (relative `/api/...` works thanks to Vite proxy)
 *   - a Capacitor native app (must use an absolute URL)
 *
 * Set `VITE_API_BASE` in `.env.production` for native builds.
 *
 * For Android emulator pointing at your local server use http://10.0.2.2:3000
 * For iOS simulator use http://localhost:3000
 * For a real device on the same LAN use http://<your-lan-ip>:3000
 */

const ENV_BASE = import.meta.env?.VITE_API_BASE || '';

// Capacitor exposes this global synchronously when the script loads inside
// the native WebView. We detect it without importing @capacitor/core,
// so the web bundle stays clean even if Capacitor is not installed yet.
const isNative = typeof window !== 'undefined' &&
    !!window.Capacitor?.isNativePlatform?.();

export const API_BASE = isNative ? (ENV_BASE || 'http://10.0.2.2:3000') : ENV_BASE;

const isAbsolute = (url) => /^https?:\/\//i.test(url);

const buildUrl = (path) => {
    if (isAbsolute(path)) return path;
    if (!API_BASE) return path; // browser → Vite proxy
    return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
};

const defaultInit = {
    credentials: 'include', // keep cookies for sessions on web AND native
};

/**
 * Drop-in replacement for `fetch` that prepends `API_BASE` for relative paths.
 *
 *   import { http } from '../services/http';
 *   const res = await http('/api/student/me');
 */
export const http = (path, init = {}) => {
    return fetch(buildUrl(path), { ...defaultInit, ...init });
};

http.get = (path, init = {}) => http(path, { method: 'GET', ...init });

http.post = (path, body, init = {}) =>
    http(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
        body: typeof body === 'string' ? body : JSON.stringify(body),
        ...init,
    });

http.put = (path, body, init = {}) =>
    http(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
        body: typeof body === 'string' ? body : JSON.stringify(body),
        ...init,
    });

http.del = (path, init = {}) => http(path, { method: 'DELETE', ...init });

/**
 * Resolves a relative `/uploads/...` path to an absolute URL on native.
 *   <img src={fileUrl(user.logo)}/>
 */
export const fileUrl = (path) => {
    if (!path) return '';
    if (isAbsolute(path)) return path;
    return buildUrl(path);
};

export const isNativeApp = () => isNative;
