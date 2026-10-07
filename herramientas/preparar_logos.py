"""Genera versiones blancas con transparencia de los logos institucionales."""
from PIL import Image, ImageOps
import os
SRC = r"c:\Users\Unimagdalena\Documents\IEEE\AESS\diapo"
OUT = os.path.join(SRC, "presentacion", "assets", "img")
os.makedirs(OUT, exist_ok=True)

def to_white(path, mode, out, lo, hi):
    im = Image.open(path).convert("L")
    if mode == "dark":  # dark logo on light bg
        im = ImageOps.invert(im)
    # map [lo, hi] -> [0, 255]
    a = im.point(lambda v: 0 if v <= lo else 255 if v >= hi else int((v - lo) * 255 / (hi - lo)))
    bbox = a.getbbox()
    a = a.crop(bbox)
    white = Image.new("RGBA", a.size, (255, 255, 255, 0))
    white.putalpha(a)
    # pad a bit
    w, h = white.size
    pad = int(max(w, h) * 0.02)
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (255, 255, 255, 0))
    canvas.paste(white, (pad, pad))
    canvas.save(os.path.join(OUT, out))
    print(out, canvas.size)

to_white(os.path.join(SRC, "AEES logo.jpeg"), "light", "logo_aess_white.png", 135, 235)
to_white(os.path.join(SRC, "1.png"), "dark", "logo_ieee_sb_white.png", 40, 200)
to_white(os.path.join(SRC, "Diseño sin título.png"), "light", "logo_facultad_white.png", 40, 200)

# territorio: imagen satelital y nube (atenuadas en CSS)
for f, o in [("Sierra_Nevada_de_Santa_Marta_desde_el_espacio.jpg", "satelite_sierra.jpg"),
             ("nube_convectiva.jpg", "nube_convectiva.jpg")]:
    Image.open(os.path.join(SRC, f)).convert("RGB").save(os.path.join(OUT, o), quality=88)
    print(o)
