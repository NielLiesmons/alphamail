# `@alpha/ui`

Shared design-system package for Admin, Player, Bley, and later customer UIs.

**Owns:** CSS tokens, SVG icons, Svelte chrome primitives (shell, sheets, icons).  
**Does not own:** Drive/session/chat/mail domain logic, product routing, or copy.

## Install (local apps)

Sibling checkout + file dependency:

```json
{
  "dependencies": {
    "@alpha/ui": "file:../alpha-ui"
  }
}
```

Then `npm install` / `bun install`. Vite apps should set:

```js
// vite.config.js
ssr: { noExternal: ['@alpha/ui'] }
```

## Tokens

**Source of truth:** `tokens/tokens.css` → `@alpha/ui/tokens.css`.

```css
@import '@alpha/ui/tokens.css';
```

Apps keep font `@import`s and product CSS. Do not fork token values in app `:root` — override Space brand knobs (`--accent`, fonts) on `<html>` instead (see `alpha-docs/ADR-shared-design-system.md`).

## Icons

**SVG SoT:** `icons/*.svg` → `@alpha/ui/icons/<name>.svg`.  
**Svelte wrappers:** `NavIcon`, `BaseIcon`, `Pen`, `Trash`.

```svelte
import NavIcon from '@alpha/ui/NavIcon.svelte';
<NavIcon name="songs" size={18} />
```

Player-oriented names: `songs`, `albums` / `releases`, `playlists`, `recent` / `played`, `artists`.  
Admin names unchanged: `drive`, `mail`, `chat`, `tasks`, …

Stroke weight from CSS `--icon-stroke` with `vector-effect: non-scaling-stroke`.

## Chrome primitives

| Export | Role |
|--------|------|
| `UiShell.svelte` | Configurable app frame: sidebar nav, list column + scroll fader, mobile bottom pill, optional detail slot, create menu, filters, pull-to-refresh |
| `DetailChrome.svelte` | Detail column frame (desktop pane + mobile slide-over) |
| `ChromeMobileBar.svelte` | Round back + centered muted title (Admin/Player mobile detail) |
| `Button.svelte` | Shared CTA (`primary` / `glass`) — glass-shine stroke, pointer highlight, scale |
| `PrimaryButton.svelte` | Primary glass CTA (Admin publish + marketing) |
| `GlassButton.svelte` | Secondary glass CTA |
| `ListTitleChrome.svelte` | List-column title (root large / nested round-back + muted) |
| `Modal.svelte` | Bottom / floating sheet |
| `CreateSheet.svelte` | Create/edit overlay (keyboard-aware) |
| `FloatPanel.svelte` | Portaled glass popover |
| `PullToRefresh.svelte` | Mobile pull-to-refresh |
| `Spinner.svelte` | Loading spinner |
| `chrome-scroll-fade.js` | `--chrome-scroll-fade` driver |

### Configuring Player nav

```js
// alpha-player/src/lib/sections.js
export const primaryNav = [
  { href: '/songs', label: 'Songs', icon: 'songs', countKey: 'tracks', createKind: 'upload' },
  { href: '/albums', label: 'Albums', icon: 'albums', countKey: 'albums' },
  { href: '/playlists', label: 'Playlists', icon: 'playlists', countKey: 'playlists', createKind: 'playlist' },
  { href: '/recent', label: 'Recent', icon: 'recent' },
  { href: '/played', label: 'Played', icon: 'played' }
];
```

```svelte
<UiShell
  sections={primaryNav}
  mobileSections={mobileNav}
  activeHref={activeHref}
  counts={{ tracks, playlists, albums }}
  createMenuItems={[
    { kind: 'upload', label: 'Upload audio' },
    { kind: 'playlist', label: 'New playlist' }
  ]}
  onNavigate={go}
  onCreate={onCreate}
  onNavPlus={onNavPlus}
>
  {#snippet detail()}…{/snippet}
  <!-- list column children -->
</UiShell>
```

Admin passes its own `sections` from `sections.js` (Tasks, Notes, …) into the same `UiShell`.

## Shared `.bley.farm` session

Admin (`admin.bley.farm`) and Player (`player.bley.farm`) share Drive auth on the parent `.bley.farm` cookie domain so deep-linking does not re-login.

## Design rules

- Accent is **not** default UI text — use grayscale (`--fg` / `--fg-66` / …) for copy; accent for fills/status.
- Counts / chrome labels: Inter (via `--font` / explicit Inter stack).
- Primary CTAs stay ink-on-bg, not accent-filled.
