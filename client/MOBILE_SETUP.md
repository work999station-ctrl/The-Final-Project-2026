# 📱 Stage.io — Mobile (Capacitor) Setup

This document walks you through running the front-end as a native Android / iOS
app using **Capacitor 6**.

---

## 0. Prerequisites

| Platform | Requirement |
|----------|-------------|
| Android  | Android Studio (Iguana+), JDK 17, an emulator or a USB device with USB debugging |
| iOS      | Xcode 15+, CocoaPods (`sudo gem install cocoapods`), a Mac |
| Both     | Node 18+, npm 9+ |

---

## 1. Install dependencies

```bash
cd client
npm install
```

This pulls Capacitor + the plugins we use:

- `@capacitor/core`, `@capacitor/cli`
- `@capacitor/android`, `@capacitor/ios`
- `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/keyboard`
- `@capacitor/app`, `@capacitor/network`, `@capacitor/device`
- `@capacitor/haptics`, `@capacitor/preferences`

---

## 2. First-time platform setup

The `capacitor.config.ts` is already in the repo. Just add the native projects:

```bash
# Build the web bundle into dist/
npm run build

# Add the platforms you need
npx cap add android
npx cap add ios          # mac only

# Sync native plugins + web assets
npx cap sync
```

This creates `client/android/` and/or `client/ios/` folders. They're regular
native projects committed in git.

---

## 3. Configure the API base URL

A native app can't use relative `/api/...` URLs — it has to talk to a real
server. Set `VITE_API_BASE` before building.

```bash
cp .env.example .env.production
```

Edit `.env.production`:

```env
# Android emulator → host machine
VITE_API_BASE=http://10.0.2.2:3000

# iOS simulator
# VITE_API_BASE=http://localhost:3000

# Real phone on the same Wi-Fi as your laptop
# VITE_API_BASE=http://192.168.1.42:3000

# Production
# VITE_API_BASE=https://api.stage.io
```

> The `src/services/http.js` helper uses `import.meta.env.VITE_API_BASE` and
> falls back to `http://10.0.2.2:3000` on native if nothing is set.

---

## 4. Use the http wrapper

Replace direct `fetch('/api/...')` calls with the helper so URLs work on both
web and native:

```js
import { http } from '../services/http';

// before
const res = await fetch('/api/student/me');

// after — same shape, but absolute URL on native
const res = await http('/api/student/me');
const data = await res.json();
```

For images served from the back-end (`/uploads/...`):

```js
import { fileUrl } from '../services/http';
<img src={fileUrl(user.profilePicture)} />
```

> Migration is **not required for it to compile** — relative URLs still work in
> the browser. But on a native build they'll fail without the wrapper.

---

## 5. Run

### Android

```bash
# One-shot: build, sync, launch
npm run cap:run:android

# Or open the project in Android Studio and click ▶
npm run cap:open:android
```

### iOS

```bash
npm run cap:run:ios

# Or open in Xcode
npm run cap:open:ios
```

### Live-reload on a real device (best DX)

1. Find your laptop's LAN IP (`ipconfig` on Windows, `ifconfig` on macOS).
2. In `capacitor.config.ts`, uncomment the `server` block and set the URL to
   `http://<your-lan-ip>:5173`.
3. ```bash
   npx cap sync
   npm run dev:lan          # in one terminal
   npx cap run android      # in another
   ```

Save a file → the device reloads instantly.

---

## 6. After every web change

```bash
npm run cap:sync     # rebuilds dist/ and pushes to native projects
```

You don't need to rebuild the native app unless you've added a plugin or
changed `capacitor.config.ts`.

---

## 7. What's already wired up for you

| File | What it does |
|------|--------------|
| [capacitor.config.ts](capacitor.config.ts) | App ID, splash, status bar, keyboard config |
| [src/mobile/init.js](src/mobile/init.js) | Boots StatusBar / Splash / Keyboard / hardware-back / Network |
| [src/services/http.js](src/services/http.js) | `fetch` wrapper that prepends `VITE_API_BASE` on native |
| [src/main.jsx](src/main.jsx) | Calls `initMobile()` once at boot (no-op on web) |
| [src/index.css](src/index.css) | Safe-area variables, no rubber-band, no tap highlight, offline banner |
| [vite.config.js](vite.config.js) | `host: true` + `base: './'` so the built app loads inside the WebView |

---

## 8. Useful CSS classes for mobile UX

Already available globally:

```html
<header class="pt-safe">…</header>     <!-- pads for the notch -->
<footer class="pb-safe">…</footer>     <!-- pads for the home indicator -->
<button class="tap">…</button>         <!-- press-down scale animation -->
```

The `<html>` element gets these classes from `initMobile`:

- `is-native` — running inside Capacitor
- `is-android` / `is-ios` — current platform
- `kb-open` — soft keyboard is open (use `--kb-height` CSS var)
- `offline` — device has lost network (shows the red banner automatically)

---

## 9. Trigger haptic feedback (optional)

```js
import { haptic } from '../mobile/init';
await haptic('light');   // or 'medium' / 'heavy'
```

Use it on the apply button, success toast, or any other tactile moment.

---

## 10. Common gotchas

- **CORS** — your back-end must accept the Capacitor origin. On Android the app
  loads from `http://localhost`, on iOS from `capacitor://localhost`. Add both
  to your `cors()` allowlist.
- **Cookies** — sessions need `SameSite=None; Secure` on production HTTPS, or
  switch to JWTs stored via `@capacitor/preferences`.
- **Mixed content** — Android blocks plain HTTP from an HTTPS WebView. We've
  set `allowMixedContent: true` for dev; **disable it for production** and use
  HTTPS for your API.
- **Splash screen stuck** — increase `launchShowDuration` in
  `capacitor.config.ts` or call `SplashScreen.hide()` manually.

---

## 11. One-line build for stores

```bash
# Android
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease

# iOS — open in Xcode and Archive
npm run build && npx cap sync ios && npx cap open ios
```

Happy shipping 🚀
