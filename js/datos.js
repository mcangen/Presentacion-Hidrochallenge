/* ════════════════════════════════════════════════════════════════════
   AESS-SAT · MISIÓN BRISA — ARCHIVO CENTRAL DE DATOS TÉCNICOS
   ────────────────────────────────────────────────────────────────────
   Hidrochallenge Colombia 2026 · Rama IEEE / Capítulo AESS Unimagdalena
   Ficha Maestra Congelada
   ════════════════════════════════════════════════════════════════════ */

window.AESS = {

  /* ── ESTADO GENERAL ─────────────────────────────────────────────── */
  ensayoRealizado: false,

  /* ── EQUIPO OFICIAL (6 INTEGRANTES) ─────────────────────────────── */
  expositor: "Hugo Andrés Bustamante Palacio",
  equipoTotal: 6,
  equipo: [
    {
      numero: 1,
      nombre: "Hugo Andrés Bustamante Palacio",
      cargo: "Líder General / Presidente AESS UNIMAGDALENA",
      rol: "Expositor Oficial & Coordinación General"
    },
    {
      numero: 2,
      nombre: "Raúl Alfonso Bayter Lara",
      cargo: "Asesor Académico / Integración y Telemetría",
      rol: "Arquitectura de Sistemas y Enlace de Datos"
    },
    {
      numero: 3,
      nombre: "Natalia Andrea Berdugo González",
      cargo: "Líder de Aviónica, Sensórica y Telecomunicaciones",
      rol: "Heltec WiFi LoRa 32 V3, Sensores GY-91 y GPS NEO-M8N"
    },
    {
      numero: 4,
      nombre: "Jesús David Brugés Machado",
      cargo: "Líder de Diseño Mecánico CAD, Estructuras y Aerodinámica",
      rol: "Modelado 3D, Aerodinámica y Análisis Estructural"
    },
    {
      numero: 5,
      nombre: "Romeiro Cantillo Fonseca",
      cargo: "Líder de Propulsión Hidroneumática y Rampa",
      rol: "Cámara PET 3L, Tobera y Banco de Empuje"
    },
    {
      numero: 6,
      nombre: "José Ángel Granados Pérez",
      cargo: "Líder de Sistema de Recuperación y Carga Útil",
      rol: "Paracaídas Ø75 cm, Servomotor MG90S y Eyección"
    }
  ],

  /* ── PARÁMETROS MAESTROS DEL VEHÍCULO ────────────────────────────── */
  masa: 335,                   // Masa final en gramos
  alturaCohete: 65,            // Altura total en cm
  diametro: 12,                // Diámetro en cm
  cg: 28,                      // Centro de Gravedad en cm desde la punta
  cp: 42,                      // Centro de Presión en cm desde la punta
  margenEstabilidad: 1.17,     // (42 - 28) / 12 = 1.17 calibres
  aletas: 3,                   // 3 trapezoidales simétricas a 120°
  distribucionAletas: "3 aletas trapezoidales simétricas cada 120°",
  ojiva: "Parabólica roma 3D", // Ojiva parabólica roma
  estructura: "2 botellas PET de 3 L en serie",

  /* ── PROPULSIÓN HIDRONEUMÁTICA ───────────────────────────────────── */
  volumenBotella: 3,           // Volumen de cámara en litros
  agua: 1,                     // Aprox. 1 L de agua
  aire: 2,                     // Aprox. 2 L de aire
  presionMaxima: 70,           // ≤ 70 PSI

  /* ── TRAYECTORIA Y MISIÓN (OPENROCKET / DINÁMICA) ────────────────── */
  altitudMaxima: 30.1,         // 30.1 m apogeo previsto
  tiempoApogeo: 2.32,          // 2.32 s
  optimalDelay: 2.26,          // 2.26 s
  tiempoVuelo: 11.3,           // 11.3 s
  velocidadSalidaGuia: 25.8,   // 25.8 m/s
  velocidadMaxima: 37.4,       // 37.4 m/s
  aceleracionMaxima: 550,      // 550 m/s²
  velocidadDespliegue: 4.52,   // 4.52 m/s al momento del despliegue
  velocidadDescenso: 3.4,      // 3.4 m/s velocidad de aterrizaje / llegada a tierra

  /* ── SISTEMA DE RECUPERACIÓN ─────────────────────────────────────── */
  paracaidasDiametro: 75,      // Circular Ø75 cm
  servo: "MG90S",

  /* ── AVIÓNICA Y TELEMETRÍA ───────────────────────────────────────── */
  computador: "Heltec WiFi LoRa 32 V3",
  procesador: "ESP32-S3",
  radio: "SX1262 integrado",
  frecuenciaLora: 915,         // LoRa 915 MHz
  enlaceComplementario: "ESP-NOW 2,4 GHz",  // Estación terrena ↔ ESP32-CAM + Heltec
  sensorica: "GY-91",
  gps: "NEO-M8N",
  camara: "ESP32-CAM",
  alimentacion: "LiPo 1S",
  estacionTerrena: "Heltec WiFi LoRa 32 V3 + Laptop / Dashboard",

  /* ── VARIABLES OFICIALES DE MISIÓN (6 CATEGORÍAS) ─────────────────── */
  variablesMision: [
    "Altitud",
    "Temperatura",
    "Presión atmosférica",
    "Aceleración XYZ",
    "Latitud",
    "Longitud"
  ],

  /* ── HELPERS DE FORMATEO LIMPIO (SEMÁNTICA ESTRICTA) ────────────── */
  formatValue: function (val, unit, fallbackText) {
    if (val === null || val === undefined || isNaN(val)) {
      return `<span class="status-badge pending">${fallbackText || 'PENDIENTE DE ENSAYO'}</span>`;
    }
    return `${val} ${unit || ''}`;
  }
};
