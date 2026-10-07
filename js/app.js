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
    "«Buenos días, honorable jurado calificador. Soy Hugo Andrés Bustamante Palacio y, en representación de nuestro equipo de seis integrantes de la Rama Estudiantil IEEE y el Capítulo AESS de la Universidad del Magdalena, presentamos AESS-SAT y nuestra Misión BRISA. Concebimos una plataforma experimental de ingeniería capaz de medir, transmitir por LoRa 915 MHz y recuperar información útil en cada metro recorrido hasta 30,1 metros de apogeo previsto con una masa final de 335 gramos y presión máxima de hasta 70 PSI.»",
    // S2 (30s)
    "«Nuestra misión nace del territorio donde estudiamos ingeniería. Santa Marta presenta una singularidad geográfica mundial: la Sierra Nevada se eleva 5.700 metros a escasos 42 kilómetros del mar. Esta interacción genera brisas marinas y gradientes térmicos únicos. Desarrollamos AESS-SAT como una sonda atmosférica recuperable para caracterizar la columna vertical inferior de 0 a 30,1 metros, integrando telemetría continua y salvaguarda total del vehículo.»",
    // S3 (35s)
    "«Concebimos AESS-SAT bajo un enfoque modular de ingeniería en cinco componentes: ojiva parabólica roma 3D, sistema de recuperación con paracaídas circular de 75 cm y servomotor MG90S, computador Heltec WiFi LoRa 32 V3 con procesador ESP32-S3 y radio SX1262 integrado, cámara de propulsión con 2 botellas PET de 3 L en serie y empenaje de 3 aletas trapezoidales simétricas a 120°. Cumplimos con 335 g de masa final, 65 cm de altura y 12 cm de diámetro.»",
    // S4 (35s)
    "«En propulsión operamos mediante almacenamiento elástico de energía hidroneumática con 3 L de cámara, empleando un tercio de agua y dos tercios de aire presurizado hasta un máximo estricto de 70 PSI. En aerodinámica, garantizamos estabilidad pasiva con un Centro de Gravedad a 28 cm y Centro de Presión a 42 cm, obteniendo un margen estático de 1,17 calibres que se incrementa en vuelo conforme se expulsa el propelente con 3 aletas trapezoidales a 120°.»",
    // S5 (40s)
    "«El cerebro de la sonda es el computador Heltec WiFi LoRa 32 V3 con chip ESP32-S3. Gestiona la adquisición del módulo sensórico GY-91 por bus I2C y el receptor GPS NEO-M8N por UART, consolidando las seis variables oficiales: altitud, temperatura, presión atmosférica, aceleración triaxial, latitud y longitud. Los datos se transmiten por LoRa 915 MHz hacia la estación terrena, mientras una cámara ESP32-CAM a bordo graba el video del vuelo. Además, la estación terrena usa ESP-NOW para enviar datos tanto a la ESP32-CAM como a la Heltec, ampliando la telemetría con un segundo canal. En pantalla pueden observar el esquemático eléctrico real del sistema.»",
    // S6 (35s)
    "«Para asegurar la recuperación íntegra de la sonda, implementamos una lógica de decisión de apogeo en 5 etapas secuenciales: lockout inicial de 2 segundos para evitar aperturas prematuras durante el empuje, detección de microgravedad, confirmación por gradiente barométrico continuo, activación del servomotor MG90S al apogeo en 2,32 segundos, velocidad de despliegue de 4,52 m/s, paracaídas circular de 75 cm y una velocidad de llegada a tierra de 3,4 m/s.»",
    // S7 (35s)
    "«El perfil completo de vuelo dura 11,3 segundos. El vehículo alcanza una velocidad máxima de 37,4 m/s y el apogeo a 30,1 metros a los 2,32 segundos. Tras el despliegue del velamen a 4,52 m/s, desciende hasta tocar tierra a 3,4 m/s a los 11,3 segundos, manteniendo transmisión LoRa 915 MHz continua y el enlace ESP-NOW con nuestra estación terrena.»",
    // S8 (30s)
    "«Verificamos el cumplimiento riguroso de cinco criterios técnicos: masa final reglamentaria de 335 gramos con 65 cm de altura y 12 cm de diámetro; estabilidad pasiva con margen estático de 1,17 calibres y 3 aletas a 120°; enlace de telemetría LoRa 915 MHz continuo hacia estación terrena, complementado con ESP-NOW; recuperación con paracaídas de 75 cm, velocidad al despliegue de 4,52 m/s y llegada a tierra a 3,4 m/s; y adquisición de las 6 variables oficiales mediante GY-91 y GPS NEO-M8N, con video de vuelo capturado por ESP32-CAM.»",
    // S9 (25s)
    "«Consolidamos una plataforma experimental rigurosa y escalable. Tras el vuelo, analizaremos la telemetría en tiempo real y cruzaremos los paquetes transmitidos por LoRa 915 MHz con el video de vuelo grabado por la ESP32-CAM a bordo, evaluando el comportamiento estructural tras el aterrizaje e iterando la arquitectura para futuras misiones de mayor altitud desarrolladas desde la Universidad del Magdalena.»",
    // S10 (15s)
    "«Agradecemos sinceramente al comité de Hidrochallenge Colombia 2026 y a la Universidad del Magdalena. En nombre de nuestro equipo de 6 integrantes de la Rama Estudiantil IEEE y el Capítulo AESS, dejamos a disposición del honorable jurado calificador nuestra plataforma AESS-SAT para la sesión de preguntas técnicas. En la esquina inferior derecha pueden escanear el código QR hacia la documentación del proyecto con los datos y planos técnicos completos. Muchas gracias.»",
    // B1: Presupuesto de Masa
    "[RESPALDO B1 // MASA] «Jurado: el vehículo AESS-SAT registra una masa final nominal de 335 gramos frente al límite reglamentario de 400 gramos, con altura total de 65 cm y diámetro de 12 cm. La arquitectura integra 2 botellas PET de 3 L en serie y una única etapa hidroneumática, optimizando cada subsistema para asegurar solidez estructural y ligereza.»",
    // B2: Estabilidad CG / CP
    "[RESPALDO B2 // ESTABILIDAD] «Jurado: el margen estático se define analíticamente como (X_cp - X_cg) / D_ref. Con el Centro de Gravedad a 28 cm y el Centro de Presión a 42 cm medidos desde la ojiva, y un diámetro de referencia de 12 cm, obtenemos un margen de 1,17 calibres con 3 aletas trapezoidales simétricas a 120°, lo cual asegura estabilidad pasiva sin oscilaciones violentas.»",
    // B3: Paracaídas y Ecuación
    "[RESPALDO B3 // PARACAÍDAS] «Jurado: la dinámica de recuperación opera con un paracaídas circular de 75 cm de diámetro accionado por un servomotor metálico MG90S. El vehículo inicia el despliegue a una velocidad de 4,52 m/s y alcanza una velocidad de llegada a tierra de 3,4 m/s, disipando la energía cinética para un aterrizaje suave a los 11,3 segundos de tiempo total de vuelo con una masa final de 0,335 kg.»",
    // B4: Electrónica y Buses
    "[RESPALDO B4 // ELECTRÓNICA] «Jurado: en pantalla pueden observar la arquitectura completa con el esquemático eléctrico real y el dashboard de estación terrena desarrollado por el Capítulo AESS Unimagdalena. Presenta la regulación de energía desde batería LiPo, el computador Heltec WiFi LoRa 32 V3 con chip ESP32-S3 y transceptor SX1262 a 915 MHz, el módulo sensórico GY-91 por bus I2C, el receptor GPS NEO-M8N por UART, la cámara ESP32-CAM para video de vuelo, el enlace ESP-NOW con la estación terrena y el accionamiento del servomotor MG90S por canal PWM.»",
    // B5: Telemetría LoRa
    "[RESPALDO B5 // LORA] «Jurado: el ciclo de vida del dato comprende la adquisición de 6 variables con GY-91 y GPS NEO-M8N en el perfil vertical de 0 a 30,1 metros, el procesamiento central en la Heltec V3, la transmisión por radioenlace LoRa 915 MHz hacia la segunda Heltec de la estación terrena conectada a laptop. La estación terrena además envía datos por ESP-NOW a la ESP32-CAM y a la Heltec de a bordo, ampliando la telemetría, complementada con el video de vuelo de la ESP32-CAM.»",
    // B6: Calibración e Incertidumbre
    "[RESPALDO B6 // CALIBRACIÓN] «Jurado: la suite instrumental registra 6 variables oficiales en el rango operativo de 0 a 30,1 metros: altitud barométrica, presión atmosférica, aceleración triaxial XYZ y temperatura a través del módulo GY-91 en bus I2C, complementadas por latitud y longitud geodésicas suministradas por el receptor GNSS GPS NEO-M8N por puerto serie.»",
    // B7: Requisitos Hidrochallenge
    "[RESPALDO B7 // REQUISITOS] «Jurado: AESS-SAT satisface la totalidad de los requisitos oficiales de Hidrochallenge 2026: cohete de 1 etapa, cámara con 2 botellas PET de 3 L en serie, presión de operación menor o igual a 70 PSI, masa final de 335 g bajo el límite de 400 g, diámetro de 12 cm, empenaje de 3 aletas trapezoidales a 120°, paracaídas circular de 75 cm con velocidad de llegada de 3,4 m/s y 6 variables oficiales transmitidas por LoRa 915 MHz.»"
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

    // Gestos táctiles (solo deslizamiento horizontal; el vertical es scroll en móvil)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchIgnored = false;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      touchIgnored = !!e.target.closest('input, canvas, .notes-drawer, .schematic-modal, .dashboard-modal');
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (touchIgnored) return;
      const diff = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diff) > 50 && Math.abs(diff) > Math.abs(diffY) * 1.5) {
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
        s.scrollTop = 0;
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
          const modalSchem = document.getElementById('schematic-modal');
          if (modalSchem && !modalSchem.classList.contains('hidden')) {
            modalSchem.classList.add('hidden');
            return;
          }
          const modalDash = document.getElementById('dashboard-modal');
          if (modalDash && !modalDash.classList.contains('hidden')) {
            modalDash.classList.add('hidden');
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
        desc: 'Computador de vuelo con procesador ESP32-S3 y transceptor SX1262 integrado a 915 MHz. Módulo sensórico GY-91, GPS NEO-M8N y cámara ESP32-CAM para video de vuelo.',
        spec1: 'Heltec V3 (ESP32-S3 + SX1262)',
        spec2: 'GY-91 + GPS NEO-M8N + ESP32-CAM'
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
      esp32cam: {
        badge: 'VIDEO DE VUELO // CÁMARA OV2640',
        title: 'ESP32-CAM (Cámara a Bordo)',
        type: 'Módulo ESP32 con Sensor de Imagen OV2640 Integrado',
        vars: 'Video del vuelo completo: ascenso, apogeo, despliegue y descenso',
        freq: 'Cámara OV2640 / Grabación autónoma a bordo',
        desc: 'Captura video del vuelo desde el vehículo, permitiendo verificar visualmente el ascenso, el despliegue del paracaídas y el aterrizaje, y contrastarlo post-vuelo con la telemetría recibida en tierra.'
      },
      lora: {
        badge: 'TELEMETRÍA // ENLACE RF 915 MHz',
        title: 'LoRa 915 MHz (Semtech SX1262 Integrado)',
        type: 'Transceptor de Radiofrecuencia de Largo Alcance',
        vars: 'Tramas de telemetría binaria en tiempo real hacia estación terrena',
        freq: '915 MHz (Banda ISM) / Enlace digital bidireccional',
        desc: 'Transmite continuamente los paquetes telemétricos hacia la estación terrena conformada por una segunda Heltec V3 y una laptop con dashboard.'
      },
      espnow: {
        badge: 'TELEMETRÍA AMPLIADA // ESP-NOW 2,4 GHz',
        title: 'ESP-NOW (Estación Terrena ↔ ESP32-CAM + Heltec)',
        type: 'Protocolo Inalámbrico Punto a Punto de Espressif',
        vars: 'Datos enviados desde la estación terrena hacia la ESP32-CAM y la Heltec de a bordo',
        freq: '2,4 GHz / Enlace directo sin router WiFi',
        desc: 'Complementa el enlace LoRa 915 MHz: la estación terrena envía datos por ESP-NOW tanto a la ESP32-CAM como a la Heltec, ampliando la telemetría con un segundo canal de comunicación.'
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
    const maxSimTime = 11.3;
    const apogeeTime = 2.32;
    const maxAlt = 30.1;
    const p0 = 1013.25;

    let showAlt = true;
    let showVel = true;
    let showAcc = true;

    // Botones de filtro de series
    const btnAlt = document.getElementById('filter-alt');
    const btnVel = document.getElementById('filter-vel') || document.getElementById('filter-pres');
    const btnAcc = document.getElementById('filter-acc');

    if (btnAlt) {
      btnAlt.addEventListener('click', () => {
        showAlt = !showAlt;
        btnAlt.classList.toggle('active', showAlt);
        drawChart();
      });
    }
    if (btnVel) {
      btnVel.addEventListener('click', () => {
        showVel = !showVel;
        btnVel.classList.toggle('active', showVel);
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

    // Constantes analíticas para dinámica de impulso y descenso orgánico bajo paracaídas
    const tau_boost_p = 0.14 / 0.30;
    const a_boost = 1.6;
    const b_boost = a_boost * (1.0 - tau_boost_p) / tau_boost_p; // 1.82857

    const k_chute = 0.75;
    const tau_chute_max = maxSimTime - 2.45; // 8.85 s
    const int_1_chute = (1 - Math.exp(-k_chute * tau_chute_max)) / k_chute;
    const int_t_chute = (1 - Math.exp(-k_chute * tau_chute_max) * (1 + k_chute * tau_chute_max)) / (k_chute * k_chute);
    const I_base_chute = int_1_chute - int_t_chute / tau_chute_max;
    const I_c_chute = tau_chute_max / 6.0;
    const c_chute = (3.40 * tau_chute_max + 1.12 * I_base_chute - 29.806) / I_c_chute;

    // Curva física del vuelo (OpenRocket / Dinámica Aerotécnica Misión BRISA)
    function getFlightState(t) {
      let alt, vel, acc;
      if (t <= 0) {
        alt = 0.0;
        vel = 0.0;
        acc = 0.0;
      } else if (t <= 0.10) {
        // Fase 1: Guía de lanzamiento (0 - 0.10 s). Salida de guía a 25.8 m/s
        const tau = t / 0.10;
        vel = 25.8 * Math.pow(tau, 1.35);
        alt = (25.8 * 0.10 * Math.pow(tau, 2.35)) / 2.35;
        // Aceleración continua analytic pulse peaking exactly at 0.14s (550.0 m/s²)
        acc = 550.0 * Math.pow(t / 0.14, a_boost) * Math.pow((0.30 - t) / 0.16, b_boost);
      } else if (t <= 0.30) {
        // Fase 2: Empuje hidroneumático con pico exacto en t = 0.14s (550.0 m/s²) y Vmax = 37.4 m/s a 0.30s
        const tau = (t - 0.10) / 0.20;
        vel = 25.8 + (37.4 - 25.8) * (1.5 * tau - 0.5 * Math.pow(tau, 3));
        alt = 1.10 + 25.8 * (t - 0.10) + (37.4 - 25.8) * 0.20 * (0.75 * Math.pow(tau, 2) - 0.125 * Math.pow(tau, 4));
        acc = 550.0 * Math.pow(t / 0.14, a_boost) * Math.pow((0.30 - t) / 0.16, b_boost);
      } else if (t <= apogeeTime) {
        // Fase 3: Ascenso inercial balístico hasta apogeo (2.32 s, Z = 30.1 m, Vz = 0.0 m/s exacto)
        const tau = (t - 0.30) / (apogeeTime - 0.30);
        const p = 2.1944;
        vel = 37.4 * Math.pow(1 - tau, p);
        alt = 6.45 + (maxAlt - 6.45) * (1 - Math.pow(1 - tau, p + 1));
        const acc_drag = -(37.4 * p / (apogeeTime - 0.30)) * Math.pow(1 - tau, Math.max(0, p - 1));
        acc = acc_drag - 9.8;
      } else if (t <= 2.45) {
        // Fase 4: Caída libre pre-despliegue (2.32 - 2.45 s), Vz alcanza -4.52 m/s
        const tau = (t - apogeeTime) / (2.45 - apogeeTime);
        vel = -4.52 * tau;
        alt = maxAlt - 0.5 * 4.52 * (2.45 - apogeeTime) * Math.pow(tau, 2);
        acc = -4.52 / (2.45 - apogeeTime);
      } else if (t <= maxSimTime) {
        // Fase 5: Descenso controlado con evolución orgánica (sin línea plana artificial)
        const tau = t - 2.45;
        const s = tau / tau_chute_max;
        vel = -3.40 - 1.12 * (1 - s) * Math.exp(-k_chute * tau) + c_chute * s * (1 - s);
        const int_1_t = (1 - Math.exp(-k_chute * tau)) / k_chute;
        const int_t_t = (1 - Math.exp(-k_chute * tau) * (1 + k_chute * tau)) / (k_chute * k_chute);
        const I_base_t = int_1_t - int_t_t / tau_chute_max;
        const I_c_t = tau * (s / 2.0 - (s * s) / 3.0);
        const delta_z = 3.40 * tau + 1.12 * I_base_t - c_chute * I_c_t;
        alt = Math.max(0.0, 29.806 - delta_z);
        const acc_base = 1.12 * Math.exp(-k_chute * tau) * (k_chute * (1 - s) + 1.0 / tau_chute_max);
        const acc_c = c_chute * (1.0 - 2.0 * s) / tau_chute_max;
        const shock = 14.0 * Math.sin(Math.min(1.0, tau / 0.35) * Math.PI) * Math.exp(-2.5 * tau);
        acc = acc_base + acc_c + shock;
      } else {
        // En tierra
        vel = 0.0;
        alt = 0.0;
        acc = 0.0;
      }

      const accG = acc / 9.80665;
      const pres = p0 * Math.exp(-alt / 8400);
      return { alt, vel, acc, accG, pres };
    }

    function updateSimulationUI(t) {
      const state = getFlightState(t);
      if (clock) clock.textContent = `T+${t.toFixed(1)}s`;
      if (slider) slider.value = t;

      // Actualizar posición del cohete en pista vertical (respetando separación con PERFIL VERTICAL)
      if (rocketSprite) {
        const bottomPct = 11 + (state.alt / maxAlt) * 76;
        rocketSprite.style.bottom = `${bottomPct}%`;
      }
      const ascentSprite = document.getElementById('sim-rocket-ascent');
      const descentSprite = document.getElementById('sim-rocket-descent');
      if (ascentSprite && descentSprite) {
        if (t <= apogeeTime) {
          ascentSprite.style.display = 'block';
          descentSprite.style.display = 'none';
        } else {
          ascentSprite.style.display = 'none';
          descentSprite.style.display = 'block';
        }
      }

      // HUD Gauges laterales (Mantener instrumentación de sensores)
      if (hudAlt) hudAlt.textContent = `${state.alt.toFixed(1)} m`;
      if (hudAltBar) hudAltBar.style.width = `${Math.min(100, Math.max(0, (state.alt / maxAlt) * 100))}%`;

      if (hudPres) hudPres.textContent = `${state.pres.toFixed(1)} hPa`;
      if (hudPresBar) hudPresBar.style.width = `${Math.min(100, Math.max(0, ((p0 - state.pres) / 8) * 100))}%`;

      if (hudAcc) hudAcc.textContent = `${state.accG >= 0 ? '+' : ''}${state.accG.toFixed(1)} g`;
      if (hudAccBar) {
        const accPct = Math.min(Math.max((state.accG + 2) / 12, 0), 1) * 100;
        hudAccBar.style.width = `${accPct}%`;
        hudAccBar.style.background = state.accG > 3 ? 'var(--accent-gold)' : 'var(--accent-cyan)';
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

      // Márgenes del área de gráfico
      const pL = 48; // Eje izquierdo: Altitud (m) / Velocidad (m/s) [-10 .. 42]
      const pR = 46; // Eje derecho: Aceleración aZ (m/s²) [-50 .. 650]
      const pT = 38; // Margen superior para banda de eventos y títulos de ejes
      const pB = 28; // Margen inferior para marcas de tiempo
      const plotW = Math.max(10, W - pL - pR);
      const plotH = Math.max(10, H - pT - pB);

      // Dominio visual extendido en X para dar aire al inicio y al final
      const tMinVisual = -0.35; // Espacio para que el despegue no nazca pegado al eje
      const tMaxVisual = 11.65; // Espacio para que el aterrizaje respire antes del borde
      const mapX = (t) => pL + ((Math.max(tMinVisual, Math.min(t, tMaxVisual)) - tMinVisual) / (tMaxVisual - tMinVisual)) * plotW;
      const mapYLeft = (val) => pT + plotH - ((val - (-10)) / 52) * plotH;
      const mapYRight = (val) => pT + plotH - ((val - (-50)) / 700) * plotH;

      // 1. Fases del Vuelo en Fondo (Lectura narrativa sobria con contraste calibrado y elevación)
      ctx.save();
      ctx.beginPath();
      ctx.rect(pL, pT, plotW, plotH);
      ctx.clip();

      const x0 = mapX(0.00);
      const x1 = mapX(0.30);
      const x2 = mapX(2.45);
      const x3 = mapX(maxSimTime);

      // Banda Fase 1: Impulso (0 - 0.30s)
      ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.fillRect(x0, pT, Math.max(0, x1 - x0), plotH);

      // Banda Fase 2: Vuelo Balístico (0.30 - 2.45s)
      ctx.fillStyle = 'rgba(0, 240, 255, 0.025)';
      ctx.fillRect(x1, pT, Math.max(0, x2 - x1), plotH);

      // Banda Fase 3: Descenso Controlado (2.45 - 11.30s)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.02)';
      ctx.fillRect(x2, pT, Math.max(0, x3 - x2), plotH);

      // Rótulos sutiles de fase elevados 12px del borde inferior para óptima respiración
      const yFases = pT + plotH - 14;
      ctx.font = 'bold 7.5px "Outfit", sans-serif';

      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.textAlign = 'center';
      ctx.fillText('IMPULSO', (x0 + x1) / 2, yFases);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.fillText('VUELO BALÍSTICO', (x1 + x2) / 2, yFases);

      ctx.fillStyle = 'rgba(52, 211, 153, 0.75)';
      ctx.fillText('DESCENSO CONTROLADO (PARACAÍDAS Ø75 cm)', (x2 + x3) / 2, yFases);

      ctx.restore();

      // 2. Rejilla y Marcas del Eje Izquierdo (Altitud & Velocidad)
      const leftTicks = [-10, 0, 10, 20, 30, 40];
      leftTicks.forEach((val) => {
        const y = mapYLeft(val);
        ctx.strokeStyle = val === 0 ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = val === 0 ? 1.2 : 1;
        if (val === 0) ctx.setLineDash([3, 3]);
        else ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pL, y);
        ctx.lineTo(pL + plotW, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = val === 0 ? '#e2e8f0' : '#64748b';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(val + '', pL - 5, y + 3);
      });

      // Título de Eje Izquierdo (Claro y Técnico)
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ALTITUD (m) · VELOCIDAD VERTICAL (m/s)', pL, pT - 23);

      // 3. Marcas del Eje Derecho (Aceleración aZ en m/s²)
      const rightTicks = [0, 200, 400, 600];
      rightTicks.forEach((val) => {
        const y = mapYRight(val);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pL + plotW, y);
        ctx.lineTo(pL + plotW + 4, y);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(val + '', pL + plotW + 7, y + 3);
      });

      // Título de Eje Derecho (Claro y Técnico)
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('ACELERACIÓN VERTICAL (m/s²)', pL + plotW, pT - 23);

      // 4. Rejilla y Marcas del Eje X (Tiempo en segundos)
      const timeTicks = [0, 2, 4, 6, 8, 10, 11.3];
      timeTicks.forEach((s) => {
        const x = mapX(s);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, pT);
        ctx.lineTo(x, pT + plotH);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '9px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s === 11.3 ? '11.3s' : `${s}s`, x, pT + plotH + 14);
      });

      // 5. Banda Visual Superior de Eventos (Jerarquía Reorganizada y Separada)
      // Evento A: Salida de guía (0.10s)
      const xRail = mapX(0.10);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xRail, pT - 4);
      ctx.lineTo(xRail, pT + plotH);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 7.5px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SALIDA DE GUÍA', xRail, pT - 9);

      // Evento B: Apogeo (2.32s, 30.1m) - Protagonista superior
      const xApogee = mapX(apogeeTime);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(xApogee, pT - 4);
      ctx.lineTo(xApogee, pT + plotH);
      ctx.stroke();
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 8.5px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('APOGEO · 30.1 m', xApogee, pT - 9);

      // Evento C: Despliegue de paracaídas (2.45s) - Bajado 16px y desplazado a la derecha para amplio aire
      const xDeploy = mapX(2.45);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xDeploy, pT + 6);
      ctx.lineTo(xDeploy, pT + plotH);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 7.5px "Outfit", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DESPLIEGUE', xDeploy + 8, pT + 22);

      // Evento D: Contacto con tierra (11.3s) - Desplazado a la izquierda con margen respirable
      const xLand = mapX(maxSimTime);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xLand, pT - 4);
      ctx.lineTo(xLand, pT + plotH);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 7.5px "Outfit", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('CONTACTO · 11.3s', xLand - 6, pT - 9);
      ctx.setLineDash([]);

      // 6. Muestreo y Trazo de Curvas (CON RECORTE ESTRICTO Y JERARQUÍA)
      const sampleStep = 0.02;
      const pts = [];
      for (let t = 0.0; t <= maxSimTime + 0.001; t += sampleStep) {
        pts.push({ t, ...getFlightState(t) });
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(pL, pT, plotW, plotH);
      ctx.clip();

      // Curva 1: Altitud Z(t) - Protagonista (2.9 px, Cian)
      if (showAlt) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.9;
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const x = mapX(p.t);
          const y = mapYLeft(p.alt);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Curva 2: Velocidad Vz(t) - Secundaria Fuerte (2.3 px, Blanco brillante)
      if (showVel) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const x = mapX(p.t);
          const y = mapYLeft(p.vel);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Curva 3: Aceleración aZ(t) - Secundaria Técnica (1.9 px, Dorado)
      if (showAcc) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const x = mapX(p.t);
          const y = mapYRight(p.acc);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Marcador elegante exactamente anclado al vértice real de la curva amarilla (t = 0.14s, 550 m/s²)
        const tPeakA = 0.14;
        const xPeakA = mapX(tPeakA);
        const yPeakA = mapYRight(550.0);

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(xPeakA, yPeakA, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Etiqueta desplazada ligeramente a la derecha y abajo para no competir con SALIDA DE GUÍA
        ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'left';
        ctx.fillText('AMAX · 550 m/s²', xPeakA + 7, yPeakA + 8);
      }

      ctx.restore();

      // 7. Cursor de Tiempo Interactivo
      const curX = mapX(simTime);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(curX, pT);
      ctx.lineTo(curX, pT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      const curState = getFlightState(simTime);

      // Puntos destacados sobre las curvas activas
      if (showAlt && simTime <= maxSimTime) {
        const yAlt = mapYLeft(curState.alt);
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(curX, yAlt, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (showVel && simTime <= maxSimTime) {
        const yVel = mapYLeft(curState.vel);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curX, yVel, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (showAcc && simTime <= maxSimTime) {
        const yAcc = mapYRight(curState.acc);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(curX, yAcc, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Banner de Telemetría Instantánea (Peso visual refinado y discreto)
      const bannerW = 192;
      const bannerH = 15;
      const bannerX = pL + plotW - bannerW - 14;
      const bannerY = pT + 5;
      ctx.fillStyle = 'rgba(8, 14, 26, 0.65)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
      ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

      ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`T+${simTime.toFixed(1)}s`, bannerX + 5, bannerY + 11);

      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`Z:${curState.alt.toFixed(1)}m`, bannerX + 44, bannerY + 11);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Vz:${curState.vel.toFixed(1)}m/s`, bannerX + 88, bannerY + 11);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`aZ:${curState.acc.toFixed(0)}m/s²`, bannerX + 140, bannerY + 11);
    }

    window.drawTelemetryChart = drawChart;

    // Redibujar automáticamente en redimensionamiento de ventana o pantalla completa
    window.addEventListener('resize', () => {
      if (window.drawTelemetryChart) window.drawTelemetryChart();
    });
    document.addEventListener('fullscreenchange', () => {
      if (window.drawTelemetryChart) setTimeout(window.drawTelemetryChart, 150);
    });

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

    // Render inicial (admite parametro t en URL para pruebas o enlaces directos)
    const urlParams = new URLSearchParams(window.location.search);
    const initialT = parseFloat(urlParams.get('t'));
    if (!isNaN(initialT) && initialT >= 0 && initialT <= maxSimTime) {
      simTime = initialT;
    }
    updateSimulationUI(simTime);
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
          if (val) { val.textContent = '335 g'; val.style.color = 'var(--accent-green)'; }
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
          if (val) { val.textContent = '3,4 m/s'; val.style.color = 'var(--accent-green)'; }
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
          if (val) { val.textContent = '335 g'; val.style.color = 'var(--accent-cyan)'; }
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
          if (val) { val.textContent = '3,4 m/s'; val.style.color = 'var(--accent-cyan)'; }
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

  // ── MODALES FULL-SCREEN PARA EL ESQUEMÁTICO REAL Y DASHBOARD ──────
  function initSchematicModal() {
    // 1. Modal del Esquemático
    const schemModal = document.getElementById('schematic-modal');
    const openSchemBtns = [
      document.getElementById('btn-open-schematic'),
      document.getElementById('card-schematic-b4'),
      document.getElementById('btn-expand-schematic-b4')
    ];
    const closeSchemBtn = document.getElementById('btn-close-schematic');
    const schemBackdrop = document.getElementById('schematic-modal-backdrop');

    if (schemModal) {
      const openSchem = (e) => {
        if (e) e.stopPropagation();
        schemModal.classList.remove('hidden');
      };
      const closeSchem = (e) => {
        if (e) e.stopPropagation();
        schemModal.classList.add('hidden');
      };

      openSchemBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openSchem);
      });
      if (closeSchemBtn) closeSchemBtn.addEventListener('click', closeSchem);
      if (schemBackdrop) schemBackdrop.addEventListener('click', closeSchem);
    }

    // 2. Modal del Dashboard Telemétrico
    const dashModal = document.getElementById('dashboard-modal');
    const openDashBtns = [
      document.getElementById('btn-open-dashboard'),
      document.getElementById('card-dashboard-b4'),
      document.getElementById('btn-expand-dashboard-b4')
    ];
    const closeDashBtn = document.getElementById('btn-close-dashboard');
    const dashBackdrop = document.getElementById('dashboard-modal-backdrop');

    if (dashModal) {
      const openDash = (e) => {
        if (e) e.stopPropagation();
        dashModal.classList.remove('hidden');
      };
      const closeDash = (e) => {
        if (e) e.stopPropagation();
        dashModal.classList.add('hidden');
      };

      openDashBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openDash);
      });
      if (closeDashBtn) closeDashBtn.addEventListener('click', closeDash);
      if (dashBackdrop) dashBackdrop.addEventListener('click', closeDash);
    }
  }

})();
