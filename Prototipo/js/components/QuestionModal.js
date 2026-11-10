/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: MODAL DE PREGUNTA JURÍDICA CON COMODINES PROCESALES
 * ============================================================================
 */
(function (global) {
  'use strict';

  const { BOARD_TILES, getIcon } = global.Lexopoly;

  function renderQuestionModal(state) {
    if (!state.questionModalOpen || !state.activeQuestion) return '';

    const question = state.activeQuestion;
    const player = state.players[state.turnIndex] || state.players[0];
    const currentTile = BOARD_TILES[player ? player.position : 0];
    const evalResult = state.evaluationResult;
    const optionKeys = ['A', 'B', 'C', 'D'];
    const lifelines = player.lifelines || { fiftyFifty: 2, extraTime: 2 };

    const isUnlimitedTimer = state.questionTimerTotal >= 500;
    const formattedRemaining = isUnlimitedTimer
      ? '∞ Libre'
      : `00:${String(Math.max(0, state.questionTimerRemaining)).padStart(2, '0')}`;
    const formattedSpent = evalResult
      ? `00:${String(Math.max(1, evalResult.timeSpent)).padStart(2, '0')}`
      : '00:21';

    if (state.questionModalMinimized) {
      return `
        <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-[#111111] text-white rounded-2xl px-5 py-3.5 shadow-2xl border-2 border-[#FFD700] flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-full bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] flex items-center justify-center shrink-0">
              ${getIcon('scales', 'w-5 h-5')}
            </span>
            <div>
              <div class="text-[10px] font-bold tracking-wider uppercase text-[#FFD700]">
                EXPEDIENTE EN PAUSA · CASILLA ${currentTile.displayNum}: ${currentTile.name.toUpperCase()}
              </div>
              <div class="font-serif-lex text-base text-white">
                Caso ${question.id}: ${question.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            data-action="toggle-minimize-modal"
            class="px-4 py-2 rounded-lg bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111] font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Restaurar Caso (${formattedRemaining})</span>
            <span>↗</span>
          </button>
        </div>
      `;
    }

    return `
      <div
        class="fixed inset-0 z-50 lex-modal-backdrop flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="lex-modal-panel bg-white rounded-[20px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#111111] my-auto">
          
          <!-- ==================== CABECERA DEL MODAL ==================== -->
          <div class="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-neutral-200">
            ${
              !evalResult
                ? `
                  <!-- Estado 03: Pregunta en curso -->
                  <div>
                    <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111111] text-[#FFD700] text-xs font-bold tracking-[0.14em] uppercase">
                      ${getIcon('pillar', 'w-4 h-4')}
                      <span>JURISPRUDENCIA · RETO ${String(state.round).padStart(2, '0')}</span>
                    </div>
                    <div class="text-xs text-[#4A4A4A] mt-1.5 font-medium">
                      Turno de <strong>${player.name}</strong> ${
                  player.isBot ? '🤖 (Deliberando...)' : ''
                } · Casilla ${currentTile.displayNum}: ${currentTile.name}
                    </div>
                  </div>

                  <!-- Controles derechos: Ver tablero + Temporizador -->
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      data-action="toggle-minimize-modal"
                      class="px-3 py-2 rounded-xl bg-[#F7F6F0] hover:bg-[#FEF5C8] border border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-1.5 transition cursor-pointer"
                      title="Minimizar temporalmente para observar el tablero 9x9"
                    >
                      <span>👁 Ver tablero</span>
                    </button>

                    <button
                      type="button"
                      id="lex-modal-timer-badge"
                      data-action="toggle-pause-timer"
                      class="px-4 py-2 rounded-xl bg-[#FEF5C8] hover:bg-[#F4D03F]/60 border-2 border-[#111111] flex items-center gap-2.5 transition cursor-pointer text-left"
                      title="Haz clic para pausar o reanudar el temporizador (Tecla P)"
                    >
                      <span class="text-[#111111]">
                        ${getIcon('timer', 'w-5 h-5')}
                      </span>
                      <div>
                        <div class="text-[9px] font-extrabold tracking-[0.14em] uppercase text-[#4A4A4A]">
                          ${
                            isUnlimitedTimer
                              ? 'MODO ESTUDIO'
                              : state.questionTimerPaused
                              ? 'RELOJ EN PAUSA ▶'
                              : 'TIEMPO RESTANTE ⏸'
                          }
                        </div>
                        <div id="lex-modal-timer-text" class="font-extrabold text-lg text-[#111111] leading-none mt-0.5">
                          ${formattedRemaining}
                        </div>
                      </div>
                    </button>
                  </div>
                `
                : evalResult.isCorrect
                ? `
                  <!-- Estado 04: Respuesta Correcta -->
                  <div>
                    <div class="flex items-center gap-2 text-[#1E7E48] text-xs font-extrabold tracking-[0.14em] uppercase">
                      ${getIcon('checkCircle', 'w-4 h-4')}
                      <span>RESPUESTA CORRECTA ${
                        player.streak >= 2 ? `· RACHA 🔥 x${player.streak}` : ''
                      }</span>
                    </div>
                    <div class="text-xs text-[#4A4A4A] mt-1 font-medium">
                      ${player.name} · ${player.token.shortName} · Casilla ${currentTile.displayNum}: ${currentTile.name}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-serif-lex text-2xl sm:text-3xl text-[#1E7E48] font-bold leading-none">
                      +${evalResult.pointsDelta} puntos
                    </div>
                    <div class="text-xs text-[#4A4A4A] mt-1">
                      Resuelto en ${formattedSpent}
                    </div>
                  </div>
                `
                : `
                  <!-- Estado 05: Respuesta Incorrecta / Sanción Procesal -->
                  <div>
                    <div class="flex items-center gap-2 text-[#B8333A] text-xs font-extrabold tracking-[0.14em] uppercase">
                      ${getIcon('xCircle', 'w-4 h-4')}
                      <span>RESPUESTA INCORRECTA</span>
                    </div>
                    <div class="text-xs text-[#4A4A4A] mt-1 font-medium">
                      ${player.name} · ${player.token.shortName} · Casilla ${currentTile.displayNum}: ${currentTile.name}
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="font-serif-lex text-2xl sm:text-3xl text-[#B8333A] font-bold leading-none">
                      Sin puntos
                    </div>
                    <div class="text-xs text-[#4A4A4A] mt-1">
                      ${evalResult.isTimeout ? 'Tiempo agotado (Preclusión)' : `Resuelto en ${formattedSpent}`}
                    </div>
                  </div>
                `
            }
          </div>

          <!-- ==================== CUERPO DE LA PREGUNTA ==================== -->
          <div class="pt-5">
            <div class="flex items-center justify-between text-[11px] font-bold tracking-[0.12em] uppercase mb-2">
              <span class="px-2.5 py-0.5 rounded bg-[#FEF5C8] text-[#111111] border border-[#F4D03F]">
                ${question.branchLabel}
              </span>
            </div>

            <h3 class="font-serif-lex text-xl sm:text-2xl text-[#111111] font-bold leading-snug mb-3">
              ${question.questionPrompt}
            </h3>

            <!-- Barra de Recursos Procesales / Comodines del Jugador -->
            ${
              !evalResult
                ? `
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-4 p-2.5 rounded-xl bg-[#F7F6F0] border border-[#DFDDD2]">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] px-1">
                      Comodines de ${player.name.split(' ')[0]}:
                    </span>
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        data-action="use-fifty-fifty"
                        ${lifelines.fiftyFifty <= 0 ? 'disabled' : ''}
                        class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                          lifelines.fiftyFifty > 0
                            ? 'bg-white hover:bg-[#FEF5C8] text-[#111111] border-[#111111] cursor-pointer shadow-2xs'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                        }"
                        title="Descarta automáticamente 2 opciones incorrectas"
                      >
                        <span>⚖️ Descarte 50/50</span>
                        <span class="px-1.5 py-0.2 rounded bg-[#111111] text-[#FFD700] text-[10px]">${lifelines.fiftyFifty}</span>
                      </button>

                      <button
                        type="button"
                        data-action="use-extra-time"
                        ${lifelines.extraTime <= 0 || isUnlimitedTimer ? 'disabled' : ''}
                        class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                          lifelines.extraTime > 0 && !isUnlimitedTimer
                            ? 'bg-white hover:bg-[#FEF5C8] text-[#111111] border-[#111111] cursor-pointer shadow-2xs'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                        }"
                        title="Añade +20 segundos adicionales al reloj"
                      >
                        <span>⏳ Prórroga +20s</span>
                        <span class="px-1.5 py-0.2 rounded bg-[#111111] text-[#FFD700] text-[10px]">${lifelines.extraTime}</span>
                      </button>
                    </div>
                  </div>
                `
                : ''
            }

            <!-- Cuadrícula 2x2 de Opciones (A, B, C, D) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              ${optionKeys
                .map((key) => {
                  const text = question.options[key];
                  const isEliminated = state.eliminatedOptions.includes(key);
                  let cardStateClass = '';
                  let rightStatusIcon = '';

                  if (!evalResult) {
                    if (state.selectedOption === key) {
                      cardStateClass = 'state-selected';
                      rightStatusIcon = `<span class="w-4 h-4 rounded-full border-2 border-[#111111] bg-[#111111] flex items-center justify-center shrink-0 mt-0.5"><span class="w-2 h-2 rounded-full bg-[#FFD700]"></span></span>`;
                    } else if (isEliminated) {
                      cardStateClass = 'state-eliminated';
                    }
                  } else {
                    if (key === evalResult.correctOption) {
                      cardStateClass = 'state-correct';
                      rightStatusIcon = `<span class="text-[#1E7E48] shrink-0 mt-0.5">${getIcon(
                        'checkCircle',
                        'w-4 h-4'
                      )}</span>`;
                    } else if (key === evalResult.selectedOption && !evalResult.isCorrect) {
                      cardStateClass = 'state-wrong';
                      rightStatusIcon = `<span class="text-[#B8333A] shrink-0 mt-0.5">${getIcon(
                        'xCircle',
                        'w-4 h-4'
                      )}</span>`;
                    }
                  }

                  return `
                    <div class="relative group">
                      <button
                        type="button"
                        data-action="select-option"
                        data-option="${key}"
                        ${evalResult ? 'disabled' : ''}
                        class="w-full h-full lex-option-card ${cardStateClass} justify-between pr-8"
                      >
                        <div class="flex items-start gap-3">
                          <span class="lex-option-badge">${key}</span>
                          <span class="lex-option-text text-xs sm:text-[13.5px] leading-snug text-[#111111] font-medium">
                            ${text}
                          </span>
                        </div>
                        ${rightStatusIcon}
                      </button>

                      ${
                        !evalResult
                          ? `
                            <button
                              type="button"
                              data-action="eliminate-option"
                              data-option="${key}"
                              class="absolute top-2 right-2 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition cursor-pointer ${
                                isEliminated
                                  ? 'bg-[#B8333A] text-white opacity-100'
                                  : 'bg-neutral-100 text-neutral-500 opacity-0 group-hover:opacity-100 hover:bg-[#111111] hover:text-[#FFD700]'
                              }"
                              title="${
                                isEliminated
                                  ? 'Restaurar opción descartada'
                                  : 'Tachar / Descartar distractor'
                              }"
                            >
                              ${isEliminated ? '↺' : '✕'}
                            </button>
                          `
                          : ''
                      }
                    </div>
                  `;
                })
                .join('')}
            </div>

            <!-- ==================== BANNER DE RETROALIMENTACIÓN JURÍDICA ==================== -->
            ${
              !evalResult
                ? `
                  <div class="rounded-xl bg-[#F4F3EE] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A4A4A] mb-6 border border-[#DFDDD2]">
                    <div class="flex items-center gap-2">
                      <span class="text-[#111111] shrink-0">${getIcon('infoCircle', 'w-4 h-4')}</span>
                      <span>
                        Selecciona una respuesta (teclas <kbd class="lex-kbd">A</kbd>-<kbd class="lex-kbd">D</kbd>) y presiona <kbd class="lex-kbd">Enter</kbd> para confirmar.
                      </span>
                    </div>
                  </div>
                `
                : evalResult.isCorrect
                ? `
                  <div class="rounded-xl bg-[#ECF6F1] border-2 border-[#1E7E48] p-4 mb-6">
                    <div class="flex items-center gap-2 text-[#1E7E48] font-bold text-sm mb-1.5">
                      ${getIcon('checkCircle', 'w-4 h-4')}
                      <span>${evalResult.headline}</span>
                    </div>
                    <p class="text-xs sm:text-[13.5px] text-[#111111] leading-relaxed mb-2">
                      ${evalResult.explanation}
                    </p>
                    <p class="text-[11.5px] text-[#4A4A4A] font-medium">
                      Fundamento normativo: ${evalResult.citation}
                    </p>
                  </div>
                `
                : `
                  <div class="rounded-xl bg-[#FDF0F0] border-2 border-[#B8333A] p-4 mb-6">
                    <div class="flex items-center gap-2 text-[#B8333A] font-bold text-sm mb-1.5">
                      ${getIcon('xCircle', 'w-4 h-4')}
                      <span>${evalResult.headline}</span>
                    </div>
                    <p class="text-xs sm:text-[13.5px] text-[#111111] leading-relaxed mb-2">
                      ${evalResult.explanation}
                    </p>
                    <p class="text-[11.5px] text-[#4A4A4A] font-medium">
                      Fundamento normativo: ${evalResult.citation}
                    </p>
                  </div>
                `
            }
          </div>

          <!-- ==================== PIE DEL MODAL ==================== -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-200">
            ${
              !evalResult
                ? `
                  <div>
                    <div class="text-xs font-extrabold text-[#111111]">
                      Acierto: +${question.rewardPoints} puntos y +${question.advanceSteps} casillas
                    </div>
                    <div class="text-[11px] text-[#4A4A4A] mt-0.5">
                      Error: ${
                        question.penaltyType === 'PERDIDA_TURNO'
                          ? 'pierdes el próximo turno y retrocedes 1 casilla (Recurso Improcedente)'
                          : `retrocedes ${question.penaltySteps || 1} ${
                              (question.penaltySteps || 1) === 1 ? 'casilla' : 'casillas'
                            } · Sin pérdida de puntos`
                      }
                    </div>
                  </div>

                  <button
                    type="button"
                    data-action="confirm-answer"
                    ${!state.selectedOption ? 'disabled' : ''}
                    class="px-6 py-3 rounded-xl font-extrabold text-sm transition border-2 ${
                      state.selectedOption
                        ? 'bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111] border-[#111111] cursor-pointer shadow-sm'
                        : 'bg-[#E5E5E0] text-[#7A7A7A] border-transparent cursor-not-allowed'
                    }"
                  >
                    Confirmar respuesta
                  </button>
                `
                : `
                  <div>
                    <div class="text-xs font-extrabold text-[#111111]">
                      Próximo destino: ${evalResult.targetTile.name} · ${evalResult.targetTile.displayNum}
                    </div>
                    <div class="text-[11px] text-[#4A4A4A] mt-0.5">
                      El movimiento se aplicará al continuar.
                    </div>
                  </div>

                  <button
                    type="button"
                    data-action="apply-evaluation"
                    class="px-6 py-3 rounded-xl bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700] border-2 border-[#111111] font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <span>${evalResult.actionButtonText}</span>
                    <span>→</span>
                  </button>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderQuestionModal = renderQuestionModal;
})(window);
