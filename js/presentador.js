/* ════════════════════════════════════════════════════════════════════
   AESS-SAT · CONTROLADOR DE LA VISTA DEL EXPOSITOR (HUGO BUSTAMANTE)
   Sustentación Oral Hidrochallenge Colombia 2026 (300 Segundos)
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const MAIN_SLIDE_COUNT = 10;
  const TOTAL_SLIDES = 17;

  const SLIDE_DURATIONS = [
    20, 30, 35, 35, 40, 35, 35, 30, 25, 15, // Diapositivas 1 a 10 (Total: 300 segundos exactos)
    60, 60, 60, 60, 60, 60, 60              // Respaldos B1 a B7 (Flexibles en Q&A)
  ];

  const SLIDE_TITLES = [
    "01. AESS-SAT · MISIÓN BRISA",
    "02. DEL TERRITORIO A LA MISIÓN",
    "03. ARQUITECTURA AESS-SAT",
    "04. FÍSICA DE PROPULSIÓN & ESTABILIDAD",
    "05. COMPUTADOR DE VUELO & TELEMETRÍA",
    "06. SALVAGUARDA & ALGORITMO DE APOGEO",
    "07. DE UN VUELO A UN PERFIL (SIMULADOR)",
    "08. CRITERIOS DE ACEPTACIÓN",
    "09. GESTIÓN DE RIESGOS & HOJA DE RUTA",
    "10. ¡MUCHAS GRACIAS! (SESIÓN DE PREGUNTAS)",
    "B1. Presupuesto Detallado de Masa",
    "B2. Estabilidad Aerodinámica (CG, CP, Calibres)",
    "B3. Recuperación & Ecuación Terminal Descenso",
    "B4. Arquitectura Electrónica & Asignación Buses",
    "B5. Protocolo LoRa & Estructura Paquete Binario",
    "B6. Calibración e Incertidumbre Instrumental",
    "B7. Matriz de Cumplimiento Hidrochallenge 2026"
  ];

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

  let currentSlide = 1;
  let timerSeconds = 0;
  let slideSeconds = 0;

  const syncChannel = ('BroadcastChannel' in window) 
    ? new BroadcastChannel('aess_sat_telemetry') 
    : null;

  document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    bindControls();
    updateUI();

    if (syncChannel) {
      syncChannel.postMessage({ type: 'REQUEST_STATE' });
      syncChannel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'SLIDE_CHANGE') {
          currentSlide = msg.slide;
          timerSeconds = msg.elapsed;
          slideSeconds = msg.slideElapsed;
          updateUI();
        } else if (msg.type === 'TIMER_TICK') {
          timerSeconds = msg.elapsed;
          slideSeconds = msg.slideElapsed;
          currentSlide = msg.slide;
          updateClocks();
        } else if (msg.type === 'STATE_RESPONSE') {
          currentSlide = msg.slide;
          timerSeconds = msg.elapsed;
          slideSeconds = msg.slideElapsed;
          updateUI();
        }
      };
    }
  });

  function buildSidebar() {
    const list = document.getElementById('pres-slide-list');
    if (!list) return;

    list.innerHTML = '';

    // 1. Sección Diapositivas Oficiales (1 a 10)
    const titleOfficial = document.createElement('div');
    titleOfficial.className = 'sidebar-section-title';
    titleOfficial.textContent = 'DIAPOSITIVAS OFICIALES (300 SEGUNDOS)';
    list.appendChild(titleOfficial);

    for (let i = 1; i <= MAIN_SLIDE_COUNT; i++) {
      const btn = document.createElement('button');
      btn.className = `slide-jump-btn ${i === currentSlide ? 'active' : ''}`;
      btn.innerHTML = `
        <span><strong>${String(i).padStart(2, '0')}.</strong> ${SLIDE_TITLES[i - 1].replace(/^\d+\.\s*/, '')}</span>
        <span style="font-size: 0.75rem; color: var(--accent-gold); font-family: var(--font-mono);">${SLIDE_DURATIONS[i - 1]}s</span>
      `;
      btn.addEventListener('click', () => goToSlide(i));
      list.appendChild(btn);
    }

    // 2. Sección Anexos Técnicos de Respaldo (B1 a B7)
    const titleBackup = document.createElement('div');
    titleBackup.className = 'sidebar-section-title';
    titleBackup.style.color = 'var(--accent-gold)';
    titleBackup.textContent = 'ANEXOS TÉCNICOS // PREGUNTAS DEL JURADO';
    list.appendChild(titleBackup);

    for (let i = MAIN_SLIDE_COUNT + 1; i <= TOTAL_SLIDES; i++) {
      const btn = document.createElement('button');
      btn.className = `slide-jump-btn backup-btn ${i === currentSlide ? 'active' : ''}`;
      btn.innerHTML = `
        <span><strong>B${i - MAIN_SLIDE_COUNT}.</strong> ${SLIDE_TITLES[i - 1].replace(/^B\d+\.\s*/, '')}</span>
        <span style="font-size: 0.72rem; color: var(--accent-cyan); font-family: var(--font-mono);">Q&amp;A</span>
      `;
      btn.addEventListener('click', () => goToSlide(i));
      list.appendChild(btn);
    }
  }

  function bindControls() {
    const prev = document.getElementById('pres-prev-btn');
    const next = document.getElementById('pres-next-btn');
    const reset = document.getElementById('pres-reset-timer');

    if (prev) prev.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (next) next.addEventListener('click', () => goToSlide(currentSlide + 1));
    if (reset) {
      reset.addEventListener('click', () => {
        timerSeconds = 0;
        slideSeconds = 0;
        if (syncChannel) syncChannel.postMessage({ type: 'RESET_TIMER' });
        updateClocks();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        if (currentSlide <= MAIN_SLIDE_COUNT) {
          goToSlide(11);
        } else if (currentSlide < TOTAL_SLIDES) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(11);
        }
      } else if (e.key === 'Escape') {
        if (currentSlide > MAIN_SLIDE_COUNT) {
          goToSlide(MAIN_SLIDE_COUNT);
        }
      } else if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        if (num <= MAIN_SLIDE_COUNT) goToSlide(num);
      } else if (e.key === '0') {
        goToSlide(10);
      }
    });
  }

  function goToSlide(idx) {
    if (idx < 1 || idx > TOTAL_SLIDES) return;
    currentSlide = idx;
    slideSeconds = 0;
    if (syncChannel) {
      syncChannel.postMessage({ type: 'GOTO_SLIDE', slide: currentSlide });
    }
    updateUI();
  }

  function updateUI() {
    const badge = document.getElementById('pres-slide-badge');
    const title = document.getElementById('pres-slide-title');
    const script = document.getElementById('pres-script-text');
    const budget = document.getElementById('pres-slide-budget');
    const hint = document.getElementById('pres-transition-hint');

    if (currentSlide <= MAIN_SLIDE_COUNT) {
      if (badge) {
        badge.className = 'status-badge goal';
        badge.textContent = `DIAPOSITIVA ${String(currentSlide).padStart(2, '0')} / ${String(MAIN_SLIDE_COUNT).padStart(2, '0')}`;
      }
      if (title) title.textContent = SLIDE_TITLES[currentSlide - 1];
      if (script) script.textContent = SPEAKER_SCRIPTS[currentSlide - 1];
      if (budget) budget.textContent = `/ ${SLIDE_DURATIONS[currentSlide - 1]}s`;
      if (hint) {
        if (currentSlide < MAIN_SLIDE_COUNT) {
          hint.textContent = `Siguiente: ${SLIDE_TITLES[currentSlide]} →`;
        } else {
          hint.textContent = `¡Fin de la exposición! Presiona [B] para anexos de preguntas.`;
        }
      }
    } else {
      const backupIdx = currentSlide - MAIN_SLIDE_COUNT;
      if (badge) {
        badge.className = 'status-badge gold';
        badge.textContent = `ANEXO TÉCNICO B${backupIdx} // RESPALDO Q&A`;
      }
      if (title) title.textContent = SLIDE_TITLES[currentSlide - 1];
      if (script) script.textContent = SPEAKER_SCRIPTS[currentSlide - 1];
      if (budget) budget.textContent = `/ flexible`;
      if (hint) {
        hint.textContent = `[Esc] Regresar a Diapositiva 10 | [B] Siguiente Respaldo`;
      }
    }

    // Actualizar clase activa en la barra lateral
    document.querySelectorAll('.slide-jump-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx + 1 === currentSlide);
    });

    updateClocks();
  }

  function updateClocks() {
    const totalEl = document.getElementById('pres-total-time');
    const slideEl = document.getElementById('pres-slide-time');
    const stageBadge = document.getElementById('pres-stage-badge');

    if (totalEl) {
      const min = Math.floor(timerSeconds / 60);
      const sec = timerSeconds % 60;
      totalEl.textContent = `${min}:${String(sec).padStart(2, '0')}`;

      // Etapas del cronómetro maestro (300 segundos = 5:00)
      if (timerSeconds > 300) {
        totalEl.style.color = 'var(--accent-red)';
        if (stageBadge) {
          stageBadge.className = 'stage-status-badge overtime';
          stageBadge.textContent = '⚠ TIEMPO EXCEDIDO (> 5:00)';
        }
      } else if (timerSeconds >= 270) {
        // 4:30 a 5:00
        totalEl.style.color = 'var(--accent-orange)';
        if (stageBadge) {
          stageBadge.className = 'stage-status-badge alert';
          stageBadge.textContent = 'ALERTA FINAL // CERRAR EN DIAPO 10 (4:30 - 5:00)';
        }
      } else if (timerSeconds >= 240) {
        // 4:00 a 4:30
        totalEl.style.color = 'var(--accent-gold)';
        if (stageBadge) {
          stageBadge.className = 'stage-status-badge warning';
          stageBadge.textContent = 'ADVERTENCIA // ENTRANDO A CONCLUSIONES (4:00 - 4:30)';
        }
      } else {
        // 0:00 a 4:00
        totalEl.style.color = 'var(--accent-cyan)';
        if (stageBadge) {
          stageBadge.className = 'stage-status-badge nominal';
          stageBadge.textContent = 'RITMO NOMINAL (0:00 - 4:00)';
        }
      }
    }

    if (slideEl) {
      const budget = SLIDE_DURATIONS[currentSlide - 1];
      if (currentSlide <= MAIN_SLIDE_COUNT) {
        slideEl.innerHTML = `${slideSeconds}s <span style="font-size: 1.2rem; color: var(--accent-gold);">/ ${budget}s</span>`;
        if (slideSeconds > budget) {
          slideEl.style.color = 'var(--accent-red)';
        } else if (slideSeconds > budget - 5) {
          slideEl.style.color = 'var(--accent-gold)';
        } else {
          slideEl.style.color = '#ffffff';
        }
      } else {
        slideEl.innerHTML = `${slideSeconds}s <span style="font-size: 1.1rem; color: var(--accent-cyan);">/ Q&amp;A</span>`;
        slideEl.style.color = '#ffffff';
      }
    }
  }

})();
