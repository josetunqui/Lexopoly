/**
 * ============================================================================
 * LEXOPOLY — COMPONENTE: TABLERO PERIMETRAL 9x9 LIMPIO Y ENFOCADO EN EL JUGADOR
 * ============================================================================
 */
(function (global) {
  'use strict';

  const { BOARD_TILES, getIcon } = global.Lexopoly;

  const PIP_MAP = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  function renderDieFace(value = 5, isRolling = false, highlightGold = false) {
    const safeVal = Math.min(6, Math.max(1, Number(value) || 1));
    const activePips = PIP_MAP[safeVal] || PIP_MAP[1];
    const cells = [];
    for (let i = 0; i < 9; i++) {
      const isOn = activePips.includes(i);
      cells.push(
        `<span class="lex-pip ${isOn ? 'pip-on' : ''} ${
          highlightGold && i === 4 ? 'pip-gold' : ''
        }"></span>`
      );
    }
    return `
      <div class="lex-die-box ${isRolling ? 'lex-die-rolling' : ''}" title="Lanzar dado virtual">
        ${cells.join('')}
      </div>
    `;
  }

  function renderSingleTile(tile, state, currentPlayer) {
    const playersHere = state.players.filter((p) => p.position === tile.id);
    const isCurrentPlayerHere = currentPlayer && currentPlayer.position === tile.id;
    const isSteppingHere = state.steppingTileId === tile.id;
    const isInspected = state.selectedTileInspectorId === tile.id;

    const cornerClass = tile.isCorner ? 'lex-cell-corner' : '';
    const activeClass = isCurrentPlayerHere ? 'lex-cell-active' : '';
    const stepClass = isSteppingHere ? 'lex-cell-step-highlight' : '';
    const inspectedClass = isInspected ? 'lex-cell-inspected' : '';

    let iconColorClass = 'text-[#111111]';
    if (tile.isCorner) {
      iconColorClass = 'text-[#FFD700]';
    } else if (isCurrentPlayerHere) {
      iconColorClass = 'text-[#111111]';
    } else if (tile.type === 'JURISPRUDENCIA_FAVORABLE') {
      iconColorClass = 'text-[#B7950B]';
    }

    return `
      <div
        class="lex-cell ${cornerClass} ${activeClass} ${stepClass} ${inspectedClass}"
        style="grid-row: ${tile.row}; grid-column: ${tile.col};"
        data-action="inspect-tile"
        data-tile-id="${tile.id}"
        title="Casilla ${tile.displayNum} · ${tile.name}"
      >
        <!-- Número de la casilla (01 a 32) -->
        <div class="w-full flex items-center justify-between px-0.5 leading-none">
          <span class="text-[9.5px] font-bold ${
            tile.isCorner
              ? 'text-[#FFD700]'
              : isCurrentPlayerHere
              ? 'text-[#111111] font-extrabold'
              : 'text-neutral-500'
          }">
            ${tile.displayNum}
          </span>
        </div>

        <!-- Icono central o círculo activo -->
        <div class="my-auto flex flex-col items-center justify-center relative">
          ${
            isCurrentPlayerHere && !tile.isCorner
              ? `<div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#111111] bg-[#FFD700] flex items-center justify-center text-[#111111] shadow-xs">
                   ${getIcon(tile.icon, 'w-4 h-4')}
                 </div>`
              : `<div class="${iconColorClass}">
                   ${getIcon(tile.icon, 'w-4 h-4 sm:w-5 sm:h-5')}
                 </div>`
          }
        </div>

        <!-- Fichas de jugadores posicionadas en esta casilla -->
        ${
          playersHere.length > 0
            ? `<div class="lex-tokens-Dock absolute top-1 right-1">
                 ${playersHere
                   .map((p) => {
                     const isTurn = currentPlayer && p.id === currentPlayer.id;
                     const isMoving = state.isMovingToken && isTurn;
                     return `
                       <span
                         class="lex-token-chip ${isTurn ? 'token-current' : ''} ${
                           isMoving ? 'token-moving' : ''
                         }"
                         style="background-color: ${
                           isTurn ? '#111111' : p.token.color
                         }; color: ${isTurn ? '#FFD700' : '#FFFFFF'};"
                         title="${p.name} (${p.token.name})"
                       >
                         ${p.initials}
                       </span>
                     `;
                   })
                   .join('')}
               </div>`
            : ''
        }

        <!-- Nombre de la casilla -->
        <div class="w-full text-center px-0.5">
          <div class="text-[9px] sm:text-[10.5px] font-bold tracking-tight truncate ${
            tile.isCorner ? 'text-white' : 'text-[#111111]'
          }">
            ${tile.name}
          </div>
        </div>

        <!-- Barra cromática inferior -->
        <span class="lex-branch-bar ${tile.typeMeta.cssClass}"></span>
      </div>
    `;
  }

  function renderBoardCenter(state, currentPlayer, currentTile) {
    const inspectedTile =
      state.selectedTileInspectorId !== null
        ? BOARD_TILES.find((t) => t.id === state.selectedTileInspectorId)
        : null;

    const statusLine =
      state.phase === 'AWAITING_CASE'
        ? 'Responde la pregunta para avanzar.'
        : state.phase === 'MOVING'
        ? 'Avanzando por el tablero...'
        : currentPlayer.skipTurns > 0
        ? `Sanción activa: ${currentPlayer.activeSanction}`
        : 'Lanza los dados para avanzar.';

    const rollVal = state.lastRoll || 5;
    const dieA = rollVal > 1 ? Math.floor(rollVal / 2) : 1;
    const dieB = rollVal > 1 ? rollVal - dieA : rollVal;

    return `
      <div class="lex-board-center">
        <!-- Barra superior interna del centro -->
        <div class="flex items-center justify-between text-[11px] font-bold text-[#4A4A4A]">
          <span class="tracking-[0.14em] uppercase px-2.5 py-0.5 rounded bg-[#111111] text-[#FFD700]">
            RONDA ${String(state.round).padStart(2, '0')} / ${String(state.maxRounds).padStart(
      2,
      '0'
    )}
          </span>
          <span>
            ${state.modeLabel}
          </span>
        </div>

        <!-- Identidad central El Correcaminos Jurídico con Logo Oficial -->
        <div class="text-center my-0.5">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-[#111111] shadow-sm p-1 mb-1 overflow-hidden">
            <img
              src="./assets/logo.jpg?v=2"
              alt="Logo El Correcaminos Jurídico"
              class="w-full h-full lex-crest-img rounded-full"
              onerror="this.style.display='none'"
            />
          </div>
          <h2 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold tracking-tight leading-none">
            El Correcaminos Jurídico
          </h2>
          <p class="text-[9.5px] tracking-[0.22em] uppercase text-[#4A4A4A] mt-1 font-extrabold">
            MEDIDAS CAUTELARES Y EJECUCIÓN
          </p>
        </div>

        <!-- Información de Casilla Seleccionada o Tarjetas de Turno -->
        ${
          inspectedTile
            ? `
              <div class="bg-white border-2 border-[#111111] rounded-xl p-3.5 shadow-md text-xs animate-fadeIn">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="px-2 py-0.5 rounded bg-[#111111] text-[#FFD700] font-bold text-[10px]">
                        Casilla ${inspectedTile.displayNum}
                      </span>
                      <span class="font-bold text-[#111111] text-sm">${inspectedTile.name}</span>
                    </div>
                    <p class="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                      ${inspectedTile.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-action="close-tile-inspector"
                    class="text-xs font-bold text-[#4A4A4A] hover:text-[#111111] px-1.5 py-0.5 cursor-pointer"
                    title="Cerrar información"
                  >
                    ✕
                  </button>
                </div>
              </div>
            `
            : `
              <!-- Dos tarjetas centrales: Mazo Jurisprudencia + Turno Actual -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 my-0.5">
                <!-- Tarjeta Mazo de Preguntas (#111111 + #FFD700) -->
                <button
                  type="button"
                  data-action="${state.phase === 'AWAITING_CASE' ? 'open-question-modal' : 'roll-dice'}"
                  class="sm:col-span-5 bg-[#111111] hover:bg-[#1F1F1F] text-white rounded-xl p-3.5 flex flex-col items-center justify-center text-center shadow-md transition cursor-pointer group border-2 border-[#F4D03F]"
                >
                  <div class="text-[#FFD700] mb-1.5 group-hover:scale-110 transition-transform">
                    ${getIcon('pillar', 'w-7 h-7')}
                  </div>
                  <div class="font-serif-lex text-lg sm:text-xl text-[#FFD700] font-bold">
                    Jurisprudencia
                  </div>
                  <div class="text-[9px] tracking-[0.14em] uppercase text-neutral-300 mt-1 font-semibold">
                    BANCO ALEATORIO
                  </div>
                </button>

                <!-- Tarjeta Turno Actual -->
                <div class="sm:col-span-7 bg-white border-2 border-[#111111] rounded-xl p-3.5 flex flex-col justify-center text-left shadow-xs">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] font-extrabold tracking-[0.14em] uppercase px-2 py-0.5 rounded bg-[#FEF5C8] text-[#111111] border border-[#F4D03F]">
                      TURNO ACTUAL
                    </span>
                    <span class="text-[10px] font-bold text-[#111111]">
                      ${currentPlayer.points} pts
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mb-2">
                    <div
                      class="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                      style="border-color: #111111; background-color: #FEF5C8; color: #111111;"
                    >
                      ${getIcon(currentPlayer.token.icon, 'w-5 h-5')}
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-base text-[#111111] truncate">
                        ${currentPlayer.name}
                      </div>
                      <div class="text-xs text-[#4A4A4A] truncate">
                        ${currentPlayer.token.name}
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-[#4A4A4A] space-y-0.5 border-t border-neutral-100 pt-1.5">
                    <div class="font-bold text-[#111111]">
                      Casilla ${currentTile.displayNum} · ${currentTile.name}
                    </div>
                    <div class="text-[11px] text-[#4A4A4A]">
                      ${statusLine}
                    </div>
                  </div>
                </div>
              </div>
            `
        }

        <!-- Zona de Dados Virtuales (1 al 6) -->
        <div class="flex flex-col items-center gap-2 my-0.5">
          <div class="flex flex-wrap items-center justify-center gap-3.5">
            <div
              data-action="roll-dice"
              class="flex items-center gap-2 cursor-pointer"
              title="Haz clic sobre los dados para lanzar"
            >
              ${renderDieFace(dieA, state.isRolling, false)}
              ${renderDieFace(dieB, state.isRolling, true)}
            </div>

            <div class="text-left">
              <div class="font-extrabold text-base text-[#111111]">
                ${
                  state.isRolling
                    ? 'Lanzando...'
                    : state.lastRoll
                    ? `${state.lastRoll} ${state.lastRoll === 1 ? 'casilla' : 'casillas'}`
                    : 'Listo para tirar'
                }
              </div>
              <div class="text-xs text-[#4A4A4A]">
                ${
                  state.lastRoll
                    ? `Última tirada de ${state.lastRollerName}`
                    : `Turno de ${currentPlayer.name.split(' ')[0]}`
                }
              </div>
            </div>

            <button
              type="button"
              data-action="roll-dice"
              ${state.isRolling || state.isMovingToken ? 'disabled' : ''}
              class="px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer border-2 border-[#111111] ${
                state.phase === 'AWAITING_ROLL'
                  ? 'bg-[#F4D03F] hover:bg-[#FFD700] text-[#111111]'
                  : 'bg-[#111111] hover:bg-[#1F1F1F] text-[#FFD700]'
              }"
            >
              <span>${
                currentPlayer.skipTurns > 0 ? 'Ceder Turno' : '🎲 Lanzar Dado'
              }</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderBoardGrid(state) {
    const currentPlayer = state.players[state.turnIndex] || state.players[0];
    const currentTile = BOARD_TILES[currentPlayer ? currentPlayer.position : 0];

    return `
      <div class="lex-board-viewport">
        <div class="lex-board-grid">
          ${BOARD_TILES.map((tile) =>
            renderSingleTile(tile, state, currentPlayer)
          ).join('')}
          ${renderBoardCenter(state, currentPlayer, currentTile)}
        </div>
      </div>
    `;
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.renderBoardGrid = renderBoardGrid;
})(window);
