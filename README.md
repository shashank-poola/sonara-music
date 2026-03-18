# Sonara (Lokal)

A mobile music app built with Expo and React Native. Browse, search, and play music with a clean, modern interface.

---

## Setup

**Prerequisites:** Node.js 18+, npm or yarn

1. **Install dependencies**

   ```bash
   cd lokal
   npm install
   ```

2. **Configure the API base URL**

   The app talks to a backend that proxies JioSaavn-style search and streaming APIs. Set the base URL in `lokal/src/api/client.ts` or via environment variables (e.g. `EXPO_PUBLIC_SAAVN_BASE_URL`). Without this, search and playback will fail.

3. **Run the app**

   ```bash
   npm start
   ```

   Then press `a` for Android, `i` for iOS, or `w` for web.

---

## Architecture

- **Framework:** Expo (SDK 54) with React Native
- **Routing:** Expo Router (file-based, stack + tabs)
- **State:** Zustand stores for player, queue, playlists, and downloads
- **Audio:** `expo-av` with a singleton `AudioService` that loads streams and drives playback
- **API:** Thin client in `src/api/` calling a backend (search, songs, albums, artists, playlists)

**Layout:**

```
app/
  _layout.tsx          # Root stack, theme, splash
  (tabs)/              # Tab bar: Home, Search, Playlists, Settings
  player/              # Full-screen player modal
  album/[id]           # Album detail
  playlist/[id]        # Playlist detail

src/
  api/                 # API client and endpoints
  components/          # UI components
  hooks/               # useSearch, useDebounce, useAudioPlayer
  store/               # Zustand (player, queue, downloads, playlists)
  services/            # AudioService singleton
  types/               # TypeScript types
```

**Flow:** User searches → `useSearch` calls API → results shown → tap song → `setQueue` + `setCurrentSong` → `AudioService.loadAndPlay` → `expo-av` plays stream.

---

## Trade-offs

| What | Choice | Why |
|------|--------|-----|
| **State** | Zustand | Lightweight, no boilerplate, works well outside React |
| **Audio** | Singleton `AudioService` | One playback instance, shared across screens |
| **API** | Backend proxy | Keeps API keys and logic server-side; app stays simple |
| **Search** | Debounced (450ms) | Fewer requests while typing |
| **Routing** | Expo Router | File-based, fits Expo, typed routes |
| **No auth** | — | App assumes backend handles auth if needed |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm run lint` | Run ESLint |
