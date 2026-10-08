---
key: fastrawviewer
title: Pulahpilih vs FastRawViewer for RAW culling
description: Pulahpilih and FastRawViewer compared for RAW culling: how each shows RAW files, price model, selection workflow and when to pick which.
date: 2026-10-08
---

FastRawViewer is a paid app that renders the actual RAW data, with RAW histograms and exposure warnings, which makes it well suited to judging the technical quality of RAW files. Pulahpilih is a free, open source Windows app that uses the JPEG preview embedded in each RAW file and focuses on one goal: narrowing a folder down to an exact target count, with optional guest voting from a browser.

## Comparison at a glance

| | Pulahpilih | FastRawViewer |
| --- | --- | --- |
| Price model | Free | Paid license |
| Platform | Windows 10 and 11 (64-bit) | Windows and macOS |
| How RAW is shown | Embedded JPEG preview | Renders the actual RAW data |
| RAW exposure analysis | No | Yes, including RAW histograms |
| Main focus | Culling to an exact count | Viewing and technically assessing RAW |
| Rounds until the count is exact | Yes, automatic | No |
| Guests vote from a browser | Yes, via link and PIN | No |
| Non-RAW formats | JPG, PNG, WebP | Mainly focused on RAW |
| Open source | Yes, GPL-3.0 | No |

## When FastRawViewer is the better choice

Choose FastRawViewer when your decisions depend on the technical quality of the RAW file. The embedded JPEG is produced by the camera with its own settings, so it can look different from the real RAW data, especially in highlights and shadows. Because FastRawViewer renders the RAW data itself and shows RAW histograms, you can tell whether a highlight is truly clipped or still recoverable in editing. For landscape or commercial photographers who care about exposure, that matters.

FastRawViewer also runs on macOS; Pulahpilih is Windows only.

## When Pulahpilih is the better choice

Pulahpilih fits when you're judging moments, expressions and composition, and the result has to be an exact number.

- **Exact count, automatically.** Round one collects candidates. Too many, and narrowing rounds show only your picks. Too few, and last round's rejects come back until the count is exact.
- **Three photos side by side.** Bursts are faster to compare.
- **Clients or friends can vote.** Click **Share**, send the link and 4-digit PIN. They cull in a browser, then you approve the result by vote count. Guests only see copies of 800 KB at most.
- **Mixed formats.** One folder can hold RAW, JPG, PNG and WebP. RAW and JPG files with the same name move together.
- **Free and open source.**

## How each one culls

In FastRawViewer you typically assign ratings or labels, then move or filter files based on them.

In Pulahpilih, press **→** or **↑** to pick and **←** or **↓** to reject. Picks move into a `selected` subfolder straight away. **Backspace** undoes the last decision and moves the file back; **Space** or **Z** zooms in. Nothing is ever deleted.

## Which one to choose

- **Choose FastRawViewer** if you reject photos mostly for technical reasons, such as clipped highlights or missed focus, and need to see the real RAW data.
- **Choose Pulahpilih** if you choose by moment and expression, need an exact final count, or want clients to vote without installing anything.
- **Use both** if you want two passes: best moments first, then a technical check on the survivors.

For graduations and weddings, the speed of picking moments usually matters more than per-photo exposure analysis.

## Using both

Use Pulahpilih to trim the set by moment and expression, then open the `selected` folder in FastRawViewer to check RAW exposure before editing. Reverse the order if technical quality is your first filter.

Read [how to sort RAW photos on Windows](/en/articles/sort-raw-photos-on-windows), [how to pick the best photos](/en/articles/how-to-pick-best-photos), or [other comparisons](/en/compare). [Download Pulahpilih](/en#download) to try it for free.

## FAQ

### Why does Pulahpilih use the embedded JPEG preview?

Speed. The embedded preview is already inside the RAW file, so Pulahpilih doesn't need to convert the full RAW data for every photo.

### Will colours in Pulahpilih match my edit?

Not necessarily. The embedded preview follows the camera settings at capture time. For precise exposure checks, an app that renders the actual RAW data is more accurate.

### Which RAW formats does Pulahpilih support?

CR2, CR3, NEF, ARW, DNG, RAF, ORF, RW2, PEF and SRW.

### Does Pulahpilih save ratings to XMP sidecar files?

No. Pulahpilih marks picks by moving files into the `selected` subfolder.
