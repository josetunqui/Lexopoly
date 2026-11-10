/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: PANTALLA 06 · SISTEMA DE DISEÑO (PALETA ESCUDO OFICIAL)
 * ============================================================================
 */
(function (global) {
  'use strict';

  const { QUESTIONS_BANK, PLAYER_TOKENS, getIcon } = global.Lexopoly;

  function renderDesignSystemView(state, selectedCategoryFilter = 'ALL', showCreator = false) {
    const colors = [
      { name: 'Amarillo Vibrante / Primario', hex: '#F4D03F', border: true },
      { name: 'Oro Brillante / Acento Escudo', hex: '#FFD700', border: true },
      { name: 'Negro Profundo / Secundario', hex: '#111111', border: false },
      { name: 'Carbón Oscuro / Superficie', hex: '#1A1A1A', border: false },
      { name: 'Verde / Acierto confirmado', hex: '#1E7E48', border: false },
      { name: 'Rojo / Error y sanción', hex: '#B8333A', border: false }
    ];

    const filteredCases =
      selectedCategoryFilter === 'ALL'
        ? QUESTIONS_BANK
        : QUESTIONS_BANK.filter((q) => q.category === selectedCategoryFilter);

    return `
      <section class="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <!-- Encabezado Editorial con Escudo -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#111111] text-white p-6 rounded-2xl border-2 border-[#F4D03F] shadow-md">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-white p-1.5 border-2 border-[#FFD700] shrink-0">
              <img src="./assets/logo.jpg" alt="Escudo Oficial" class="w-full h-full lex-crest-img" onerror="this.style.display='none'" />
            </div>
            <div>
              <h1 class="font-serif-lex text-2xl sm:text-4xl text-[#FFD700] font-bold mb-1">
                Un lenguaje a la altura del argumento.
              </h1>
              <p class="text-xs sm:text-sm text-neutral-300">
                Identidad visual inspirada en el Escudo Oficial: Amarillo Vibrante (#F4D03F / #FFD700) y Negro Profundo (#111111 / #1A1A1A).
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full bg-[#F4D03F] text-[#111111] text-xs font-extrabold tracking-[0.16em] uppercase">
            PALETA OFICIAL / 2.0
          </span>
        </div>

        <!-- Cuadrícula de Especificaciones del Sistema de Diseño -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          <!-- Columna 1: 01 Color con propósito + 02 Jerarquía editorial -->
          <div class="space-y-6">
            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-5">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">01</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Color con propósito</h2>
              </div>

              <div class="space-y-3.5 mb-5">
                ${colors
                  .map(
                    (c) => `
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span
                        class="w-9 h-7 rounded-md shrink-0 ${
                          c.border ? 'border-2 border-[#111111]' : ''
                        }"
                        style="background-color: ${c.hex};"
                      ></span>
                      <span class="text-xs font-bold text-[#111111]">${c.name}</span>
                    </div>
                    <span class="text-[11px] font-mono font-bold text-[#4A4A4A]">${c.hex}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <p class="text-[11px] text-[#4A4A4A] leading-relaxed border-t border-neutral-200 pt-3">
                Contraste heráldico entre el Amarillo Vibrante (#FFD700 / #F4D03F) y el Negro Profundo (#111111 / #1A1A1A).
              </p>
            </div>

            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-3">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">02</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Jerarquía editorial</h2>
              </div>
              <div class="text-[10px] font-bold tracking-[0.16em] uppercase text-[#4A4A4A] mb-2">
                LORA + INTER
              </div>
              <div class="font-serif-lex text-3xl text-[#111111] font-bold mb-2">
                El Reto Jurídico
              </div>
              <div class="text-[11px] text-[#4A4A4A] mb-3">
                Portada 66/74 · Títulos 34/42 · Sección 24/30
              </div>
              <div class="font-bold text-sm text-[#111111] mb-2">
                Un criterio claro en cada decisión.
              </div>
              <p class="text-xs text-[#4A4A4A] leading-relaxed">
                Inter aporta legibilidad a casos y controles. Cuerpo 14/22 · Etiquetas 12/16 · Datos 10/14.
              </p>
            </div>
          </div>

          <!-- Columna 2: 03 Acciones y estados + 04 Selección de modo + 05 Ritmo y geometría -->
          <div class="space-y-6">
            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">03</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Acciones y estados</h2>
              </div>

              <div class="text-[10px] font-bold tracking-wider uppercase text-[#4A4A4A] mb-1.5">
                ACENTO PRIMARIO AMARILLO
              </div>
              <button
                type="button"
                data-action="switch-view"
                data-view="board"
                class="w-full py-3 px-4 rounded-xl bg-[#F4D03F] hover:bg-[#FFD700] border-2 border-[#111111] text-[#111111] font-extrabold text-xs flex items-center justify-center gap-2 mb-4 cursor-pointer"
              >
                <span>Iniciar Partida en Tablero</span>
                <span>→</span>
              </button>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div class="text-[9.5px] font-bold tracking-wider uppercase text-[#4A4A4A] mb-1">
                    NEGRO PROFUNDO
                  </div>
                  <div class="py-2.5 px-3 rounded-lg bg-[#111111] text-[#FFD700] font-bold text-xs text-center">
                    Continuar
                  </div>
                </div>
                <div>
                  <div class="text-[9.5px] font-bold tracking-wider uppercase text-[#4A4A4A] mb-1">
                    DESHABILITADO
                  </div>
                  <div class="py-2.5 px-3 rounded-lg bg-[#E5E5E0] text-[#7A7A7A] font-semibold text-xs text-center">
                    Confirmar
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <div class="text-[9.5px] font-bold tracking-wider uppercase text-[#4A4A4A] mb-1">
                    FOCO / ANILLO DORADO
                  </div>
                  <div class="py-2.5 px-3 rounded-lg bg-[#111111] text-white font-semibold text-xs text-center ring-2 ring-[#FFD700]">
                    Continuar
                  </div>
                </div>
                <div>
                  <div class="text-[9.5px] font-bold tracking-wider uppercase text-[#4A4A4A] mb-1">
                    SECUNDARIO
                  </div>
                  <button
                    type="button"
                    data-action="open-rules"
                    class="w-full py-2.5 px-3 rounded-lg bg-white border-2 border-[#111111] text-[#111111] font-bold text-xs text-center cursor-pointer hover:bg-[#FEF5C8]"
                  >
                    Ver reglas
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">04</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Selección de modo</h2>
              </div>
              <div class="space-y-2.5">
                <div class="p-3 rounded-xl bg-[#FEF5C8] border-2 border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-2.5">
                  <span class="w-4 h-4 rounded-full bg-[#111111] flex items-center justify-center">
                    <span class="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                  </span>
                  <span>Clásico · Seleccionado</span>
                </div>
                <div class="p-3 rounded-xl bg-white border border-[#DFDDD2] text-xs font-medium text-[#111111] flex items-center gap-2.5">
                  <span class="w-4 h-4 rounded-full border border-neutral-400"></span>
                  <span>Práctica individual · Disponible</span>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">05</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Ritmo y geometría</h2>
              </div>
              <div class="flex items-end gap-3 mb-3">
                ${[4, 8, 16, 24, 32, 48]
                  .map(
                    (sz) => `
                  <div class="text-center">
                    <div
                      class="bg-[#F4D03F] border-2 border-[#111111] mx-auto mb-1"
                      style="width: ${Math.max(6, sz * 0.75)}px; height: ${Math.max(
                      6,
                      sz * 0.75
                    )}px;"
                    ></div>
                    <span class="text-[10px] font-bold text-[#111111]">${sz}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <p class="text-[11px] text-[#4A4A4A] leading-relaxed">
                Base de 8 px · Bordes de 2 px · Tablero: 9×9 (32 casillas exteriores ID 0–31).
              </p>
            </div>
          </div>

          <!-- Columna 3: 06 Respuestas con estado + 07 Tiempo, azar y fichas -->
          <div class="space-y-6">
            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">06</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Respuestas con estado</h2>
              </div>

              <div class="space-y-3">
                <div class="lex-option-card items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="lex-option-badge">A</span>
                    <span class="text-xs font-medium text-[#111111]">Normal · Opción disponible</span>
                  </div>
                </div>

                <div class="lex-option-card state-selected items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="lex-option-badge">B</span>
                    <span class="text-xs font-bold text-[#111111]">Seleccionada · Lista para confirmar</span>
                  </div>
                  <span class="w-4 h-4 rounded-full bg-[#111111] flex items-center justify-center">
                    <span class="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                  </span>
                </div>

                <div class="lex-option-card state-correct items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="lex-option-badge">B</span>
                    <span class="text-xs font-bold text-[#111111]">Correcta · Argumento fundamentado</span>
                  </div>
                  <span class="text-[#1E7E48]">${getIcon('checkCircle', 'w-4 h-4')}</span>
                </div>

                <div class="lex-option-card state-wrong items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="lex-option-badge">A</span>
                    <span class="text-xs font-bold text-[#111111]">Incorrecta · Revisa el razonamiento</span>
                  </div>
                  <span class="text-[#B8333A]">${getIcon('xCircle', 'w-4 h-4')}</span>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-xs">
              <div class="flex items-baseline gap-2 mb-4">
                <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold">07</span>
                <h2 class="font-serif-lex text-xl text-[#111111] font-bold">Tiempo, azar y fichas</h2>
              </div>

              <div class="flex items-center justify-between gap-3 pb-5 border-b border-neutral-200 mb-5">
                <div class="px-4 py-2 rounded-xl bg-[#FEF5C8] border-2 border-[#111111] flex items-center gap-2.5">
                  <span class="text-[#111111]">${getIcon('timer', 'w-5 h-5')}</span>
                  <div>
                    <div class="text-[9px] font-bold tracking-wider uppercase text-[#4A4A4A]">
                      TIEMPO RESTANTE
                    </div>
                    <div class="font-extrabold text-lg text-[#111111] leading-none mt-0.5">00:24</div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="w-11 h-11 rounded-lg border-2 border-[#111111] bg-[#FEF5C8] flex items-center justify-center font-bold text-[#111111]">
                    ⚁
                  </div>
                  <div class="w-11 h-11 rounded-lg border-2 border-[#111111] bg-white flex items-center justify-center font-bold text-[#111111]">
                    ⚂
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-2 text-center mb-4">
                ${PLAYER_TOKENS.map(
                  (t) => `
                  <div class="flex flex-col items-center">
                    <div
                      class="w-11 h-11 rounded-full border-2 border-[#111111] flex items-center justify-center mb-1.5"
                      style="background-color: ${t.bgLight}; color: ${t.color};"
                    >
                      ${getIcon(t.icon, 'w-5 h-5')}
                    </div>
                    <span class="text-[11px] text-[#111111] font-bold">${t.shortName}</span>
                  </div>
                `
                ).join('')}
              </div>

              <p class="text-[11px] text-[#4A4A4A] leading-relaxed">
                Silueta + nombre + contraste negro/amarillo durante toda la partida.
              </p>
            </div>
          </div>
        </div>

        <!-- ==================== EXPLORADOR Y EDITOR DEL BANCO DE CASOS ==================== -->
        <div class="bg-white border-2 border-[#111111] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div class="text-xs font-extrabold tracking-[0.14em] uppercase text-[#111111] bg-[#FEF5C8] px-2.5 py-0.5 rounded inline-block mb-1 border border-[#F4D03F]">
                MOTOR DE PREGUNTAS JURÍDICAS (APARICIÓN ALEATORIA)
              </div>
              <h2 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold">
                Banco de ${QUESTIONS_BANK.length} Preguntas: Medidas Cautelares y Proceso Único de Ejecución
              </h2>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-action="toggle-case-creator"
                class="px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#F4D03F] hover:bg-[#FFD700] border-2 border-[#111111] text-[#111111] transition cursor-pointer"
              >
                ${showCreator ? '✕ Cerrar Creador' : '+ Crear Pregunta Propia'}
              </button>

              ${[
                { id: 'ALL', label: `Todas (${QUESTIONS_BANK.length})` },
                { id: 'MEDIDAS_CAUTELARES', label: 'I. Medidas Cautelares (16)' },
                { id: 'PROCESO_EJECUCION', label: 'II. Proceso Único de Ejecución (15)' }
              ]
                .map(
                  (f) => `
                  <button
                    type="button"
                    data-action="filter-cases"
                    data-category="${f.id}"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedCategoryFilter === f.id
                        ? 'bg-[#111111] text-[#FFD700]'
                        : 'bg-[#F7F6F0] text-[#111111] hover:bg-[#FEF5C8] border border-[#DFDDD2]'
                    }"
                  >
                    ${f.label}
                  </button>
                `
                )
                .join('')}
            </div>
          </div>

          ${
            showCreator
              ? `
                <form id="lex-custom-case-form" class="mb-8 p-5 rounded-2xl bg-[#FEF5C8] border-2 border-[#111111] space-y-4 animate-fadeIn">
                  <div class="flex items-center justify-between">
                    <h3 class="font-serif-lex text-xl text-[#111111] font-bold">
                      Añadir Nueva Pregunta al Banco Aleatorio
                    </h3>
                    <span class="text-xs font-semibold text-[#111111]">Se guarda automáticamente en tu navegador</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Bloque Temático</label>
                      <select name="category" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111] font-semibold">
                        <option value="MEDIDAS_CAUTELARES">I. Medidas Cautelares</option>
                        <option value="PROCESO_EJECUCION">II. Proceso Único de Ejecución</option>
                      </select>
                    </div>
                    <div class="sm:col-span-2">
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Título del Caso</label>
                      <input type="text" name="title" required placeholder="Ej. Nulidad por vicio del consentimiento" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Supuesto de Hecho (Enunciado)</label>
                    <textarea name="caseText" rows="2" required placeholder="Describe los hechos relevantes del caso práctico..." class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]"></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Pregunta Jurídica</label>
                      <input type="text" name="questionPrompt" required placeholder="¿Qué institución o solución resulta aplicable?" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Cita Legal / Principio Rector</label>
                      <input type="text" name="legalCitation" required placeholder="Ej. Art. 1265 Código Civil · Principio Pacta Sunt Servanda" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" name="optionA" required placeholder="Opción A" class="px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    <input type="text" name="optionB" required placeholder="Opción B" class="px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    <input type="text" name="optionC" required placeholder="Opción C" class="px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                    <input type="text" name="optionD" required placeholder="Opción D" class="px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111]" />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Respuesta Correcta</label>
                      <select name="correctOption" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111] font-bold">
                        <option value="A">Opción A</option>
                        <option value="B" selected>Opción B</option>
                        <option value="C">Opción C</option>
                        <option value="D">Opción D</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold uppercase text-[#111111] mb-1">Sanción en caso de error</label>
                      <select name="penaltyType" class="w-full px-3 py-2 rounded-lg border-2 border-[#111111] bg-white text-xs text-[#111111] font-bold">
                        <option value="RETROCESO">Defecto Procesal (Retrocede 1 casilla)</option>
                        <option value="PERDIDA_TURNO">Recurso Improcedente (Pierde 1 turno)</option>
                      </select>
                    </div>
                    <button type="submit" class="py-2.5 px-4 rounded-lg bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700] font-bold text-xs cursor-pointer">
                      Guardar y Añadir al Banco →
                    </button>
                  </div>
                </form>
              `
              : ''
          }

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${filteredCases
              .map(
                (q) => `
                <div class="rounded-xl border-2 border-[#DFDDD2] p-4 hover:border-[#111111] transition flex flex-col justify-between bg-[#FAF9F5]">
                  <div>
                    <div class="flex items-center justify-between gap-2 text-[10px] font-bold tracking-wider uppercase mb-1.5">
                      <span class="px-2 py-0.5 rounded bg-[#FEF5C8] text-[#111111] border border-[#F4D03F]">${q.branchLabel}</span>
                      <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700]">
                        Caso ${q.id}
                      </span>
                    </div>
                    <h3 class="font-serif-lex text-lg text-[#111111] font-bold mb-1.5">${q.title}</h3>
                    <p class="text-xs text-[#4A4A4A] leading-relaxed mb-2.5">${q.caseText}</p>
                    <p class="text-xs font-bold text-[#111111] mb-2">${q.questionPrompt}</p>
                  </div>

                  <div class="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2 mt-2">
                    <span class="text-[11px] text-[#4A4A4A] truncate font-medium" title="${q.legalCitation}">
                      📖 ${q.legalCitation}
                    </span>
                    <button
                      type="button"
                      data-action="practice-specific-case"
                      data-case-id="${q.id}"
                      class="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#F4D03F] text-[#FFD700] hover:text-[#111111] border border-[#111111] text-xs font-bold shrink-0 cursor-pointer transition"
                    >
                      Probar Caso →
                    </button>
                  </div>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderDesignSystemView = renderDesignSystemView;
})(window);
