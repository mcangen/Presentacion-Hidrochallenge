import subprocess
import os

os.makedirs('capturas', exist_ok=True)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# 10 Diapositivas Principales
for s in range(1, 11):
    out_file = os.path.abspath(f'capturas/slide_{s}.png')
    url = f'file:///c:/Users/Unimagdalena/Documents/IEEE/AESS/diapo/presentacion/index.html?slide={s}'
    subprocess.run([
        chrome_path,
        '--headless',
        '--disable-gpu',
        '--window-size=1280,720',
        '--virtual-time-budget=2000',
        f'--screenshot={out_file}',
        url
    ], capture_output=True)
    size = os.path.getsize(out_file) if os.path.exists(out_file) else 0
    print(f"Slide {s:02d}: {'OK' if size > 10000 else 'FAIL'} ({size} bytes)")

# 7 Respaldos Técnicos B1 a B7 (Slides 11 a 17)
for b in range(1, 8):
    s = 10 + b
    out_file = os.path.abspath(f'capturas/slide_B{b}.png')
    url = f'file:///c:/Users/Unimagdalena/Documents/IEEE/AESS/diapo/presentacion/index.html?slide={s}'
    subprocess.run([
        chrome_path,
        '--headless',
        '--disable-gpu',
        '--window-size=1280,720',
        '--virtual-time-budget=2000',
        f'--screenshot={out_file}',
        url
    ], capture_output=True)
    size = os.path.getsize(out_file) if os.path.exists(out_file) else 0
    print(f"Backup B{b}: {'OK' if size > 10000 else 'FAIL'} ({size} bytes)")
