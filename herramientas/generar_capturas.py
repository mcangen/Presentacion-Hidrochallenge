import subprocess
import os
import tempfile
import shutil

# Rutas de salida garantizadas
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # .../presentacion
capturas_dir_1 = os.path.join(base_dir, 'capturas')
capturas_dir_2 = os.path.join(os.path.dirname(base_dir), 'capturas')

os.makedirs(capturas_dir_1, exist_ok=True)
os.makedirs(capturas_dir_2, exist_ok=True)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
temp_profile = tempfile.mkdtemp()

try:
    # 10 Diapositivas Principales
    for s in range(1, 11):
        out_file_1 = os.path.join(capturas_dir_1, f'slide_{s}.png')
        out_file_2 = os.path.join(capturas_dir_2, f'slide_{s}.png')
        url = f'file:///{base_dir.replace("\\", "/")}/index.html?slide={s}'
        subprocess.run([
            chrome_path,
            '--headless',
            '--disable-gpu',
            f'--user-data-dir={temp_profile}',
            '--disable-application-cache',
            '--disable-cache',
            '--window-size=1280,720',
            '--virtual-time-budget=2000',
            f'--screenshot={out_file_1}',
            url
        ], capture_output=True)
        if os.path.exists(out_file_1):
            shutil.copy2(out_file_1, out_file_2)
            size = os.path.getsize(out_file_1)
            print(f"Slide {s:02d}: OK ({size} bytes)")
        else:
            print(f"Slide {s:02d}: FAIL")

    # 7 Respaldos Técnicos B1 a B7 (Slides 11 a 17)
    for b in range(1, 8):
        s = 10 + b
        out_file_1 = os.path.join(capturas_dir_1, f'slide_B{b}.png')
        out_file_2 = os.path.join(capturas_dir_2, f'slide_B{b}.png')
        url = f'file:///{base_dir.replace("\\", "/")}/index.html?slide={s}'
        subprocess.run([
            chrome_path,
            '--headless',
            '--disable-gpu',
            f'--user-data-dir={temp_profile}',
            '--disable-application-cache',
            '--disable-cache',
            '--window-size=1280,720',
            '--virtual-time-budget=2000',
            f'--screenshot={out_file_1}',
            url
        ], capture_output=True)
        if os.path.exists(out_file_1):
            shutil.copy2(out_file_1, out_file_2)
            size = os.path.getsize(out_file_1)
            print(f"Backup B{b}: OK ({size} bytes)")
        else:
            print(f"Backup B{b}: FAIL")
finally:
    shutil.rmtree(temp_profile, ignore_errors=True)
