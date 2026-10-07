import urllib.request
import re
import os

fonts_dir = r"c:\Users\Unimagdalena\Documents\IEEE\AESS\diapo\presentacion\assets\fonts"
css_file = r"c:\Users\Unimagdalena\Documents\IEEE\AESS\diapo\presentacion\css\fonts.css"
os.makedirs(fonts_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
url = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
req = urllib.request.Request(url, headers=headers)

with urllib.request.urlopen(req) as resp:
    css_content = resp.read().decode("utf-8")

# Extract font face blocks for latin
blocks = re.findall(r"/\* latin \*/\s*@font-face\s*\{([^}]+)\}", css_content)
if not blocks:
    # fallback to all @font-face
    blocks = re.findall(r"@font-face\s*\{([^}]+)\}", css_content)

local_css = []
count = 0

for b in blocks:
    fam_match = re.search(r"font-family:\s*['\"]([^'\"]+)['\"]", b)
    weight_match = re.search(r"font-weight:\s*(\d+)", b)
    url_match = re.search(r"url\((https://[^)]+\.woff2)\)", b)
    
    if not (fam_match and weight_match and url_match):
        continue
        
    fam = fam_match.group(1)
    weight = weight_match.group(1)
    font_url = url_match.group(1)
    
    clean_fam = fam.lower().replace(" ", "-")
    fname = f"{clean_fam}-{weight}.woff2"
    local_path = os.path.join(fonts_dir, fname)
    
    if not os.path.exists(local_path):
        urllib.request.urlretrieve(font_url, local_path)
    count += 1
    
    local_css.append(f"""@font-face {{
  font-family: '{fam}';
  font-style: normal;
  font-weight: {weight};
  font-display: swap;
  src: url('../assets/fonts/{fname}') format('woff2');
}}""")

with open(css_file, "w", encoding="utf-8") as f:
    f.write("\n\n".join(local_css))

print(f"Descargadas {count} fuentes WOFF2 y guardado en {css_file}")
