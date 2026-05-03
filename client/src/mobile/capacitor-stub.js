/**
 * Stub for all @capacitor/* packages.
 * Used by Vite's alias config on web builds where Capacitor is not installed.
 * Capacitor.isNativePlatform() → false causes init.js to bail out immediately.
 */

export const Capacitor = {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
};

// Plugin stubs — never reached on web because init.js returns early
export const StatusBar = {};
export const Style = {};
export const SplashScreen = {};
export const Keyboard = {};
export const App = {};
export const Network = {};
export const Haptics = {};
export const ImpactStyle = { Light: 'LIGHT', Medium: 'MEDIUM', Heavy: 'HEAVY' };

export default {};
