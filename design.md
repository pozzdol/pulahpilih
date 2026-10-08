# Design — Pulahpilih

A locked design system for the Pulahpilih website (`web/`). It mirrors the desktop app's
look (`src/routes/+page.svelte`): pre-Liquid-Glass macOS Sonoma, systemBlue, system fonts.
Every page change reads this file first. Extend or amend it; don't redesign per page.

## Genre
modern-minimal (app-matched accent instead of monochrome)

## Macrostructure family
- Marketing (home): **Split Studio**. Split hero (claim + download left, the live sorter demo
  right), then diptych rows alternating text|proof and proof|text. Text always leads on one column.
- Content (articles, use cases, comparisons, help, privacy, releases): single centred column,
  measure 66ch, breadcrumb above the H1, download CTA card at the end.
- Hubs (`/artikel`, `/kegunaan`, `/bandingkan`): index list, title + one-line description.

## Theme
Tokens live in `web/src/lib/tokens.css` (light + dark). Key values:
- `--color-paper` oklch(97% 0.002 286) · `--color-surface` oklch(100% 0 0)
- `--color-ink` oklch(22.6% 0.004 286) · `--color-ink-2` oklch(54.3% 0.008 286)
- `--color-accent` oklch(60.4% 0.218 257) systemBlue: focus rings, marks, active photo outline
- `--color-accent-fill` oklch(56.6% 0.2 257): filled buttons (white text passes 4.5:1)
- `--color-link` oklch(51.5% 0.18 257): text links (5.6:1 on paper)
- `--color-pick` / `--color-reject`: green / red, only for pick/reject meaning

## Typography
- Display and body: system UI stack (SF Pro on Apple, Segoe UI Variable on Windows). No webfonts.
- Display 700, tracking -0.02em to -0.03em, `--text-display` clamp(2.375rem … 4rem). Always roman.
- Mono: `--font-mono` for file names, links, code only.

## Spacing
4-point named scale in `tokens.css` (`--space-3xs` … `--space-3xl`). Sections are separated by `--space-3xl`.

## Motion
Motion-cut. Only state feedback: button background 160ms `--ease-out`, `scale(0.97)` on press,
FLIP of the demo photos (220ms). No scroll reveals. Reduced motion: transitions off.

## Microinteractions stance
- Silent success, no toasts.
- Download button detects the OS (`web/src/lib/platform.ts`); on unsupported devices it shows a
  warning and turns into a quiet "Download anyway" button, never blocks.

## CTA voice
- Primary: pill, `--color-accent-fill`, white 600 text, optional 16px stroke icon.
- Secondary: plain text link in `--color-link`, or pill with `--color-control` + `--shadow-control`.

## Chrome
- Nav: N5 floating pill, solid `--color-surface` (no glass), brand · links · ID/EN · Download pill.
- Footer: Ft2 single line with hairline above: wordmark + tagline, privacy, GitHub, license, other language.

## What pages MUST share
Wordmark and icon, accent usage, system fonts, pill CTA voice, nav and footer.

## What pages MAY differ on
Diptych proof content on marketing pages; content pages stay typographic.

## Exports

### tokens.css
See `web/src/lib/tokens.css` (canonical).
