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
