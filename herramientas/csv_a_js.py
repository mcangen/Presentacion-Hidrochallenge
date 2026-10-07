"""Convierte un archivo CSV de telemetría de campo al formato que lee la presentación AESS-SAT."""
import csv, sys, os, json

def parse_telemetry(csv_path):
    rows = []
    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        for r in reader:
            try:
                t = float(r.get('t', r.get('time', r.get('tiempo', 0))))
                alt = float(r.get('alt', r.get('altitud', r.get('altitude', 0))))
                p = float(r.get('p', r.get('presion', r.get('pressure', 1013.25))))
                acc = float(r.get('az', r.get('accel', r.get('acel', 0))))
                rows.append({"t": round(t, 2), "alt": round(alt, 1), "pres": round(p, 1), "acc": round(acc, 2)})
            except ValueError:
                continue
    return rows

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python csv_a_js.py <archivo_telemetria.csv>")
        sys.exit(1)
    p = sys.argv[1]
    data = parse_telemetry(p)
    out = os.path.splitext(p)[0] + "_telemetria.json"
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Exportadas {len(data)} muestras a {out}")
