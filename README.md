# Pulahpilih

Windows app for sorting a folder of photos down to an exact target count. Compare three photos at a time, pick with the arrow keys, and repeat rounds until the `selected` subfolder holds exactly as many photos as you need. Friends can help through a temporary share link.

Download: see the [releases](https://github.com/pozzdol/pulahpilih/releases/latest).

## Repository layout

| Path | What |
| --- | --- |
| `src/` | App UI (SvelteKit, Svelte 5) |
| `src-tauri/` | App backend (Rust, Tauri 2): sorting rounds, file moves, sharing server |
| `web/` | Download website (SvelteKit, static), deployed to Cloudflare Pages (root `web`, build `npm run build`, output `build`) |
| `release-notes/` | Notes for each version, used as the GitHub Release body |
| `.github/workflows/release.yml` | Builds and publishes a release when a `v*` tag is pushed |

## Development

```
npm install
npm run tauri dev
```

`npm run tauri build` needs `src-tauri/binaries/cloudflared-x86_64-pc-windows-msvc.exe` (copy of `cloudflared.exe`; the release workflow downloads it).

Website:

```
cd web
npm install
npm run dev
```

## Releasing

1. Bump `version` in `src-tauri/tauri.conf.json` (and `package.json`, `src-tauri/Cargo.toml`).
2. Write `release-notes/vX.Y.Z.md`.
3. Commit, then `git tag vX.Y.Z && git push origin main vX.Y.Z`.

The workflow builds the installer, signs the updater files, publishes the GitHub Release and redeploys the website.

Repository secrets:

- `TAURI_SIGNING_PRIVATE_KEY`: contents of the updater private key
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: its password (empty if none)
- `CLOUDFLARE_DEPLOY_HOOK`: Cloudflare Pages deploy hook URL, rebuilds the website after a release (optional)

## License

GPL-3.0-only, see [LICENSE](LICENSE).

## Third-party

Ships [cloudflared](https://github.com/cloudflare/cloudflared) (Apache 2.0) and [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) (MIT).
