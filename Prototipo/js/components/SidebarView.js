/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: PANEL LATERAL DE JUGADORES Y ACCIÓN DEL TURNO
 * ============================================================================
 * Los nombres, fichas y roles quedan bloqueados una vez iniciada la partida
 * y solo pueden reconfigurarse reiniciando la partida.
 */
(function (global) {
  'use strict';

  const { BOARD_TILES, getIcon, GameState } = global.Lexopoly;

  function renderSidebarView(state) {
    const currentPlayer = state.players[state.turnIndex] || state.players[0];
    const currentTile = BOARD_TILES[currentPlayer ? currentPlayer.position : 0];
    const activeQuestion = state.activeQuestion;

    return `
      <aside class="w-full flex flex-col gap-5">
        <!-- Tarjeta 1: Estado de Jugadores (Nombres fijos durante la partida, Rangos, Rachas y Sanciones) -->
        <div class="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3.5">
            <div>
              <h3 class="font-serif-lex text-2xl text-[#111111] font-bold leading-none">Jugadores</h3>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-[#111111] text-[#FFD700] text-xs font-bold">
              ${state.players.length} en juego
            </span>
          </div>

          <div class="space-y-3">
            ${state.players
              .map((player, idx) => {
                const isTurn = idx === state.turnIndex;
                const playerTile = BOARD_TILES[player.position] || BOARD_TILES[0];
                const rank = GameState.getPlayerRank(player.points);

                return `
                  <div
                    class="rounded-xl p-3.5 transition-all border-2 ${
                      isTurn
                        ? 'bg-[#FEF5C8] border-[#111111] shadow-xs'
                        : 'bg-[#F9F8F3] border-[#DFDDD2]'
                    }"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-3 min-w-0">
                        <div
                          class="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                          style="border-color: #111111; background-color: ${
                            isTurn ? '#111111' : player.token.bgLight
                          }; color: ${isTurn ? '#FFD700' : player.token.color};"
                        >
                          ${getIcon(player.token.icon, 'w-5 h-5')}
                        </div>
                        <div class="min-w-0">
                          <div class="font-bold text-sm text-[#111111] truncate flex flex-wrap items-center gap-1.5">
                            <span>${player.name}</span>
                            ${
                              player.isBot
                                ? `<span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#111111] text-[#FFD700]">🤖 IA</span>`
                                : ''
                            }
                            ${
                              player.streak >= 2
                                ? `<span class="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-[#FFD700] text-[#111111] border border-[#111111]" title="Racha de aciertos consecutivos">🔥 x${player.streak}</span>`
                                : ''
                            }
                            ${
                              player.circuits > 0
                                ? `<span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#1E7E48] text-white">Vuelta ${player.circuits}</span>`
                                : ''
                            }
                          </div>

                          <div class="text-[11px] text-[#4A4A4A] truncate font-medium flex items-center gap-1.5">
                            <span>${rank.icon} ${rank.title}</span>
                            <span>·</span>
                            <span>${player.token.shortName}</span>
                          </div>

                          <div class="text-[11px] text-[#111111] font-bold mt-0.5">
                            📍 Casilla ${playerTile.displayNum}: ${playerTile.name}
                          </div>
                        </div>
                      </div>

                      <div class="text-right shrink-0">
                        <div class="font-extrabold text-xl text-[#111111] leading-none">
                          ${player.points}
                        </div>
                        <div class="text-[9.5px] font-bold tracking-wider uppercase text-[#4A4A4A] mt-1">
                          PUNTOS
                        </div>
                      </div>
                    </div>

                    <!-- Indicador de Sanción Procesal Activa -->
                    ${
                      player.activeSanction
                        ? `
                          <div class="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#FDF0F0] border border-[#B8333A]/40 flex items-center justify-between text-[11px] text-[#B8333A] font-bold">
                            <span class="flex items-center gap-1.5">
                              ${getIcon('xCircle', 'w-3.5 h-3.5')}
                              <span>${player.activeSanction}</span>
                            </span>
                            ${
                              player.skipTurns > 0
                                ? `<span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#B8333A] text-white">Pendiente</span>`
                                : `<span class="text-[10px] opacity-80">Aplicada</span>`
                            }
                          </div>
                        `
                        : ''
                    }
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Tarjeta 2: Caso Jurídico Activo / Acción del Turno (#111111 + #F4D03F / #FFD700) -->
        <div class="bg-[#111111] text-white rounded-2xl p-6 shadow-lg border-2 border-[#F4D03F]">
          ${
            activeQuestion && state.phase === 'AWAITING_CASE'
              ? `
                <div class="flex items-center gap-2 text-[#FFD700] text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
                  ${getIcon('file-search', 'w-4 h-4')}
                  <span>${activeQuestion.branchLabel.split('·')[0].trim()}</span>
                </div>

                <h4 class="font-serif-lex text-2xl sm:text-[26px] text-white leading-snug mb-2.5">
                  ${activeQuestion.title}
                </h4>

                <p class="text-sm text-neutral-300 leading-relaxed mb-5">
                  Analiza las cuatro alternativas y responde la pregunta asignada a <strong class="text-[#FFD700]">${currentPlayer.name}</strong> en la casilla <strong class="text-[#FFD700]">${currentTile.name}</strong>.
                </p>

                <div class="flex items-center justify-between text-xs border-t border-white/15 pt-3.5 mb-4">
                  <span class="font-semibold text-white">
                    Acierto: +${activeQuestion.rewardPoints} puntos
                  </span>
                  <span class="font-bold text-[#FFD700]">
                    +${activeQuestion.advanceSteps} casillas
                  </span>
                </div>

                <button
                  type="button"
                  data-action="open-question-modal"
                  class="w-full py-3.5 px-5 rounded-xl bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111] font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                >
                  <span>Responder pregunta ahora</span>
                  <span>→</span>
                </button>
              `
              : `
                <div class="flex items-center gap-2 text-[#FFD700] text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
                  ${getIcon('scales', 'w-4 h-4')}
                  <span>TURNO DE ${currentPlayer.name.split(' ')[0].toUpperCase()}</span>
                </div>

                <h4 class="font-serif-lex text-2xl text-white leading-snug mb-2.5">
                  ${
                    currentPlayer.skipTurns > 0
                      ? 'Sanción Procesal Pendiente'
                      : 'Lanza los dados para avanzar'
                  }
                </h4>

                <p class="text-sm text-neutral-300 leading-relaxed mb-5">
                  ${
                    currentPlayer.skipTurns > 0
                      ? `${currentPlayer.name} tiene una sanción activa por Recurso Improcedente o Preclusión y debe ceder este turno.`
                      : `Ubicación actual: Casilla ${currentTile.displayNum} (${currentTile.name}). Lanza el dado virtual para avanzar y responder una pregunta aleatoria.`
                  }
                </p>

                <button
                  type="button"
                  data-action="roll-dice"
                  ${state.isRolling || state.isMovingToken ? 'disabled' : ''}
                  class="w-full py-3.5 px-5 rounded-xl bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111] font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                >
                  <span>${
                    currentPlayer.skipTurns > 0
                      ? 'Acatar Sanción y Ceder Turno'
                      : '🎲 Lanzar dados (1–6)'
                  }</span>
                  <span>→</span>
                </button>
              `
          }
        </div>

        <!-- Tarjeta 3: Bitácora Procesal (Últimos Movimientos) -->
        <div class="px-1">
          <div class="text-[11px] font-extrabold tracking-[0.15em] uppercase text-[#111111] mb-2.5">
            HISTORIAL DE LA PARTIDA
          </div>
          <div class="space-y-1.5 text-xs text-[#4A4A4A]">
            ${state.logs
              .slice(0, 4)
              .map(
                (log, i) => `
                  <p class="leading-relaxed ${
                    i === 0 ? 'text-[#111111] font-bold' : 'text-[#4A4A4A]'
                  }">
                    ${log}
                  </p>
                `
              )
              .join('')}
          </div>
        </div>
      </aside>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderSidebarView = renderSidebarView;
})(window);
