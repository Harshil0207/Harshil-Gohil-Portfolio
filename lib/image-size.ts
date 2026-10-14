import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ImageSize = { width: number; height: number };

/**
 * Reads an image's intrinsic size straight out of its header.
 *
 * The case-study screen is cut to the capture it holds rather than to a fixed
 * ratio, so no screenshot is ever cropped to fit a box — captures are the one
 * thing on this site that must be shown whole, and they do not all arrive the
 * same shape. `match-kicks.jpg` is 1112×709 where every other one is 2560×1387.
 *
 * This runs in a server component and every case study is prerendered, so the
 * read happens at build and never in a request. Two formats is enough: the
 * pipeline writes JPEG, and hand-added captures have been PNG.
 */
export function imageSize(publicPath: string): ImageSize | null {
  try {
    const file = readFileSync(join(process.cwd(), "public", publicPath));
    return fromPng(file) ?? fromJpeg(file);
  } catch {
    return null;
  }
}

function fromPng(file: Buffer): ImageSize | null {
  if (file.length < 24) return null;
  if (file.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}

function fromJpeg(file: Buffer): ImageSize | null {
  if (file.length < 4 || file.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < file.length) {
    if (file[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = file[offset + 1];

    // Standalone markers carry no length segment to skip over.
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) {
      offset += 2;
      continue;
    }
    if (marker >= 0xd0 && marker <= 0xd7) {
      offset += 2;
      continue;
    }

    // A start-of-frame carries the dimensions; height precedes width.
    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isFrame) {
      return {
        height: file.readUInt16BE(offset + 5),
        width: file.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + file.readUInt16BE(offset + 2);
  }

  return null;
}
