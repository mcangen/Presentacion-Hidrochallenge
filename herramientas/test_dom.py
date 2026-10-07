import subprocess
import re

out = subprocess.check_output([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless',
    '--disable-gpu',
    '--dump-dom',
    'file:///c:/Users/Unimagdalena/Documents/IEEE/AESS/diapo/presentacion/index.html?slide=3'
], encoding='utf-8', errors='ignore')

matches = re.findall(r'<section\s+class="([^"]*)"\s+id="([^"]*)"', out)
for cls, sid in matches:
    print(f"{sid}: {cls}")
