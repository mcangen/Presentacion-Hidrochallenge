import subprocess
import json
import re

def test():
    cmd = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless',
        '--disable-gpu',
        '--virtual-time-budget=3000',
        '--dump-dom',
        'file:///c:/Users/Unimagdalena/Documents/IEEE/AESS/diapo/presentacion/index.html'
    ]
    out = subprocess.check_output(cmd, encoding='utf-8', errors='ignore')
    
    # Verificación de que NO existan placeholders descuidados tipo "XX"
    # Buscamos 'XX' que no forme parte de una palabra legítima
    xx_matches = re.findall(r'(?<![A-Za-z0-9])XX(?![A-Za-z0-9])', out)
    
    # Cadenas obsoletas que NO deben aparecer
    legacy_forbidden = ['399 g', '380 g', '70 m', '60 m', '100 m', '4 aletas', 'cuatro aletas', '67 cm', '4.54 m/s', '5,2 m/s', '5.2 m/s', 'DHT11', 'GY-GPSV3', 'MARGEN CRÍTICO', '80 PSI']
    found_forbidden = [w for w in legacy_forbidden if w in out]
    
    new_assets = [
        'cohete_slide_1.png', 'imagen_slide_2.png', 'cohete_slide_4.png',
        'cohete_slide_7.png', 'cohete_slide_7_chute.png', 'ojiva.png',
        'recuperacion.png', 'avionica.png', 'fuselaje.png', 'aletas.png', 
        'dashboard_telemetria.jpg', 'esquematico_avionica.jpg', 'qr_telepatin.png'
    ]
    missing_assets = [a for a in new_assets if a not in out]
    
    checks = {
        "Longitud DOM (> 40k chars)": len(out) > 40000,
        "Diapositiva 1 activa": 'id="slide-1"' in out,
        "Diapositiva 10 de cierre": 'id="slide-10"' in out,
        "Respaldos B1 a B7 presentes": all(f'id="slide-{i}"' in out for i in range(11, 18)),
        "Canvas de telemetria presente": 'id="telemetryChart"' in out,
        "Identidad Hugo Bustamante": 'Bustamante' in out,
        "Equipo de 6 en una linea": 'Natalia Berdugo' in out and 'Romeiro Cantillo' in out,
        "Subtitulo Mision BRISA": 'BRISA' in out,
        "Masa final 335 g estricta": '335 g' in out,
        "Altitud maxima 30.1 m estricta": '30.1 m' in out or '30,1 m' in out,
        "Dimensiones 65 cm y 12 cm": '65 cm' in out and '12 cm' in out,
        "Empenaje 3 aletas a 120°": '3 aletas' in out and '120°' in out,
        "Estabilidad margen 1,17 calibres": '1,17' in out,
        "Velocidad aterrizaje 3,4 m/s": '3,4 m/s' in out,
        "Velocidad despliegue 4,52 m/s": '4,52 m/s' in out,
        "Paracaídas circular Ø75 cm": '75 cm' in out,
        "Aviónica Heltec V3 y ESP32-S3": 'Heltec' in out and 'ESP32-S3' in out,
        "Sensórica GY-91 y GPS NEO-M8N": 'GY-91' in out and 'NEO-M8N' in out,
        "Presion 70 PSI maxima estricta (no 80 PSI)": '70 PSI' in out and '80 PSI' not in out,
        "Esquemático real de aviónica": 'esquematico_avionica.jpg' in out,
        "Dashboard telemétrico estación terrena": 'dashboard_telemetria.jpg' in out,
        "Código QR TelePatin oficial": 'qr_telepatin.png' in out,
        "Modales de zoom esquemático y dashboard": 'id="schematic-modal"' in out and 'id="dashboard-modal"' in out,
        "Integración de nuevos activos visuales": len(missing_assets) == 0,
        "Ausencia total de cadenas legadas obsoletas": len(found_forbidden) == 0,
        "Zero placeholders 'XX' descuidados": len(xx_matches) == 0,
        "Badges de estado semantico presentes": 'status-badge' in out and 'CUMPLE' in out
    }
    
    print("=== RESULTADOS DE VERIFICACION DE LA PRESENTACION AESS-SAT ===")
    all_ok = True
    for k, v in checks.items():
        status = "[OK]" if v else "[FALLO]"
        print(f"{status} {k}: {v}")
        if not v:
            all_ok = False
            
    print(f"\nESTADO GENERAL: {'LISTO PARA COMPETENCIA (AEROSPACE GRADE)' if all_ok else 'REVISAR DETALLES'}")
    return all_ok

if __name__ == '__main__':
    test()
