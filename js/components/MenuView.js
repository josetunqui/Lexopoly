/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: PANTALLA 01 · SALA DE JUGADORES E INICIO DE PARTIDA
 * ============================================================================
 */
(function (global) {
  'use strict';

  const { getIcon, PLAYER_TOKENS, store } = global.Lexopoly;

  function renderMenuView(state, menuConfig) {
    const hasSaved = store.hasSavedMatch();

    const activePlayerCount =
      menuConfig.mode === 'practica'
        ? 1
        : menuConfig.mode === 'duelo'
        ? 2
        : menuConfig.playerCount || 3;

    const firstPlayerName = (menuConfig.slots[0]?.name || 'Jugador 1').split(' ')[0];

    const modes = [
      {
        id: 'clasico',
        title: 'Clásico',
        subtitle: 'Compite entre 2 a 4 jugadores (humanos o Bots IA).',
        meta: '2–4 jugadores',
        icon: 'users'
      },
      {
        id: 'practica',
        title: 'Práctica individual',
        subtitle: 'Entrena en solitario a tu propio ritmo.',
        meta: '1 jugador',
        icon: 'book-open'
      },
      {
        id: 'duelo',
        title: 'Duelo jurídico',
        subtitle: 'Partida rápida cara a cara (1 vs 1 o contra Bot IA).',
        meta: '2 jugadores',
        icon: 'swords'
      }
    ];

    return `
      <section class="min-h-[calc(100vh-116px)] grid grid-cols-1 lg:grid-cols-12">
        <!-- Columna Izquierda: Panel Hero Negro Profundo (#111111) + Amarillo Vibrante (#FFD700 / #F4D03F) -->
        <div class="lg:col-span-5 lex-hero-bg text-white px-8 py-10 lg:px-12 lg:py-14 flex flex-col justify-between relative overflow-hidden border-r-2 border-[#F4D03F]/30">
          <div class="max-w-xl z-10">
            <div class="flex items-center gap-3 mb-6">
              <span class="w-8 h-[2px] bg-[#FFD700]"></span>
              <span class="text-xs font-bold tracking-[0.2em] uppercase text-[#FFD700]">
                EL DERECHO SE APRENDE JUGANDO
              </span>
            </div>

            <h1 class="font-serif-lex text-4xl sm:text-5xl leading-[1.12] font-normal text-white mb-5">
              El Correcaminos <span class="text-[#F4D03F]">Jurídico</span>
            </h1>

            <p class="text-sm sm:text-base text-neutral-200 leading-relaxed mb-8 font-normal">
              Define los participantes, elige tu ficha jurídica, usa recursos procesales estratégicos (50/50 y Prórroga) y conquista el tablero de 9×9 resolviendo las 31 preguntas de Medidas Cautelares y Proceso Único de Ejecución que aparecen de forma aleatoria.
            </p>

            <!-- Logo Institucional Oficial + Lema -->
            <div class="flex items-center gap-4 my-6 p-4 rounded-2xl bg-[#1A1A1A]/90 border border-[#F4D03F]/40 shadow-lg">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border-2 border-[#FFD700] flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <img
                  src="./assets/logo.jpg?v=2"
                  alt="Logo Oficial Lexopoly"
                  class="w-full h-full lex-crest-img rounded-full"
                  onerror="this.style.display='none'"
                />
              </div>
              <div>
                <p class="font-serif-lex italic text-lg sm:text-xl text-[#FFD700] mb-1">
                  Cada argumento cuenta.
                </p>
                <p class="text-xs sm:text-sm text-neutral-300">
                  Juega con compañeros en la misma mesa o enfréntate a nuestros Bots Jurídicos con IA.
                </p>
              </div>
            </div>
          </div>

          <!-- Estadísticas inferiores -->
          <div class="z-10 pt-6 border-t border-[#F4D03F]/25 grid grid-cols-3 gap-4 max-w-xl">
            <div>
              <div class="font-serif-lex text-2xl sm:text-3xl text-[#FFD700] font-bold mb-0.5">32</div>
              <div class="text-xs text-neutral-300">casillas (9×9)</div>
            </div>
            <div>
              <div class="font-serif-lex text-2xl sm:text-3xl text-[#FFD700] font-bold mb-0.5">31</div>
              <div class="text-xs text-neutral-300">preguntas aleatorias</div>
            </div>
            <div>
              <div class="font-serif-lex text-2xl sm:text-3xl text-[#FFD700] font-bold mb-0.5">2</div>
              <div class="text-xs text-neutral-300">ejes procesales</div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Sala de Configuración de Jugadores y Partida (Lista para Jugar) -->
        <div class="lg:col-span-7 bg-[#F7F6F0] px-5 py-8 sm:px-10 lg:px-12 lg:py-10 flex flex-col justify-center">
          <div class="max-w-2xl w-full mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-[#FFD700] text-[11px] font-bold tracking-[0.14em] uppercase">
                <span>SALA DE PARTIDA · HOLA, ${firstPlayerName.toUpperCase()}</span>
              </div>
              <span class="text-xs font-semibold text-[#4A4A4A]">
                Personaliza nombres, fichas y oponentes antes de empezar
              </span>
            </div>

            <h2 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold mb-4">
              Configura tu mesa y tus jugadores
            </h2>

            <!-- 1. Selección de Modo de Juego -->
            <div class="mb-5">
              <label class="block text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-2">
                1. Modalidad de partida
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                ${modes
                  .map((m) => {
                    const isSelected = menuConfig.mode === m.id;
                    return `
                      <button
                        type="button"
                        data-action="select-mode"
                        data-mode="${m.id}"
                        class="text-left rounded-xl p-3 transition-all border-2 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF5C8] border-[#111111] shadow-sm'
                            : 'bg-white border-[#DFDDD2] hover:border-[#F4D03F]'
                        }"
                      >
                        <div class="flex items-center justify-between mb-1.5">
                          <div class="w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#111111] text-[#FFD700]'
                              : 'bg-[#FEF5C8] text-[#111111]'
                          }">
                            ${getIcon(m.icon, 'w-4 h-4')}
                          </div>
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#111111] text-[#FFD700]'
                              : 'bg-neutral-100 text-[#4A4A4A]'
                          }">${m.meta}</span>
                        </div>
                        <div>
                          <div class="font-bold text-xs sm:text-sm text-[#111111]">${m.title}</div>
                          <div class="text-[11px] text-[#4A4A4A] leading-snug mt-0.5">${m.subtitle}</div>
                        </div>
                      </button>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- 2. Registro Directo de Jugadores (Nombres, Fichas y Bot IA) -->
            <div class="bg-white border-2 border-[#111111] rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-neutral-200">
                <div>
                  <span class="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                    2. Participantes en la mesa (${activePlayerCount})
                  </span>
                  <p class="text-[11px] text-[#4A4A4A]">
                    Escribe el nombre de cada jugador, haz clic en su icono para cambiar de ficha o activa un Bot IA.
                  </p>
                </div>

                <!-- Botones rápidos de cantidad de jugadores -->
                <div class="flex items-center gap-1 bg-[#F7F6F0] p-1 rounded-lg border border-[#DFDDD2]">
                  ${[1, 2, 3, 4]
                    .map(
                      (cnt) => `
                    <button
                      type="button"
                      data-action="set-player-count"
                      data-count="${cnt}"
                      class="px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                        activePlayerCount === cnt
                          ? 'bg-[#111111] text-[#FFD700]'
                          : 'text-[#111111] hover:bg-[#FEF5C8]'
                      }"
                    >
                      ${cnt} ${cnt === 1 ? 'Jug.' : 'Jug.'}
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- Tarjetas de Jugadores Editables -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${Array.from({ length: activePlayerCount })
                  .map((_, idx) => {
                    const slot = menuConfig.slots[idx] || {
                      name: `Jugador ${idx + 1}`,
                      tokenIndex: idx,
                      isBot: false
                    };
                    const tok =
                      PLAYER_TOKENS[slot.tokenIndex % PLAYER_TOKENS.length] || PLAYER_TOKENS[0];

                    return `
                      <div class="p-3 rounded-xl border-2 ${
                        idx === 0
                          ? 'bg-[#FEF5C8]/60 border-[#111111]'
                          : 'bg-[#FAF9F5] border-[#DFDDD2]'
                      } flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
                            Jugador ${idx + 1} ${idx === 0 ? '(Principal)' : ''}
                          </span>

                          ${
                            idx > 0
                              ? `
                                <button
                                  type="button"
                                  data-action="toggle-slot-bot"
                                  data-slot-index="${idx}"
                                  class="px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                    slot.isBot
                                      ? 'bg-[#111111] text-[#FFD700] border-[#111111]'
                                      : 'bg-white text-[#111111] border-[#111111] hover:bg-[#FEF5C8]'
                                  }"
                                  title="Alternar entre Jugador Humano o Bot controlado por IA"
                                >
                                  ${slot.isBot ? '🤖 Bot IA Activo' : '👤 Humano (Cambiar a IA)'}
                                </button>
                              `
                              : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-[#FFD700]">👤 Humano</span>`
                          }
                        </div>

                        <div class="flex items-center gap-2.5">
                          <!-- Botón de Ficha del Jugador -->
                          <button
                            type="button"
                            data-action="cycle-slot-token"
                            data-slot-index="${idx}"
                            class="w-10 h-10 rounded-full border-2 border-[#111111] flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition shadow-2xs"
                            style="background-color: ${tok.bgLight}; color: ${tok.color};"
                            title="Ficha: ${tok.name} (Haz clic para cambiar ficha)"
                          >
                            ${getIcon(tok.icon, 'w-5 h-5')}
                          </button>

                          <div class="flex-1 min-w-0">
                            <input
                              type="text"
                              data-slot-name-index="${idx}"
                              value="${slot.name}"
                              maxlength="28"
                              placeholder="Escribe el nombre..."
                              class="w-full px-2.5 py-1.5 rounded-lg border-2 border-[#111111] bg-white text-xs sm:text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                            />
                            <div class="flex items-center justify-between mt-1">
                              <span class="text-[10px] text-[#4A4A4A] font-medium truncate">
                                Ficha: <strong>${tok.shortName}</strong>
                              </span>
                              <button
                                type="button"
                                data-action="cycle-slot-token"
                                data-slot-index="${idx}"
                                class="text-[10px] font-bold text-[#111111] underline hover:text-[#B7950B] cursor-pointer"
                              >
                                Cambiar ficha
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>

              <!-- 3. Reglas de Tiempo y Meta de Victoria -->
              <div class="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#111111]">⏱ Reloj por caso:</span>
                  ${[
                    { sec: 30, label: '30s' },
                    { sec: 45, label: '45s' },
                    { sec: 60, label: '60s' },
                    { sec: 0, label: 'Sin reloj' }
                  ]
                    .map(
                      (t) => `
                    <button
                      type="button"
                      data-action="set-timer-seconds"
                      data-seconds="${t.sec}"
                      class="px-2 py-1 rounded font-bold text-[11px] cursor-pointer ${
                        menuConfig.timerSeconds === t.sec
                          ? 'bg-[#111111] text-[#FFD700]'
                          : 'bg-[#F7F6F0] text-[#111111] border border-[#DFDDD2] hover:bg-[#FEF5C8]'
                      }"
                    >
                      ${t.label}
                    </button>
                  `
                    )
                    .join('')}
                </div>

                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#111111]">🏆 Meta Prestigio:</span>
                  ${[150, 200, 300]
                    .map(
                      (pts) => `
                    <button
                      type="button"
                      data-action="set-target-points"
                      data-points="${pts}"
                      class="px-2 py-1 rounded font-bold text-[11px] cursor-pointer ${
                        menuConfig.targetPoints === pts
                          ? 'bg-[#111111] text-[#FFD700]'
                          : 'bg-[#F7F6F0] text-[#111111] border border-[#DFDDD2] hover:bg-[#FEF5C8]'
                      }"
                    >
                      ${pts} pts
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>

            <!-- Botones de Acción Principal -->
            <div class="space-y-2.5">
              <button
                type="button"
                data-action="start-new-game"
                class="w-full py-4 px-6 rounded-xl bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111] border-2 border-[#111111] font-extrabold text-base flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer"
              >
                <span>🎲 ¡Jugar Ahora! (Iniciar Partida con estos Jugadores)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                data-action="open-rules"
                class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FEF5C8] border-2 border-[#111111] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Cómo se juega y Reglas de la Partida</span>
                ${getIcon('book-open', 'w-4 h-4 text-[#111111]')}
              </button>

              ${
                hasSaved
                  ? `
                    <button
                      type="button"
                      data-action="restore-saved-match"
                      class="w-full py-2 px-4 rounded-xl bg-[#ECF6F1] hover:bg-[#DEF0E7] border-2 border-[#1E7E48] text-[#1E7E48] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>↺ Reanudar Partida Guardada en el Navegador</span>
                    </button>
                  `
                  : ''
              }
            </div>
          </div>
        </div>
      </section>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderMenuView = renderMenuView;
})(window);
