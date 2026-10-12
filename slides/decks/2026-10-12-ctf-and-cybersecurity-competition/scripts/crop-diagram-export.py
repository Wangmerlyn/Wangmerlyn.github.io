#!/usr/bin/env python3
"""Crop whitespace from a full-page Excalidraw screenshot."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageChops


def crop_content(path: Path, out: Path, pad: int = 12) -> tuple[int, int]:
	im = Image.open(path).convert("RGB")
	bg = Image.new("RGB", im.size, (255, 255, 255))
	diff = ImageChops.difference(im, bg)
	bbox = diff.getbbox()
	if not bbox:
		raise SystemExit(f"No content detected in {path}")
	x0, y0, x1, y1 = bbox
	x0 = max(0, x0 - pad)
	y0 = max(0, y0 - pad)
	x1 = min(im.width, x1 + pad)
	y1 = min(im.height, y1 + pad)
	cropped = im.crop((x0, y0, x1, y1))
	cropped.save(out, format="PNG", optimize=False)
	return cropped.size


def main() -> None:
	if len(sys.argv) != 3:
		raise SystemExit("usage: crop-diagram-export.py <input.png> <output.png>")
	inp = Path(sys.argv[1])
	out = Path(sys.argv[2])
	size = crop_content(inp, out)
	print(f"saved {out} ({size[0]}x{size[1]})")


if __name__ == "__main__":
	main()
