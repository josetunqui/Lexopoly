/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: VICTORIA ACADÉMICA, REGLAMENTO Y CÓDICE (PALETA LOGO)
 * ============================================================================
 */
(function (global) {
  'use strict';

  const { BOARD_TILES, getIcon } = global.Lexopoly;

  const LEGAL_CODEX_ENTRIES = [
    {
      term: 'Fumus boni iuris (Verosimilitud del derecho)',
      branch: 'I. Medidas Cautelares · Art. 611 CPC',
      definition: 'Apariencia razonable y fundada de la existencia del derecho invocado por el solicitante de la medida cautelar.'
    },
    {
      term: 'Periculum in mora (Peligro en la demora)',
      branch: 'I. Medidas Cautelares · Art. 611 CPC',
      definition: 'Riesgo objetivo de que la duración del proceso principal torne ineficaz o ilusoria la ejecución de la sentencia definitiva.'
    },
    {
      term: 'Contracautela',
      branch: 'I. Medidas Cautelares · Art. 613 CPC',
      definition: 'Garantía real o personal ofrecida por el solicitante para asegurar al afectado el resarcimiento de los eventuales daños y perjuicios que cause la ejecución de la medida.'
    },
    {
      term: 'Inaudita altera pars',
      branch: 'I. Medidas Cautelares · Art. 637 CPC',
      definition: 'Regla procesal por la cual la medida cautelar se concede o rechaza sin escuchar previamente a la parte afectada, quien puede ejercer su defensa posteriormente mediante oposición.'
    },
    {
      term: 'Carácter Provisorio y Variable',
      branch: 'I. Medidas Cautelares · Art. 612 CPC',
      definition: 'Toda medida cautelar es instrumental, provisoria y variable, pudiendo modificarse o cancelarse si varían los presupuestos que determinaron su concesión.'
    },
    {
      term: 'Nulla executio sine titulo (Título Ejecutivo)',
      branch: 'II. Proceso Único de Ejecución · Arts. 688 y 689 CPC',
      definition: 'No hay ejecución sin título: solo se puede promover ejecución en virtud de un documento calificado por ley que contenga una obligación cierta, expresa, exigible y líquida.'
    },
    {
      term: 'Mandato Ejecutivo',
      branch: 'II. Proceso Único de Ejecución · Art. 690-C CPC',
      definition: 'Resolución judicial que ordena al ejecutado cumplir con la obligación exigida dentro del plazo de ley, bajo apercibimiento de iniciarse la ejecución forzada.'
    },
    {
      term: 'Contradicción del Ejecutado',
      branch: 'II. Proceso Único de Ejecución · Art. 690-D CPC',
      definition: 'Mecanismo técnico de defensa del ejecutado fundado en causales taxativas (inexigibilidad o iliquidez, nulidad formal o falsedad del título, o extinción de la obligación). Solo admite declaración de parte, documentos y pericia.'
    }
  ];

  function renderVictoryModal(state) {
    if (!state.victoryModalOpen) return '';

    const sortedPlayers = [...state.players].sort((a, b) => b.points - a.points);
    const winner = state.winner || sortedPlayers[0];

    return `
      <div
        class="fixed inset-0 z-50 lex-modal-backdrop flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="lex-modal-panel bg-white rounded-[22px] max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#FFD700] my-auto">
          <!-- Encabezado Negro Profundo + Amarillo Vibrante -->
          <div class="lex-hero-bg text-white p-8 text-center relative border-b-2 border-[#FFD700]">
            <div class="w-16 h-16 rounded-full bg-white border-2 border-[#FFD700] p-1 flex items-center justify-center mx-auto mb-4 shadow-md overflow-hidden">
              <img src="./assets/logo.jpg?v=2" alt="Logo Oficial" class="w-full h-full lex-crest-img rounded-full" onerror="this.style.display='none'" />
            </div>
            <div class="text-xs font-extrabold tracking-[0.2em] uppercase text-[#FFD700] mb-1">
              SENTENCIA DEFINITIVA · EXCELENCIA JURÍDICA
            </div>
            <h2 class="font-serif-lex text-3xl sm:text-4xl text-white font-bold mb-2">
              ¡Victoria para <span class="text-[#FFD700]">${winner.name}</span>!
            </h2>
            <p class="text-sm text-neutral-200 max-w-lg mx-auto">
              ${
                state.victoryReason ||
                `Completó el circuito perimetral del tablero alcanzando el máximo Prestigio Jurídico.`
              }
            </p>
          </div>

          <!-- Podio y Clasificación de Jugadores -->
          <div class="p-6 sm:p-8 bg-[#F7F6F0]">
            <div class="text-xs font-extrabold tracking-[0.14em] uppercase text-[#111111] mb-3">
              CLASIFICACIÓN GENERAL DE PRESTIGIO JURÍDICO
            </div>

            <div class="space-y-3 mb-6">
              ${sortedPlayers
                .map((p, index) => {
                  const totalAnswered = p.correctCount + p.wrongCount;
                  const accuracy =
                    totalAnswered > 0 ? Math.round((p.correctCount / totalAnswered) * 100) : 100;
                  const tile = BOARD_TILES[p.position] || BOARD_TILES[0];

                  return `
                    <div class="bg-white rounded-xl p-4 border-2 ${
                      index === 0 ? 'border-[#111111] bg-[#FEF5C8]' : 'border-[#DFDDD2]'
                    } flex items-center justify-between gap-4">
                      <div class="flex items-center gap-3.5">
                        <span class="w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center ${
                          index === 0
                            ? 'bg-[#111111] text-[#FFD700]'
                            : 'bg-neutral-200 text-[#111111]'
                        }">
                          ${index + 1}°
                        </span>
                        <div
                          class="w-10 h-10 rounded-full border-2 border-[#111111] flex items-center justify-center shrink-0"
                          style="background-color: ${p.token.bgLight}; color: ${p.token.color};"
                        >
                          ${getIcon(p.token.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <div class="font-bold text-sm text-[#111111]">${p.name}</div>
                          <div class="text-xs text-[#4A4A4A]">
                            ${p.token.name} · Casilla ${tile.displayNum} (${tile.name}) · Precisión: ${accuracy}% (${p.correctCount} aciertos)
                          </div>
                        </div>
                      </div>

                      <div class="text-right">
                        <div class="font-serif-lex font-extrabold text-2xl text-[#111111]">
                          ${p.points}
                        </div>
                        <div class="text-[10px] font-extrabold uppercase text-[#111111]">
                          PRESTIGIO
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                data-action="close-victory-modal"
                class="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FEF5C8] border-2 border-[#111111] text-[#111111] font-bold text-xs cursor-pointer"
              >
                Seguir en el Tablero
              </button>
              <button
                type="button"
                data-action="start-new-game"
                class="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700] border-2 border-[#111111] font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Nueva Partida</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRulesModal(state) {
    if (!state.rulesModalOpen) return '';

    return `
      <div
        class="fixed inset-0 z-50 lex-modal-backdrop flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="lex-modal-panel bg-white rounded-[20px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#111111] my-auto">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <div class="inline-block px-2.5 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold tracking-[0.14em] uppercase">
                REGLAMENTO DE LA PARTIDA · EL CORRECAMINOS JURÍDICO
              </div>
              <h2 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold mt-1.5">
                Cómo se juega
              </h2>
            </div>
            <button
              type="button"
              data-action="close-rules"
              class="text-sm font-bold text-[#4A4A4A] hover:text-[#111111] px-2.5 py-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="py-5 space-y-3.5 text-xs sm:text-sm text-[#262626] leading-relaxed">
            <div class="p-3.5 rounded-xl bg-[#FEF5C8] border-2 border-[#111111]">
              <h3 class="font-bold text-[#111111] mb-1">
                1. Configuración y Recorrido del Tablero (9×9)
              </h3>
              <p>
                Define los nombres y fichas de los jugadores en la pantalla inicial antes de comenzar. Una vez iniciada la partida, los jugadores quedan fijados hasta que se reinicie el juego. Lanza el dado virtual (1 al 6) para avanzar en sentido horario.
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-[#ECF6F1] border border-[#1E7E48]/40">
              <h3 class="font-bold text-[#1E7E48] mb-1">
                2. Preguntas Aleatorias y Comodines Procesales
              </h3>
              <p>
                En cada casilla se sortea de forma aleatoria una pregunta sobre <strong>I. Medidas Cautelares</strong> o <strong>II. Proceso Único de Ejecución</strong>. Cada jugador cuenta con comodines limitados por partida: <strong>⚖️ Descarte 50/50</strong> (elimina 2 opciones incorrectas) y <strong>⏳ Prórroga +20s</strong>.
              </p>
            </div>

            <div class="p-3.5 rounded-xl bg-[#FDF0F0] border border-[#B8333A]/40">
              <h3 class="font-bold text-[#B8333A] mb-1">
                3. Sanciones Procesales por Error o Tiempo Agotado
              </h3>
              <p>
                • <strong>Defecto Procesal:</strong> Retrocedes automáticamente 1 o 2 casillas.<br>
                • <strong>Recurso Improcedente / Preclusión:</strong> Pierdes el próximo turno y retrocedes 1 casilla.
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-200 flex justify-between items-center">
            <button
              type="button"
              data-action="open-codex"
              class="px-4 py-2 rounded-xl bg-[#F4D03F] hover:bg-[#FFD700] border-2 border-[#111111] text-[#111111] font-bold text-xs cursor-pointer"
            >
              📖 Abrir Códice de Aforismos
            </button>
            <button
              type="button"
              data-action="close-rules"
              class="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700] font-bold text-xs cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCodexModal(state) {
    if (!state.codexModalOpen) return '';

    const q = (state.codexSearchQuery || '').trim().toLowerCase();
    const filtered = q
      ? LEGAL_CODEX_ENTRIES.filter(
          (item) =>
            item.term.toLowerCase().includes(q) ||
            item.branch.toLowerCase().includes(q) ||
            item.definition.toLowerCase().includes(q)
        )
      : LEGAL_CODEX_ENTRIES;

    return `
      <div
        class="fixed inset-0 z-50 lex-modal-backdrop flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="lex-modal-panel bg-white rounded-[20px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#111111] my-auto">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <div class="inline-block px-2.5 py-0.5 rounded bg-[#111111] text-[#FFD700] text-xs font-bold tracking-[0.14em] uppercase">
                GLOSARIO Y DOCTRINA · CONSULTA RÁPIDA
              </div>
              <h2 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold mt-1.5">
                Códice de Aforismos y Principios Jurídicos
              </h2>
            </div>
            <button
              type="button"
              data-action="close-codex"
              class="text-sm font-bold text-[#4A4A4A] hover:text-[#111111] px-2.5 py-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="my-4">
            <input
              type="text"
              id="lex-codex-search-input"
              value="${state.codexSearchQuery || ''}"
              placeholder="Buscar principio o aforismo (ej. onus probandi, in dubio, lesividad...)"
              class="w-full px-4 py-2.5 rounded-xl border-2 border-[#111111] focus:outline-none text-xs sm:text-sm text-[#111111] bg-[#FEF9E7]"
            />
          </div>

          <div class="max-h-[360px] overflow-y-auto space-y-2.5 pr-1">
            ${filtered
              .map(
                (entry) => `
              <div class="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#DFDDD2]">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span class="font-serif-lex font-bold text-base text-[#111111]">
                    ${entry.term}
                  </span>
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#111111] text-[#FFD700]">
                    ${entry.branch}
                  </span>
                </div>
                <p class="text-xs text-[#262626] leading-relaxed">
                  ${entry.definition}
                </p>
              </div>
            `
              )
              .join('')}
          </div>

          <div class="pt-4 mt-4 border-t border-neutral-200 flex justify-end">
            <button
              type="button"
              data-action="close-codex"
              class="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700] font-bold text-xs cursor-pointer"
            >
              Cerrar Códice
            </button>
          </div>
        </div>
      </div>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderVictoryModal = renderVictoryModal;
  global.Lexopoly.renderRulesModal = renderRulesModal;
  global.Lexopoly.renderCodexModal = renderCodexModal;
})(window);
