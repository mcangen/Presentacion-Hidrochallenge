/**
 * AESS-SAT // MISIÓN BRISA - HIDROCHALLENGE COLOMBIA 2026
 * Suite de Presentación Dinámica, Interactiva y Samaria
 * Expositor Oficial: Hugo Andrés Bustamante Palacio (Equipo de 6)
 * Universidad del Magdalena · Rama Estudiantil IEEE · Capítulo AESS
 */

(function () {
  'use strict';

  // ── CONSTANTES GLOBALES Y ESTADO ────────────────────────────────────
  const MAIN_SLIDE_COUNT = 10;
  const TOTAL_SLIDES = 17; // 10 principales + 7 respaldos técnicos (B1 - B7)
  const SLIDE_DURATIONS = [
    20, 30, 35, 35, 40, 35, 35, 30, 25, 15, // Diapositivas 1 a 10 (300s exactos)
    60, 60, 60, 60, 60, 60, 60              // Respaldos B1 a B7 (Tiempo flexible en Q&A)
  ];

  let currentSlide = 1;
  let timerSeconds = 0;
  let slideSeconds = 0;
  let timerRunning = false;
  let timerInterval = null;

  // Canal de sincronización con vista de presentador
  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('aess_sat_telemetry') : null;

  // ── GUIONES ORALES Y GUÍAS DE RESPALDO (17 SECCIONES) ─────────────
  const SPEAKER_SCRIPTS = [
    // S1 (20s)
    "«Buenos días, honorable jurado calificador. Soy Hugo Andrés Bustamante Palacio y, en representación de nuestro equipo de seis integrantes de la Rama Estudiantil IEEE y el Capítulo AESS de la Universidad del Magdalena, presentamos AESS-SAT y nuestra Misión BRISA. Concebimos una plataforma experimental de ingeniería capaz de medir, transmitir por LoRa 915 MHz y recuperar información útil en cada metro recorrido hasta 70 metros de altitud máxima.»",
    // S2 (30s)
    "«Nuestra misión nace del territorio donde estudiamos ingeniería. Santa Marta presenta una singularidad geográfica mundial: la Sierra Nevada se eleva 5.700 metros a escasos 42 kilómetros del mar. Esta interacción genera brisas marinas y gradientes térmicos únicos. Desarrollamos AESS-SAT como una sonda atmosférica recuperable para caracterizar la columna vertical inferior de 0 a 70 metros, integrando telemetría continua y salvaguarda total del vehículo.»",
    // S3 (35s)
    "«Concebimos AESS-SAT bajo un enfoque modular de ingeniería en cinco componentes: ojiva parabólica roma 3D, sistema de recuperación con paracaídas circular de 75 cm y servomotor MG90S, computador Heltec WiFi LoRa 32 V3 con procesador ESP32-S3 y radio SX1262 integrado, cámara de propulsión con 2 botellas PET de 3 L en serie y empenaje de 3 aletas trapezoidales simétricas a 120°. Cumplimos con 400 g de masa final, 65 cm de altura y 12 cm de diámetro.»",
    // S4 (35s)
    "«En propulsión operamos mediante almacenamiento elástico de energía hidroneumática con 3 L de cámara, empleando un tercio de agua y dos tercios de aire presurizado hasta un máximo estricto de 70 PSI. En aerodinámica, garantizamos estabilidad pasiva con un Centro de Gravedad a 28 cm y Centro de Presión a 42 cm, obteniendo un margen estático de 1,17 calibres que se incrementa en vuelo conforme se expulsa el propelente con 3 aletas trapezoidales a 120°.»",
    // S5 (40s)
    "«El cerebro de la sonda es el computador Heltec WiFi LoRa 32 V3 con chip ESP32-S3. Gestiona la adquisición del módulo sensórico GY-91 por bus I2C y el receptor GPS NEO-M8N por UART, consolidando las seis variables oficiales: altitud, temperatura, presión atmosférica, aceleración triaxial, latitud y longitud. Los datos se almacenan localmente en microSD y se transmiten simultáneamente por LoRa 915 MHz hacia la estación terrena. En pantalla pueden observar el esquemático eléctrico real del sistema.»",
    // S6 (35s)
    "«Para asegurar la recuperación íntegra de la sonda, implementamos una lógica de decisión de apogeo en 5 etapas secuenciales: lockout inicial de 2 segundos para evitar aperturas prematuras durante el empuje, detección de microgravedad, confirmación por gradiente barométrico continuo, activación del servomotor MG90S a los 4,6 segundos y despliegue del paracaídas circular de 75 cm, garantizando un descenso controlado de aproximadamente 5,2 m/s.»",
    // S7 (35s)
    "«El perfil completo de misión dura 24 segundos. El vehículo asciende rápidamente durante la fase de empuje y coasting hasta alcanzar el apogeo a 70 metros a los 4,6 segundos. Tras el despliegue del velamen, desciende de forma controlada a unos 5,2 m/s hasta tocar tierra a los 24 segundos. A lo largo de todo el vuelo, el enlace LoRa a 915 MHz mantiene la transmisión de paquetes binarios hacia nuestra estación terrena.»",
    // S8 (30s)
    "«Verificamos el cumplimiento riguroso de cinco criterios técnicos: masa final reglamentaria de 400 gramos con 65 cm de altura y 12 cm de diámetro; estabilidad pasiva con margen estático de 1,17 calibres y 3 aletas a 120°; enlace de telemetría LoRa 915 MHz continuo hacia estación terrena; recuperación con paracaídas de 75 cm y descenso a 5,2 m/s; y adquisición de las 6 variables oficiales mediante GY-91 y GPS NEO-M8N con respaldo en microSD.»",
    // S9 (25s)
    "«Consolidamos una plataforma experimental rigurosa y escalable. Tras el vuelo, analizaremos la telemetría en tiempo real y cruzaremos los paquetes transmitidos por LoRa 915 MHz con el registro completo en la tarjeta microSD de abordo, evaluando el comportamiento estructural tras el aterrizaje e iterando la arquitectura para futuras misiones de mayor altitud desarrolladas desde la Universidad del Magdalena.»",
    // S10 (15s)
    "«Agradecemos sinceramente al comité de Hidrochallenge Colombia 2026 y a la Universidad del Magdalena. En nombre de nuestro equipo de 6 integrantes de la Rama Estudiantil IEEE y el Capítulo AESS, dejamos a disposición del honorable jurado calificador nuestra plataforma AESS-SAT para la sesión de preguntas técnicas. En la esquina inferior derecha pueden escanear el código QR que conduce a la plataforma web oficial del proyecto con los datos y documentación técnica completa. Muchas gracias.»",
    // B1: Presupuesto de Masa
    "[RESPALDO B1 // MASA] «Jurado: el vehículo AESS-SAT cumple de forma estricta el límite reglamentario con una masa final de 400 gramos, altura total de 65 cm y diámetro de 12 cm. La arquitectura integra 2 botellas PET de 3 L en serie y una única etapa hidroneumática, optimizando cada subsistema para asegurar solidez estructural y ligereza.»",
    // B2: Estabilidad CG / CP
    "[RESPALDO B2 // ESTABILIDAD] «Jurado: el margen estático se define analíticamente como (X_cp - X_cg) / D_ref. Con el Centro de Gravedad a 28 cm y el Centro de Presión a 42 cm medidos desde la ojiva, y un diámetro de referencia de 12 cm, obtenemos un margen de 1,17 calibres con 3 aletas trapezoidales a 120°, lo cual asegura estabilidad pasiva sin oscilaciones violentas.»",
    // B3: Paracaídas y Ecuación
    "[RESPALDO B3 // PARACAÍDAS] «Jurado: la velocidad media de descenso es de aproximadamente 5,2 m/s, dimensionada mediante un paracaídas circular de 75 cm de diámetro accionado por un servomotor metálico MG90S. Esto permite disipar la energía cinética para un aterrizaje suave a los 24 segundos de tiempo total de vuelo.»",
    // B4: Electrónica y Buses
    "[RESPALDO B4 // ELECTRÓNICA] «Jurado: en pantalla pueden observar el esquemático eléctrico real desarrollado por el Capítulo AESS Unimagdalena. Presenta la regulación de energía desde batería LiPo mediante regulador step-down LM2596, el computador Heltec WiFi LoRa 32 V3 con chip ESP32-S3 y transceptor SX1262 a 915 MHz, el módulo sensórico GY-91 por bus I2C, el receptor GPS NEO-M8N por UART, el registro en microSD vía SPI y el accionamiento del servomotor MG90S por canal PWM, cumpliendo la arquitectura completa de alimentación, sensado, control y actuación.»",
    // B5: Telemetría LoRa
    "[RESPALDO B5 // LORA] «Jurado: el ciclo de vida del dato comprende la adquisición de 6 variables con GY-91 y GPS NEO-M8N, el procesamiento central en la Heltec V3, el almacenamiento local inmediato en microSD y la transmisión simultánea por radioenlace LoRa 915 MHz hacia la segunda Heltec de la estación terrena conectada a laptop.»",
    // B6: Calibración e Incertidumbre
    "[RESPALDO B6 // CALIBRACIÓN] «Jurado: la suite instrumental registra 6 variables oficiales: altitud barométrica, presión atmosférica, aceleración triaxial XYZ y temperatura a través del módulo GY-91 en bus I2C, complementadas por latitud y longitud geodésicas suministradas por el receptor GNSS GPS NEO-M8N por puerto serie.»",
    // B7: Requisitos Hidrochallenge
    "[RESPALDO B7 // REQUISITOS] «Jurado: AESS-SAT satisface la totalidad de los requisitos oficiales de Hidrochallenge 2026: cohete de 1 etapa, cámara con 2 botellas PET de 3 L en serie, presión de operación menor o igual a 70 PSI, masa final de 400 g, diámetro de 12 cm, empenaje de 3 aletas trapezoidales a 120°, paracaídas circular de 75 cm y 6 variables oficiales transmitidas por LoRa 915 MHz.»"
  ];

  // ── INICIALIZACIÓN AL CARGAR DOM ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initDeckNavigation();
    initKeyboardEvents();
    initBreezeCanvas();
    initExplodedView();
    initBreezeDirectionToggle();
    initSensorAuditor();
    initApogeeSequence();
    initMissionSimulator();
    initPostflightDemo();
    initSchematicModal();
    startMasterTimer();
  });

  // ── CONTROL DE DIAPOSITIVAS Y NAVEGACIÓN ──────────────────────────
  function initDeckNavigation() {
    // Parámetros de URL (?slide=3 o #slide-3)
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlide = parseInt(urlParams.get('slide'), 10);
    const hashSlide = parseInt(window.location.hash.replace('#slide-', ''), 10);
    if (!isNaN(paramSlide) && paramSlide >= 1 && paramSlide <= TOTAL_SLIDES) {
      currentSlide = paramSlide;
    } else if (!isNaN(hashSlide) && hashSlide >= 1 && hashSlide <= TOTAL_SLIDES) {
      currentSlide = hashSlide;
    }

    updateSlideView();

    // Botones de interfaz discretos
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const fsBtn = document.getElementById('btn-fullscreen');
    const notesBtn = document.getElementById('btn-notes');
    const presBtn = document.getElementById('btn-presenter');
    const timerPill = document.getElementById('timer-pill');
    const backupsBtn = document.getElementById('btn-open-backups');

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
    if (notesBtn) notesBtn.addEventListener('click', toggleNotesDrawer);
    if (presBtn) presBtn.addEventListener('click', openPresenterWindow);
    if (timerPill) timerPill.addEventListener('click', toggleTimer);
    if (backupsBtn) backupsBtn.addEventListener('click', () => goToSlide(11));

    // Escuchar mensajes de la consola de presentador
    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;
        if (msg.type === 'GOTO_SLIDE' && typeof msg.slide === 'number') {
          goToSlide(msg.slide);
        } else if (msg.type === 'RESET_TIMER') {
          timerSeconds = 0;
          slideSeconds = 0;
          updateTimerDisplay();
        } else if (msg.type === 'REQUEST_STATE') {
          syncChannel.postMessage({
            type: 'STATE_RESPONSE',
            slide: currentSlide,
            elapsed: timerSeconds,
            slideElapsed: slideSeconds
          });
        }
      };
    }

    // Gestos táctiles
    let touchStartX = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  function goToSlide(index) {
    if (index < 1 || index > TOTAL_SLIDES) return;
    currentSlide = index;
    slideSeconds = 0;
    updateSlideView();

    // Notificar a la vista de presentador
    if (syncChannel) {
      syncChannel.postMessage({
        type: 'SLIDE_CHANGE',
        slide: currentSlide,
        elapsed: timerSeconds,
        slideElapsed: slideSeconds
      });
    }
  }
  // Exponer a nivel global para botones HTML
  window.goToSlide = goToSlide;

  function updateSlideView() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, idx) => {
      if (idx + 1 === currentSlide) {
        s.classList.add('active');
        // Activar video de fondo si existe
        const video = s.querySelector('.slide-video');
        if (video) video.play().catch(() => {});
        // Animar contadores si existen
        animateCountUp(s);
      } else {
        s.classList.remove('active');
        const video = s.querySelector('.slide-video');
        if (video) video.pause();
      }
    });

    // Indicador superior de diapositiva
    const curEl = document.getElementById('current-slide-num');
    const totalEl = document.getElementById('tracker-total');

    if (curEl && totalEl) {
      if (currentSlide <= MAIN_SLIDE_COUNT) {
        // Modo Presentación Oficial 01 / 10
        curEl.textContent = String(currentSlide).padStart(2, '0');
        totalEl.textContent = ' / 10';
        totalEl.style.display = 'inline';
      } else {
        // Modo Respaldo Técnico (B1 .. B7)
        const backupIdx = currentSlide - MAIN_SLIDE_COUNT;
        curEl.innerHTML = `<span class="status-badge gold" style="font-size: 0.65rem; margin-right: 6px;">ANEXO TÉCNICO</span>B${backupIdx}`;
        totalEl.textContent = ' // RESPALDO';
      }
    }

    // Cajón de notas del expositor
    const notesContent = document.getElementById('notes-text');
    if (notesContent) notesContent.textContent = SPEAKER_SCRIPTS[currentSlide - 1] || 'Sin notas.';
    const notesId = document.getElementById('notes-slide-id');
    if (notesId) {
      if (currentSlide <= MAIN_SLIDE_COUNT) {
        notesId.textContent = `DIAPOSITIVA ${currentSlide} / ${MAIN_SLIDE_COUNT}`;
      } else {
        notesId.textContent = `ANEXO TÉCNICO B${currentSlide - MAIN_SLIDE_COUNT} // RESPALDO Q&A`;
      }
    }

    // Si entramos a la diapo 7 (telemetría), redibujar el canvas
    if (currentSlide === 7 && window.drawTelemetryChart) {
      setTimeout(() => window.drawTelemetryChart(), 100);
    }
  }

  // Animación suave de conteo numérico
  function animateCountUp(container) {
    const counters = container.querySelectorAll('[data-count]');
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const isFloat = String(target).includes('.');
      const duration = 1000;
      const startTime = performance.now();

      function updateNumber(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * ease;
        el.textContent = isFloat ? currentVal.toFixed(1) : Math.round(currentVal);
        if (progress < 1) requestAnimationFrame(updateNumber);
      }
      requestAnimationFrame(updateNumber);
    });
  }

  // ── TECLADO Y ATAJOS ──────────────────────────────────────────────
  function initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goToSlide(currentSlide + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goToSlide(currentSlide - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          toggleNotesDrawer();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          openPresenterWindow();
          break;
        case 't':
        case 'T':
          toggleTimer();
          break;
        case 'b':
        case 'B':
          // Salto directo a respaldo B1 o ciclar respaldos
          e.preventDefault();
          if (currentSlide <= MAIN_SLIDE_COUNT) {
            goToSlide(11); // B1
          } else if (currentSlide < TOTAL_SLIDES) {
            goToSlide(currentSlide + 1);
          } else {
            goToSlide(11);
          }
          break;
        case 'Escape':
          const modal = document.getElementById('schematic-modal');
          if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            return;
          }
          // Si estamos en un anexo técnico, regresar a la diapositiva 10 (cierre)
          if (currentSlide > MAIN_SLIDE_COUNT) {
            goToSlide(MAIN_SLIDE_COUNT);
          }
          break;
        default:
          if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key, 10);
            if (num <= MAIN_SLIDE_COUNT) goToSlide(num);
          } else if (e.key === '0') {
            goToSlide(10);
          }
          break;
      }
    });
  }

  // ── CRONÓMETRO MAESTRO 300s CON ETAPAS DE COLOR ───────────────────
  function startMasterTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (!timerRunning) return;
      timerSeconds++;
      slideSeconds++;
      updateTimerDisplay();

      if (syncChannel) {
        syncChannel.postMessage({
          type: 'TIMER_TICK',
          elapsed: timerSeconds,
          slideElapsed: slideSeconds,
          slide: currentSlide
        });
      }
    }, 1000);
  }

  function toggleTimer() {
    timerRunning = !timerRunning;
    const pill = document.getElementById('timer-pill');
    if (pill) pill.classList.toggle('running', timerRunning);
  }

  function updateTimerDisplay() {
    const disp = document.getElementById('timer-display');
    const pill = document.getElementById('timer-pill');
    if (!disp) return;

    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    disp.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

    // Etapas cromáticas del cronómetro
    if (pill) {
      if (timerSeconds > 300) {
        // Excedido
        pill.style.borderColor = 'var(--accent-red)';
        disp.style.color = 'var(--accent-red)';
      } else if (timerSeconds >= 270) {
        // Zona 4: Alerta final (4:30 a 5:00)
        pill.style.borderColor = 'var(--accent-orange)';
        disp.style.color = 'var(--accent-orange)';
      } else if (timerSeconds >= 240) {
        // Zona 3: Advertencia (4:00 a 4:30)
        pill.style.borderColor = 'var(--accent-gold)';
        disp.style.color = 'var(--accent-gold)';
      } else {
        // Zona nominal (0 a 4:00)
        pill.style.borderColor = 'var(--border-subtle)';
        disp.style.color = 'var(--accent-cyan)';
      }
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function toggleNotesDrawer() {
    const drawer = document.getElementById('notes-drawer');
    if (drawer) drawer.classList.toggle('open');
  }

  function openPresenterWindow() {
    window.open('presentador.html', 'AESS_Presenter_Console', 'width=1120,height=760,menubar=no,toolbar=no');
  }

  // ══════════════════════════════════════════════════════════════════
  // CANVASES & COMPONENTES INTERACTIVOS
  // ══════════════════════════════════════════════════════════════════

  // 1. Fondo de Partículas de Brisa Atmosférica Samaria
  function initBreezeCanvas() {
    const canvas = document.getElementById('breezeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 20 + Math.random() * 45,
        speed: 0.8 + Math.random() * 1.5,
        alpha: 0.15 + Math.random() * 0.35,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(245, 158, 11,'
      });
    }

    function renderBreeze() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.len, p.y - 2);
        ctx.strokeStyle = `${p.color} ${p.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        p.x += p.speed;
        if (p.x > W + 50) {
          p.x = -50;
          p.y = Math.random() * H;
        }
      });
      requestAnimationFrame(renderBreeze);
    }
    renderBreeze();
  }

  // 2. Despiece Interactivo del Cohete (Slide 3)
  function initExplodedView() {
    const stageStack = document.getElementById('stage-stack');
    const toggleBtn = document.getElementById('btn-toggle-explode');
    const parts = document.querySelectorAll('.stage-part');

    const STAGE_INFO = {
      ojiva: {
        badge: '01. AERODINÁMICA // PROA',
        title: 'Ojiva Parabólica Roma 3D',
        desc: 'Cono de baja resistencia aerodinámica impreso en 3D (PLA). Protege la bahía de aviónica y aloja el mecanismo de eyección del paracaídas.',
        spec1: 'PLA Impreso en 3D',
        spec2: 'Perfil Parabólico Romo'
      },
      recup: {
        badge: '02. SALVAGUARDA // RECUPERACIÓN',
        title: 'Bahía de Eyección y Paracaídas',
        desc: 'Aloja el paracaídas circular de Ø75 cm y el servomotor metálico MG90S para la apertura activa del sistema en el apogeo.',
        spec1: 'Paracaídas Circular Ø75 cm',
        spec2: 'Servomotor MG90S'
      },
      avionica: {
        badge: '03. CEREBRO // TELEMETRÍA',
        title: 'Aviónica Heltec WiFi LoRa 32 V3',
        desc: 'Computador de vuelo con procesador ESP32-S3 y transceptor SX1262 integrado a 915 MHz. Módulo sensórico GY-91, GPS NEO-M8N y microSD.',
        spec1: 'Heltec V3 (ESP32-S3 + SX1262)',
        spec2: 'GY-91 + GPS NEO-M8N + microSD'
      },
      camara: {
        badge: '04. PROPULSIÓN // ENERGÍA',
        title: 'Cámara Hidroneumática 3 L',
        desc: 'Estructura principal compuesta por 2 botellas PET de 3 L en serie (volumen de cámara 3 L). ~1 L de agua propelente y ~2 L de aire a presión ≤ 70 PSI.',
        spec1: '2× PET 3L en Serie // Ø12 cm',
        spec2: 'Presión de servicio ≤ 70 PSI'
      },
      aletas: {
        badge: '05. ESTABILIDAD // EMPENAJE',
        title: 'Empenaje Aerodinámico y Tobera',
        desc: '3 aletas trapezoidales distribuidas simétricamente a 120° que garantizan un margen estático de ≈ 1,17 calibres (CG 28 cm / CP 42 cm) para estabilidad pasiva en ascenso.',
        spec1: '3 Aletas Trapezoidales · 120°',
        spec2: 'Margen Estático ≈ 1,17 calibres'
      }
    };

    if (toggleBtn && stageStack) {
      toggleBtn.addEventListener('click', () => {
        stageStack.classList.toggle('expanded');
        toggleBtn.textContent = stageStack.classList.contains('expanded')
          ? '⚡ Contraer Despiece'
          : '⚡ Expandir Despiece';
      });
    }

    parts.forEach((p) => {
      p.addEventListener('click', () => {
        parts.forEach((part) => part.classList.remove('active'));
        p.classList.add('active');

        const key = p.dataset.stage;
        const info = STAGE_INFO[key];
        if (info) {
          const badgeEl = document.getElementById('stage-badge');
          const titleEl = document.getElementById('stage-title');
          const descEl = document.getElementById('stage-desc');
          const spec1El = document.getElementById('stage-spec1');
          const spec2El = document.getElementById('stage-spec2');

          if (badgeEl) badgeEl.textContent = info.badge;
          if (titleEl) titleEl.textContent = info.title;
          if (descEl) descEl.textContent = info.desc;
          if (spec1El) spec1El.textContent = info.spec1;
          if (spec2El) spec2El.textContent = info.spec2;
        }
      });
    });
  }

  // 3. Alternar Viento y Brisa en Slide 2 (Topografía Samaria)
  function initBreezeDirectionToggle() {
    const dayBtn = document.getElementById('btn-breeze-day');
    const nightBtn = document.getElementById('btn-breeze-night');
    const windGroup = document.getElementById('wind-arrows');

    if (dayBtn && nightBtn && windGroup) {
      dayBtn.addEventListener('click', () => {
        windGroup.innerHTML = `
          <path d="M 40 160 Q 100 150 150 155" stroke="#38bdf8" stroke-width="2.5" fill="none" opacity="0.8" />
          <path d="M 70 140 Q 150 130 220 125" stroke="#38bdf8" stroke-width="2.5" fill="none" opacity="0.6" />
          <path d="M 120 115 Q 220 95 320 85" stroke="#38bdf8" stroke-width="2.5" fill="none" opacity="0.7" />
        `;
        dayBtn.style.borderColor = '#00f0ff';
        nightBtn.style.borderColor = 'rgba(0, 240, 255, 0.15)';
      });

      nightBtn.addEventListener('click', () => {
        windGroup.innerHTML = `
          <path d="M 320 85 Q 220 95 120 115" stroke="#f59e0b" stroke-width="2.5" fill="none" opacity="0.8" />
          <path d="M 220 125 Q 150 130 70 140" stroke="#f59e0b" stroke-width="2.5" fill="none" opacity="0.6" />
          <path d="M 150 155 Q 100 150 40 160" stroke="#f59e0b" stroke-width="2.5" fill="none" opacity="0.7" />
        `;
        nightBtn.style.borderColor = '#f59e0b';
        dayBtn.style.borderColor = 'rgba(0, 240, 255, 0.15)';
      });
    }
  }

  // 4. Auditor de Sensores en Slide 5
  function initSensorAuditor() {
    const btns = document.querySelectorAll('.sensor-toggle-btn');
    const SENSORS = {
      gy91: {
        badge: 'SENSÓRICA INTEGRADA // BUS I²C',
        title: 'Módulo GY-91 (Presión, Temp, Altitud, Acc XYZ)',
        type: 'Barómetro BMP280 + IMU Triaxial MPU9250 Integrados',
        vars: 'Presión atmosférica (hPa), Altitud (m), Aceleración XYZ (g) y Temperatura (°C)',
        freq: 'Bus I²C Fast Mode / Alta cadencia de muestreo',
        desc: 'Adquiere la curva rápida de descompresión vertical durante el ascenso dinámico (0 a 70 m), el perfil térmico y la aceleración triaxial.'
      },
      gps: {
        badge: 'GEOLOCALIZACIÓN // BUS UART',
        title: 'GPS NEO-M8N (Receptor GNSS)',
        type: 'Módulo GNSS Satelital de Alta Precisión',
        vars: 'Latitud, Longitud y coordenadas geográficas para rescate',
        freq: 'Puerto UART serie / Hasta 10 Hz de refresco',
        desc: 'Fija las coordenadas del punto de lanzamiento y registra la posición geográfica para la localización y rescate ágil de la sonda.'
      },
      microsd: {
        badge: 'ALMACENAMIENTO // BUS SPI',
        title: 'Módulo microSD (Registro Local de Respaldo)',
        type: 'Memoria No Volátil de Alta Velocidad (Black Box)',
        vars: 'Registro íntegro y redundante de todas las tramas de vuelo',
        freq: 'Bus SPI dedicado',
        desc: 'Garantiza el salvaguardo físico de todos los datos de vuelo a bordo, permitiendo la comparación post-vuelo con la telemetría recibida en tierra.'
      },
      lora: {
        badge: 'TELEMETRÍA // ENLACE RF 915 MHz',
        title: 'LoRa 915 MHz (Semtech SX1262 Integrado)',
        type: 'Transceptor de Radiofrecuencia de Largo Alcance',
        vars: 'Tramas de telemetría binaria en tiempo real hacia estación terrena',
        freq: '915 MHz (Banda ISM) / Enlace digital bidireccional',
        desc: 'Transmite continuamente los paquetes telemétricos hacia la estación terrena conformada por una segunda Heltec V3 y una laptop con dashboard.'
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.dataset.sensor;
        const data = SENSORS[key];
        if (data) {
          const badgeEl = document.getElementById('sensor-detail-badge');
          const titleEl = document.getElementById('sensor-title');
          const typeEl = document.getElementById('sensor-type');
          const varsEl = document.getElementById('sensor-vars');
          const freqEl = document.getElementById('sensor-freq');
          const descEl = document.getElementById('sensor-desc');

          if (badgeEl) badgeEl.textContent = data.badge;
          if (titleEl) titleEl.textContent = data.title;
          if (typeEl) typeEl.textContent = data.type;
          if (varsEl) varsEl.textContent = data.vars;
          if (freqEl) freqEl.textContent = data.freq;
          if (descEl) descEl.textContent = data.desc;
        }
      });
    });
  }

  // 5. Simulación de Secuencia de Apogeo en Slide 6 (5 Pasos)
  function initApogeeSequence() {
    const testBtn = document.getElementById('btn-test-apogee');
    const stepNodes = [
      document.getElementById('apogee-step-1'),
      document.getElementById('apogee-step-2'),
      document.getElementById('apogee-step-3'),
      document.getElementById('apogee-step-4'),
      document.getElementById('apogee-step-5')
    ];

    if (!testBtn) return;

    testBtn.addEventListener('click', () => {
      testBtn.disabled = true;
      testBtn.textContent = '⏳ Ejecutando Cadena...';

      // Reset de estilos
      stepNodes.forEach((node) => {
        if (node) {
          node.style.borderColor = 'var(--border-subtle)';
          node.style.background = 'rgba(10, 20, 40, 0.4)';
          node.style.boxShadow = 'none';
        }
      });

      // Secuencia escalonada paso a paso
      const delays = [300, 800, 1400, 2000, 2600];
      const colors = [
        'var(--accent-gold)',   // Step 1: Lockout
        'var(--accent-cyan)',   // Step 2: 0g
        'var(--accent-cyan)',   // Step 3: dP/dt
        'var(--accent-orange)', // Step 4: Servo
        'var(--accent-green)'   // Step 5: Paracaídas
      ];

      delays.forEach((delay, idx) => {
        setTimeout(() => {
          const node = stepNodes[idx];
          if (node) {
            node.style.borderColor = colors[idx];
            node.style.background = 'rgba(10, 25, 55, 0.85)';
            node.style.boxShadow = `0 0 15px ${colors[idx]}`;
          }
          if (idx === delays.length - 1) {
            testBtn.disabled = false;
            testBtn.textContent = '✓ SECUENCIA EXITOSA (Reiniciar)';
          }
        }, delay);
      });
    });
  }

  // 6. El Simulador de Misión HUD Completo (Slide 7)
  function initMissionSimulator() {
    const canvas = document.getElementById('telemetryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById('sim-time-slider');
    const clock = document.getElementById('sim-time-clock');
    const playBtn = document.getElementById('sim-play-btn');
    const rocketSprite = document.getElementById('sim-rocket-sprite');
    const chuteIcon = document.getElementById('sim-chute-icon');

    const hudAlt = document.getElementById('hud-alt-val');
    const hudAltBar = document.getElementById('hud-alt-bar');
    const hudPres = document.getElementById('hud-pres-val');
    const hudPresBar = document.getElementById('hud-pres-bar');
    const hudAcc = document.getElementById('hud-acc-val');
    const hudAccBar = document.getElementById('hud-acc-bar');

    let isPlaying = false;
    let simTime = 0.0;
    const maxSimTime = 24.0;
    const apogeeTime = 4.6;
    const maxAlt = 70.0;
    const p0 = 1013.25;

    let showAlt = true;
    let showPres = true;
    let showAcc = true;

    // Botones de filtro de series
    const btnAlt = document.getElementById('filter-alt');
    const btnPres = document.getElementById('filter-pres');
    const btnAcc = document.getElementById('filter-acc');

    if (btnAlt) {
      btnAlt.addEventListener('click', () => {
        showAlt = !showAlt;
        btnAlt.classList.toggle('active', showAlt);
        drawChart();
      });
    }
    if (btnPres) {
      btnPres.addEventListener('click', () => {
        showPres = !showPres;
        btnPres.classList.toggle('active', showPres);
        drawChart();
      });
    }
    if (btnAcc) {
      btnAcc.addEventListener('click', () => {
        showAcc = !showAcc;
        btnAcc.classList.toggle('active', showAcc);
        drawChart();
      });
    }

    // Curva física del vuelo
    function getFlightState(t) {
      let alt, pres, acc;
      if (t <= 0.4) {
        // Empuje violento del chorro de agua hidroneumático
        const prog = t / 0.4;
        acc = 1.0 + 8.5 * Math.sin(prog * Math.PI);
        alt = 0.5 * 9.8 * acc * t * t;
      } else if (t <= apogeeTime) {
        // Ascenso balístico hasta apogeo a 70 m
        const prog = (t - 0.4) / (apogeeTime - 0.4);
        alt = 14 + (maxAlt - 14) * Math.sin((prog * Math.PI) / 2);
        acc = -0.98 + (1 - prog) * 0.5;
      } else {
        // Descenso bajo paracaídas circular Ø75 cm (~5.2 m/s)
        const prog = (t - apogeeTime) / (maxSimTime - apogeeTime);
        alt = Math.max(0, maxAlt - prog * maxAlt);
        acc = -1.0 + (t < apogeeTime + 0.6 ? -1.8 : 0);
      }
      pres = p0 * Math.exp(-alt / 8400);
      return { alt, pres, acc };
    }

    function updateSimulationUI(t) {
      const state = getFlightState(t);
      if (clock) clock.textContent = `T+${t.toFixed(1)}s`;
      if (slider) slider.value = t;

      // Actualizar posición del cohete en pista vertical
      if (rocketSprite) {
        const bottomPct = 5 + (state.alt / maxAlt) * 82;
        rocketSprite.style.bottom = `${bottomPct}%`;
      }
      if (chuteIcon) {
        chuteIcon.style.opacity = t >= apogeeTime && state.alt > 2 ? '1' : '0';
      }

      // HUD Gauges
      if (hudAlt) hudAlt.textContent = `${state.alt.toFixed(1)} m`;
      if (hudAltBar) hudAltBar.style.width = `${(state.alt / maxAlt) * 100}%`;

      if (hudPres) hudPres.textContent = `${state.pres.toFixed(1)} hPa`;
      if (hudPresBar) hudPresBar.style.width = `${((1013.25 - state.pres) / 8) * 100}%`;

      if (hudAcc) hudAcc.textContent = `${state.acc >= 0 ? '+' : ''}${state.acc.toFixed(1)} g`;
      if (hudAccBar) {
        const accPct = Math.min(Math.max((state.acc + 2) / 12, 0), 1) * 100;
        hudAccBar.style.width = `${accPct}%`;
        hudAccBar.style.background = state.acc > 3 ? 'var(--accent-gold)' : 'var(--accent-cyan)';
      }

      drawChart();
    }

    function drawChart() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      const pL = 50;
      const pR = 30;
      const pT = 25;
      const pB = 35;
      const plotW = W - pL - pR;
      const plotH = H - pT - pB;

      // Ejes y líneas de tiempo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      for (let s = 0; s <= maxSimTime; s += 4) {
        const x = pL + (s / maxSimTime) * plotW;
        ctx.beginPath();
        ctx.moveTo(x, pT);
        ctx.lineTo(x, pT + plotH);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Plus Jakarta Sans"';
        ctx.textAlign = 'center';
        ctx.fillText(`${s}s`, x, pT + plotH + 16);
      }

      // Línea de referencia Apogeo
      const apogeeX = pL + (apogeeTime / maxSimTime) * plotW;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.beginPath();
      ctx.moveTo(apogeeX, pT);
      ctx.lineTo(apogeeX, pT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px "Outfit"';
      ctx.textAlign = 'center';
      ctx.fillText('APOGEO (70 m)', apogeeX, pT - 6);

      // Trazo de Curvas
      const step = 0.1;
      const points = [];
      for (let t = 0; t <= maxSimTime; t += step) {
        points.push({ t, ...getFlightState(t) });
      }

      const getX = (t) => pL + (t / maxSimTime) * plotW;

      // 1. Curva Altitud Z(t) - Cian
      if (showAlt) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((p, idx) => {
          const x = getX(p.t);
          const y = pT + plotH - (p.alt / maxAlt) * plotH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // 2. Curva Presión P(t) - Blanca
      if (showPres) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        points.forEach((p, idx) => {
          const x = getX(p.t);
          const pNorm = (p0 - p.pres) / (p0 - 1006);
          const y = pT + pNorm * plotH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // 3. Curva Aceleración aZ(t) - Dorada
      if (showAcc) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        points.forEach((p, idx) => {
          const x = getX(p.t);
          const aNorm = (p.acc - (-2)) / (10 - (-2));
          const y = pT + plotH - aNorm * plotH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Cursor vertical de tiempo actual
      const curX = getX(simTime);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curX, pT);
      ctx.lineTo(curX, pT + plotH);
      ctx.stroke();

      // Punto en la curva de altitud
      if (showAlt) {
        const curState = getFlightState(simTime);
        const curY = pT + plotH - (curState.alt / maxAlt) * plotH;
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(curX, curY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    window.drawTelemetryChart = drawChart;

    // Manejo de eventos del slider
    if (slider) {
      slider.addEventListener('input', (e) => {
        simTime = parseFloat(e.target.value);
        updateSimulationUI(simTime);
      });
    }

    // Play / Pause
    let animId = null;
    let lastStamp = null;

    function playLoop(timestamp) {
      if (!lastStamp) lastStamp = timestamp;
      const delta = (timestamp - lastStamp) / 1000;
      lastStamp = timestamp;

      simTime += delta;
      if (simTime > maxSimTime) {
        simTime = 0;
      }
      updateSimulationUI(simTime);

      if (isPlaying) {
        animId = requestAnimationFrame(playLoop);
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          playBtn.textContent = '⏸ PAUSAR VUELO';
          lastStamp = null;
          animId = requestAnimationFrame(playLoop);
        } else {
          playBtn.textContent = '▶ REPRODUCIR VUELO';
          if (animId) cancelAnimationFrame(animId);
        }
      });
    }

    // Render inicial
    updateSimulationUI(0);
  }

  // 7. Demo de Integración Post-Vuelo en Diapo 8 (Semántica Estricta)
  function initPostflightDemo() {
    const demoBtn = document.getElementById('btn-simulate-postflight');
    const titleEl = document.getElementById('s8-title');
    if (!demoBtn) return;

    let isPost = false;
    demoBtn.addEventListener('click', () => {
      isPost = !isPost;
      const criteriaCards = document.querySelectorAll('#slide-8 .criteria-card');

      if (isPost) {
        demoBtn.textContent = '↺ Mostrar Parámetros de Diseño';
        if (titleEl) {
          titleEl.innerHTML = 'CRITERIOS VERIFICADOS // <span class="highlight-cyan">ESTADO DE CUMPLIMIENTO</span>';
        }

        // Criterio 01: Masa y Talla
        if (criteriaCards[0]) {
          const val = criteriaCards[0].querySelector('.criteria-val');
          const st = criteriaCards[0].querySelector('.criteria-status-box');
          if (val) { val.textContent = '400 g'; val.style.color = 'var(--accent-green)'; }
          if (st) st.innerHTML = '<span class="status-badge valid">✓ CUMPLE</span>';
        }

        // Criterio 02: Estabilidad
        if (criteriaCards[1]) {
          const val = criteriaCards[1].querySelector('.criteria-val');
          const st = criteriaCards[1].querySelector('.criteria-status-box');
          if (val) { val.textContent = '1,17 Calibres'; val.style.color = 'var(--accent-green)'; }
          if (st) st.innerHTML = '<span class="status-badge valid">✓ CUMPLE</span>';
        }

        // Criterio 03: Telemetría LoRa
        if (criteriaCards[2]) {
          const val = criteriaCards[2].querySelector('.criteria-val');
          const st = criteriaCards[2].querySelector('.criteria-status-box');
          if (val) { val.textContent = '915 MHz'; val.style.color = 'var(--accent-green)'; }
          if (st) st.innerHTML = '<span class="status-badge valid">✓ CUMPLE</span>';
        }

        // Criterio 04: Recuperación
        if (criteriaCards[3]) {
          const val = criteriaCards[3].querySelector('.criteria-val');
          const st = criteriaCards[3].querySelector('.criteria-status-box');
          if (val) { val.textContent = '≈ 5,2 m/s'; val.style.color = 'var(--accent-green)'; }
          if (st) st.innerHTML = '<span class="status-badge valid">✓ CUMPLE</span>';
        }

        // Criterio 05: Instrumentación
        if (criteriaCards[4]) {
          const val = criteriaCards[4].querySelector('.criteria-val');
          const st = criteriaCards[4].querySelector('.criteria-status-box');
          if (val) { val.textContent = '6 Variables'; val.style.color = 'var(--accent-green)'; }
          if (st) st.innerHTML = '<span class="status-badge valid">✓ CUMPLE</span>';
        }
      } else {
        demoBtn.textContent = 'Alternar Indicadores Técnicos';
        if (titleEl) {
          titleEl.innerHTML = 'CRITERIOS DE <span class="highlight-gold">ACEPTACIÓN</span>';
        }

        if (criteriaCards[0]) {
          const val = criteriaCards[0].querySelector('.criteria-val');
          const st = criteriaCards[0].querySelector('.criteria-status-box');
          if (val) { val.textContent = '400 g'; val.style.color = 'var(--accent-cyan)'; }
          if (st) st.innerHTML = '<span class="status-badge measured">CUMPLE</span>';
        }
        if (criteriaCards[1]) {
          const val = criteriaCards[1].querySelector('.criteria-val');
          const st = criteriaCards[1].querySelector('.criteria-status-box');
          if (val) { val.textContent = '1,17 Calibres'; val.style.color = 'var(--accent-cyan)'; }
          if (st) st.innerHTML = '<span class="status-badge measured">CUMPLE</span>';
        }
        if (criteriaCards[2]) {
          const val = criteriaCards[2].querySelector('.criteria-val');
          const st = criteriaCards[2].querySelector('.criteria-status-box');
          if (val) { val.textContent = '915 MHz'; val.style.color = 'var(--accent-cyan)'; }
          if (st) st.innerHTML = '<span class="status-badge measured">CUMPLE</span>';
        }
        if (criteriaCards[3]) {
          const val = criteriaCards[3].querySelector('.criteria-val');
          const st = criteriaCards[3].querySelector('.criteria-status-box');
          if (val) { val.textContent = '≈ 5,2 m/s'; val.style.color = 'var(--accent-cyan)'; }
          if (st) st.innerHTML = '<span class="status-badge measured">CUMPLE</span>';
        }
        if (criteriaCards[4]) {
          const val = criteriaCards[4].querySelector('.criteria-val');
          const st = criteriaCards[4].querySelector('.criteria-status-box');
          if (val) { val.textContent = '6 Variables'; val.style.color = 'var(--accent-cyan)'; }
          if (st) st.innerHTML = '<span class="status-badge measured">CUMPLE</span>';
        }
      }
    });
  }

  // ── MODAL FULL-SCREEN PARA EL ESQUEMÁTICO REAL ─────────────────────
  function initSchematicModal() {
    const modal = document.getElementById('schematic-modal');
    const openBtn = document.getElementById('btn-open-schematic');
    const closeBtn = document.getElementById('btn-close-schematic');
    const backdrop = document.getElementById('schematic-modal-backdrop');

    if (!modal) return;

    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

})();
