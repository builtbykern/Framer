#!/usr/bin/env python3
"""Halden listing images — Marketplace grid language, not device-render slop.

Observed on Photography Templates (Aug 2026):
- Grid is near-black. Winning thumbs sit on white / color, never charcoal.
- Fiber / Kai Marlow / SwissFolio: rounded screens as cards, padding so nothing
  touches the crop, hairline, whisper shadow.
- Kima: phone is a vertical rounded rect, not a cropped iPhone.
- SwissFolio: collage of many small screens with even gaps.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

RAW = Path("/Users/noel/Desktop/Framer/docs/projects/halden/media/stills/raw")
OUT = Path("/Users/noel/Desktop/Framer/docs/projects/halden/media/stills")

W, H = 2400, 1800
BEZEL = (22, 20, 18)
HAIR = (158, 148, 134)
WASH_A = (247, 239, 226)
WASH_B = (168, 158, 142)


def load(name: str) -> Image.Image:
    return Image.open(RAW / name).convert("RGB")


def rounded(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def scale_to_width(img: Image.Image, width: int) -> Image.Image:
    h = max(1, round(img.height * (width / img.width)))
    return img.resize((width, h), Image.Resampling.LANCZOS)


def scale_to_height(img: Image.Image, height: int) -> Image.Image:
    w = max(1, round(img.width * (height / img.height)))
    return img.resize((w, height), Image.Resampling.LANCZOS)


def screen_card(src: Image.Image, width: int, radius: int, pill: bool = False) -> Image.Image:
    body = scale_to_width(src, width)
    bezel = 8 if width > 500 else 10
    inner_r = max(8, radius - 6)
    outer_r = radius
    outer = (body.width + bezel * 2, body.height + bezel * 2)
    plate = Image.new("RGBA", outer, (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle(
        (0, 0, outer[0] - 1, outer[1] - 1), outer_r, fill=BEZEL + (255,)
    )
    inner = Image.new("RGBA", body.size, (0, 0, 0, 0))
    inner.paste(body)
    inner.putalpha(rounded(body.size, inner_r))
    plate.alpha_composite(inner, (bezel, bezel))
    if pill:
        d = ImageDraw.Draw(plate)
        pw = max(36, width // 18)
        px = (outer[0] - pw) // 2
        d.rounded_rectangle((px, bezel // 2 - 2, px + pw, bezel // 2 + 4), 3, fill=(8, 8, 8, 255))
    return plate


def whisper(base: Image.Image, layer: Image.Image, xy: tuple[int, int], radius: int) -> None:
    # Bezel does the lift. Marketplace winners (Kai Marlow, Fiber) barely shadow.
    base.alpha_composite(layer if layer.mode == "RGBA" else layer.convert("RGBA"), xy)


def studio() -> Image.Image:
    base = Image.new("RGB", (W, H), WASH_A)
    wash = Image.new("RGB", (W, H), WASH_B)
    vert = Image.linear_gradient("L").resize((1, H)).resize((W, H))
    horz = Image.linear_gradient("L").resize((W, 1)).resize((W, H))
    diag = Image.blend(vert, horz, 0.5)
    field = Image.composite(base, wash, diag)
    vignette = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vignette).ellipse((-140, -80, W + 140, H + 80), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(220))
    field = Image.composite(field, wash, vignette)
    grain = Image.effect_noise((W, H), 26).convert("L")
    speck = Image.merge("RGB", (grain, grain, grain))
    field = Image.blend(field, speck, 0.08)
    return field.convert("RGBA")


def save(img: Image.Image, stem: str) -> None:
    rgb = img.convert("RGB")
    rgb.save(OUT / f"{stem}.jpg", quality=92, optimize=True, subsampling=1)
    rgb.resize((1600, 1200), Image.Resampling.LANCZOS).save(
        OUT / f"{stem}-1600.jpg", quality=92, optimize=True, subsampling=1
    )


def thumb() -> Image.Image:
    board = studio()
    desk = screen_card(load("d-home.png"), 1480, 24, pill=True)
    phone = screen_card(load("m-overlay.png"), 460, 32)
    desk_xy = (56, (H - desk.size[1]) // 2)
    phone_xy = (W - phone.size[0] - 52, (H - phone.size[1]) // 2 + 8)
    whisper(board, desk, desk_xy, 20)
    whisper(board, phone, phone_xy, 28)
    return board


def one_card(src: Image.Image, width: int, radius: int = 20) -> Image.Image:
    board = studio()
    card = screen_card(src, width, radius)
    xy = ((W - card.size[0]) // 2, (H - card.size[1]) // 2)
    whisper(board, card, xy, radius)
    return board


def collage() -> Image.Image:
    board = studio()
    tiles = [
        (load("d-home.png"), 760),
        (load("d-lookbook.png"), 760),
        (load("d-overlay.png"), 760),
        (load("d-404.png"), 760),
        (load("t-home.png"), 480),
        (load("m-home.png"), 300),
    ]
    cards = [screen_card(im, w, 22 if w > 400 else 30, pill=w > 400) for im, w in tiles]
    gap = 28
    row1 = cards[:3]
    row2 = cards[3:]
    def row_width(row):
        return sum(c.size[0] for c in row) + gap * (len(row) - 1)
    y1 = 150
    x = (W - row_width(row1)) // 2
    for c in row1:
        whisper(board, c, (x, y1), 18)
        x += c.size[0] + gap
    y2 = y1 + max(c.size[1] for c in row1) + 32
    x = (W - row_width(row2)) // 2
    for i, c in enumerate(row2):
        r = 18 if i < 2 else 26
        whisper(board, c, (x, y2), r)
        x += c.size[0] + gap
    return board


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    t = thumb().convert("RGB")
    t.save(OUT / "Halden_thumbnail.jpg", quality=92, optimize=True, subsampling=1)
    t.resize((1600, 1200), Image.Resampling.LANCZOS).save(
        OUT / "Halden_thumbnail-1600.jpg", quality=92, optimize=True, subsampling=1
    )
    save(t, "01-thumb")

    save(collage(), "02-collage")
    save(one_card(load("d-home.png"), 1680, 24), "03-home")
    save(one_card(load("d-lookbook.png"), 1680, 24), "04-lookbook")
    save(one_card(load("d-overlay.png"), 1680, 24), "05-overlay")
    save(one_card(load("d-404.png"), 1680, 24), "06-404")
    save(one_card(load("m-home.png"), 620, 32), "07-phone-home")
    save(one_card(load("m-lookbook.png"), 620, 32), "08-phone-lookbook")
    save(one_card(load("m-overlay.png"), 620, 32), "09-phone-overlay")
    save(one_card(load("t-home.png"), 1120, 24), "10-tablet-home")

    print("ok", Image.open(OUT / "Halden_thumbnail.jpg").size)


if __name__ == "__main__":
    main()
