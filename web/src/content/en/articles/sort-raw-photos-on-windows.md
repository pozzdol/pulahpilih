---
key: raw
title: How to sort RAW photos on Windows without Lightroom
description: Cull RAW and RAW+JPG pairs on Windows fast without importing into a catalog: use the embedded JPEG preview, choose first and edit later.
date: 2026-10-08
---

The fastest way to sort RAW photos on Windows is to use a viewer that reads the JPEG preview embedded in each RAW file, instead of an editor that imports and renders every frame. Photos appear instantly, you pick and reject first, and only the keepers go into Lightroom or any other editor. Make sure RAW and JPG files with the same name always move together.

## Why culling RAW files is often slow

A RAW file holds unprocessed sensor data. To show it properly, an editor has to "develop" it: apply white balance, tone curves and lens corrections. That is heavy work, especially across hundreds of files that are tens of megabytes each.

It gets worse when you use a catalog-based editor to cull:

- **Importing takes time.** Every file has to be registered in the catalog before you can look at it.
- **Previews have to be built.** Until they are, moving between photos stutters.
- **You process photos you'll throw away.** Most frames from a shoot usually don't make the cut.

The built-in Windows viewer doesn't solve it either. RAW support depends on which codecs are installed, and there is no simple way to move a RAW+JPG pair as one.

## Embedded JPEG previews: the key to fast culling

Almost every camera stores a full-size or large JPEG inside the RAW file. The camera creates it when you shoot; it's the same image you see on the camera's screen.

For choosing photos, that preview is enough:

- **Sharp enough to check focus** when zoomed in.
- **Expression, open eyes and composition** are clearly visible.
- **No processing required,** so it shows up immediately.

One caveat: colour and brightness follow the camera's settings, not your future edit. For culling, that doesn't matter.

## Keeping RAW and JPG pairs together

Many photographers shoot RAW+JPG: the JPG for quick delivery, the RAW for editing. Sorting by hand in File Explorer, it's easy to move the JPG and leave the RAW behind, or the other way round.

The rule is simple: **files with the same base name are one photo.** `IMG_1234.CR3` and `IMG_1234.JPG` should always live in the same folder. A good culling tool treats them as a single item.

## A RAW culling workflow before editing

1. **Copy the card into one folder per shoot.** Don't import into your editor's catalog yet.
2. **Set a target number.** A target makes the cut decisive. See [how to pick your best photos](/en/articles/how-to-pick-best-photos) for criteria and a pass-by-pass method.
3. **Cull using the embedded previews.** Pick and reject with the keyboard, in a few rounds, until you hit the number.
4. **Move the keepers into their own subfolder,** RAW and JPG together.
5. **Import only that subfolder into Lightroom or another editor.** Your catalog stays lean and your editing time goes only to photos you'll actually use.

## Common mistakes when culling RAW files

A few habits make RAW culling slower or put files at risk:

- **Deleting while you cull.** Once a frame is gone, you can't bring it back when the client asks for it. It's safer to move the keepers elsewhere and leave the rest alone.
- **Editing before you finish choosing.** Tweaking one photo's colour is tempting, but it breaks your focus. Finish the cull first.
- **Judging colour from the preview.** The preview follows the camera profile. A frame that looks too dark or too warm can usually be fixed from the RAW data, so judge focus and moment instead.
- **Splitting RAW and JPG by hand.** Moving files one by one in File Explorer makes it easy to miss one, and a stray file means searching for it later.
- **Sorting by file name with two cameras.** File numbers from two bodies don't line up in time. Sort by date taken so the same moment stays together.
- **Culling straight from the memory card.** Copy to disk first. Cards are slower and easier to corrupt.

## Sorting RAW photos with Pulahpilih

[Pulahpilih](/en) follows this workflow. It is free, open source and runs on Windows 10 and 11 (64-bit).

- **Supported formats:** CR2, CR3, NEF, ARW, DNG, RAF, ORF, RW2, PEF and SRW, plus JPG, PNG and WebP. HEIC is not supported yet.
- **RAW previews use the embedded JPEG,** so photos appear fast with no import step.
- **RAW+JPG pairs with the same name move together.** When a JPG exists, that is what you see.
- **Three photos at once.** Press → or ↑ to pick, ← or ↓ to reject, Space or Z to zoom, Backspace to undo.
- **Picks move into a `selected` subfolder.** Later rounds narrow that folder down until it holds exactly your target. Rejects stay in the original folder, and nothing is ever deleted.
- **Sort by date taken (EXIF)** so bursts from the same moment sit next to each other.

When you're done, import the `selected` folder into your editor of choice. For a closer look at the differences, see [Pulahpilih vs Lightroom](/en/compare/pulahpilih-vs-lightroom) and [Pulahpilih vs FastRawViewer](/en/compare/pulahpilih-vs-fastrawviewer).

There are also workflow examples for [wedding photos](/en/use-cases/wedding-photos) and [event photos](/en/use-cases/event-photos).

[Download Pulahpilih](/en#download) and try it on one of your shoots.

## FAQ

### Is the embedded JPEG preview good enough to check focus?

On most modern cameras, yes. The embedded preview is usually full size or close to it, so eye sharpness and fine detail are visible when you zoom in.

### Does sorting change my RAW files?

No. Pulahpilih only reads the preview and moves files between folders. The RAW data is never touched and nothing is deleted.

### What if I shoot RAW only, without JPG?

That's fine. Pulahpilih pulls the JPEG preview out of the RAW file itself, so RAW files on their own are enough.

### Are iPhone HEIC photos supported?

Not yet. Supported formats are JPG, PNG, WebP and the RAW formats listed above.
