/**
 * Mobile bootstrapping: only runs when the app is loaded inside a
 * Capacitor WebView (Android / iOS).
 *
 * Imported once from `main.jsx`. Safe no-op on the web.
 */

let initialized = false;

export const initMobile = async () => {
    if (initialized) return;
    initialized = true;

    let Capacitor;
    try {
        ({ Capacitor } = await import('@capacitor/core'));
    } catch {
        return; // Capacitor not installed → web build, nothing to do
    }
    if (!Capacitor?.isNativePlatform?.()) return;

    const platform = Capacitor.getPlatform(); // 'ios' | 'android'

    // Mark <html> so we can target native styles
    document.documentElement.classList.add('is-native', `is-${platform}`);

    // ---------------- Status bar ----------------
    try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({
            style: document.documentElement.classList.contains('dark') ? Style.Dark : Style.Light,
        });
        if (platform === 'android') {
            await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
        }
        await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (e) {
        console.warn('[mobile] StatusBar init failed', e);
    }

    // ---------------- Splash screen ----------------
    try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        // The native splash auto-hides via capacitor.config; force-hide as a safety net.
        setTimeout(() => SplashScreen.hide().catch(() => {}), 1500);
    } catch (e) {
        console.warn('[mobile] SplashScreen init failed', e);
    }

    // ---------------- Keyboard ----------------
    try {
        const { Keyboard } = await import('@capacitor/keyboard');
        Keyboard.addListener('keyboardWillShow', (info) => {
            document.documentElement.style.setProperty('--kb-height', `${info.keyboardHeight}px`);
            document.documentElement.classList.add('kb-open');
        });
        Keyboard.addListener('keyboardWillHide', () => {
            document.documentElement.style.setProperty('--kb-height', '0px');
            document.documentElement.classList.remove('kb-open');
        });
    } catch (e) {
        // Keyboard plugin is optional
    }

    // ---------------- Android back button ----------------
    try {
        const { App } = await import('@capacitor/app');
        App.addListener('backButton', ({ canGoBack }) => {
            if (canGoBack) {
                window.history.back();
            } else {
                App.exitApp();
            }
        });
    } catch {
        /* ignore */
    }

    // ---------------- Network status (sync with global event) ----------------
    try {
        const { Network } = await import('@capacitor/network');
        const status = await Network.getStatus();
        document.documentElement.classList.toggle('offline', !status.connected);
        Network.addListener('networkStatusChange', (s) => {
            document.documentElement.classList.toggle('offline', !s.connected);
        });
    } catch {
        /* ignore */
    }
};

/**
 * Re-apply status bar style when the user toggles dark mode at runtime.
 * Call from your ThemeContext after a theme change.
 */
export const syncStatusBarToTheme = async (theme) => {
    try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
        if (Capacitor.getPlatform() === 'android') {
            await StatusBar.setBackgroundColor({ color: theme === 'dark' ? '#0F172A' : '#FFFFFF' });
        }
    } catch {
        /* ignore */
    }
};

/**
 * Trigger a small haptic — useful on apply, success toast, etc.
 */
export const haptic = async (style = 'light') => {
    try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
        await Haptics.impact({ style: map[style] || ImpactStyle.Light });
    } catch {
        /* ignore */
    }
};
