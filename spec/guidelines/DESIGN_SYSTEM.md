# Alpha Mail — Design System

Same foundation as `niel` / `bley` (Zapstore-aligned). JS/Svelte only.

| Topic | Decision |
|-------|----------|
| Theme | Light + dark flip `--bg` / `--ink` |
| Accent | Whisper only (checks / selection); CTA fill may tint lightly |
| CTAs | `@alpha/ui` `PrimaryButton` / `GlassButton` — glass-shine stroke, pointer highlight, scale |
| Body | Inter |
| Display | Ovo, heavy |
| Landing | Centered |
| Copy | No em dashes |
| Languages | FR + EN |
| Home | Hero → Pillars → Community → How → Close CTA |

Product identity: **Alpha Mail** / **alphamail.xyz**. Customer Spaces use their own domains.

Tweak CTA glass stroke via `--glass-shine` (and `--button-hover-scale` / `--button-shine-*`) in shared tokens.
