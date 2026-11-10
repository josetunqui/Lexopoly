/**
 * ============================================================================
 * LEXOPOLY — CONTROLADOR PRINCIPAL DE LA SPA E INTERACCIÓN (app.js)
 * ============================================================================
 * - Sin barra superior de depuración/navegación de vistas.
 * - Nombres y fichas configurables únicamente en la Sala Inicial antes de jugar,
 *   o al reiniciar la partida.
 */
(function (global) {
  'use strict';

  const {
    store,
    sound,
    getIcon,
    renderMenuView,
    renderBoardGrid,
    renderSidebarView,
    renderQuestionModal,
    renderVictoryModal,
    renderRulesModal,
    renderCodexModal
  } = global.Lexopoly;

  function renderMainHeader(state) {
    const currentPlayer = state.players[state.turnIndex] || state.players[0];

    return `
      <header class="bg-white border-b-2 border-[#111111] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <!-- Marca Oficial El Correcaminos Jurídico -->
        <div class="flex items-center gap-3 select-none">
          <img
            src="./assets/logo.jpg?v=2"
            alt="Logo Oficial El Correcaminos Jurídico"
            class="w-10 h-10 lex-crest-img rounded-full border-2 border-[#111111] bg-white p-0.5 shadow-2xs"
            onerror="this.style.display='none'"
          />
          <span class="font-serif-lex text-xl sm:text-2xl text-[#111111] font-bold tracking-tight">
            El Correcaminos Jurídico
          </span>
        </div>

        <!-- Controles derechos -->
        <div class="flex items-center gap-2.5 sm:gap-3">
          ${
            state.currentView === 'board'
              ? `
                <button
                  type="button"
                  data-action="restart-match"
                  class="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#1F1F1F] border-2 border-[#111111] text-[#FFD700] font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                  title="Reiniciar la partida para volver a configurar jugadores"
                >
                  <span>↺ Reiniciar Partida</span>
                </button>
              `
              : `
                <span class="text-xs text-[#4A4A4A] font-medium hidden md:inline">
                  Medidas Cautelares y Proceso Único de Ejecución
                </span>
              `
          }

          <button
            type="button"
            data-action="open-codex"
            class="px-3 py-1.5 rounded-full bg-[#FEF5C8] hover:bg-[#F4D03F] border-2 border-[#111111] text-[#111111] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Consultar Glosario Procesal Civil"
          >
            <span>📖</span>
            <span class="hidden sm:inline">Glosario</span>
          </button>

          <button
            type="button"
            data-action="toggle-sound"
            class="w-8 h-8 rounded-full border-2 border-[#111111] hover:bg-[#FEF5C8] flex items-center justify-center text-[#111111] transition cursor-pointer"
            title="${sound.enabled ? 'Sonido activado (clic para silenciar)' : 'Sonido silenciado'}"
          >
            ${getIcon(sound.enabled ? 'volumeOn' : 'volumeOff', 'w-4 h-4')}
          </button>

          <button
            type="button"
            data-action="open-rules"
            class="w-8 h-8 rounded-full border-2 border-[#111111] hover:bg-[#FEF5C8] flex items-center justify-center text-[#111111] font-extrabold text-xs transition cursor-pointer"
            title="Reglas del juego"
          >
            ?
          </button>

          ${
            state.currentView === 'board' && currentPlayer
              ? `
                <div
                  class="w-9 h-9 rounded-full bg-[#111111] border-2 border-[#F4D03F] text-[#FFD700] font-extrabold text-xs flex items-center justify-center"
                  title="Turno actual: ${currentPlayer.name}"
                >
                  ${currentPlayer.initials}
                </div>
              `
              : ''
          }
        </div>
      </header>
    `;
  }

  function renderBoardScreen(state) {
    const currentPlayer = state.players[state.turnIndex] || state.players[0];
    const stepInstruction =
      state.phase === 'AWAITING_ROLL'
        ? `🎲 Turno de ${currentPlayer.name}: Lanza los dados para avanzar`
        : state.phase === 'MOVING'
        ? `🚶 Desplazando la ficha de ${currentPlayer.name}...`
        : `⚖️ Turno de ${currentPlayer.name}: Responde la pregunta asignada`;

    return `
      <main class="max-w-[1380px] mx-auto px-4 sm:px-8 py-5">
        <!-- Subcabecera de la Mesa de Juego con Guía del Turno Actual -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="font-serif-lex text-2xl sm:text-3xl text-[#111111] font-bold">
              Tablero de Juego
            </h1>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-[#FFD700] text-xs font-bold border border-[#F4D03F]">
              <span class="w-2 h-2 rounded-full bg-[#FFD700] animate-ping"></span>
              <span>${stepInstruction}</span>
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs text-[#4A4A4A] font-medium">
            <span>
              Ronda ${String(state.round).padStart(2, '0')} de ${String(state.maxRounds).padStart(
      2,
      '0'
    )}
            </span>
            <span>·</span>
            <span id="lex-elapsed-clock">
              ${store.formatTime(state.elapsedSeconds)} transcurridos
            </span>
          </div>
        </div>

        <!-- Layout Principal: Tablero 9x9 (Izquierda) + Panel Lateral de Jugadores y Turno (Derecha) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div class="lg:col-span-8 flex justify-center">
            ${renderBoardGrid(state)}
          </div>
          <div class="lg:col-span-4">
            ${renderSidebarView(state)}
          </div>
        </div>
      </main>
    `;
  }

  function renderFooter(state) {
    return `
      <footer class="border-t-2 border-[#111111] bg-[#111111] text-neutral-300 px-4 sm:px-8 py-3.5 text-xs flex flex-wrap items-center justify-between gap-3 mt-auto">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#FFD700]"></span>
          <span>El Correcaminos Jurídico · Derecho Procesal Civil (Medidas Cautelares y Proceso Único de Ejecución)</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            data-action="open-rules"
            class="hover:text-[#FFD700] transition cursor-pointer font-semibold"
          >
            Reglas del Juego
          </button>
          <span>·</span>
          <button
            type="button"
            data-action="open-codex"
            class="hover:text-[#FFD700] transition cursor-pointer font-semibold"
          >
            Glosario Procesal
          </button>
          ${
            state.currentView === 'board'
              ? `
                <span>·</span>
                <button
                  type="button"
                  data-action="save-and-exit"
                  class="text-[#FFD700] hover:underline transition cursor-pointer font-bold"
                >
                  Guardar y Salir
                </button>
              `
              : ''
          }
        </div>
      </footer>
    `;
  }

  function renderToast(state) {
    if (!state.toastMessage) return '';
    return `
      <div class="fixed bottom-5 right-5 z-50 max-w-sm bg-[#111111] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-[#FFD700] flex items-center gap-3 text-xs font-semibold animate-fadeIn">
        <span class="w-2.5 h-2.5 rounded-full bg-[#FFD700] shrink-0"></span>
        <span>${state.toastMessage}</span>
      </div>
    `;
  }

  function renderCelebrationParticles(state) {
    if (!state.celebrationBurst) return '';
    const pieces = Array.from({ length: 22 }).map((_, idx) => {
      const left = 8 + ((idx * 4.1) % 84);
      const delay = (idx % 6) * 0.06;
      const bg = idx % 2 === 0 ? '#FFD700' : idx % 3 === 0 ? '#111111' : '#1E7E48';
      return `<span class="lex-confetti-piece" style="left:${left}%; animation-delay:${delay}s; background:${bg};"></span>`;
    });
    return `<div class="lex-confetti-layer">${pieces.join('')}</div>`;
  }

  function renderApp() {
    const root = document.getElementById('app') || document.getElementById('app-root');
    if (!root) return;

    // Preservar foco y posición del cursor si el usuario está escribiendo un nombre en la sala de inicio
    const activeEl = document.activeElement;
    const activeSlotInput = activeEl ? activeEl.getAttribute('data-slot-name-index') : null;
    const activeCodexSearch = activeEl && activeEl.id === 'lex-codex-search-input';
    const selStart = activeEl && typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null;
    const selEnd = activeEl && typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null;

    const state = store.state;
    const menuConfig = store.menuConfig;

    let mainViewHtml = '';
    if (state.currentView === 'menu') {
      mainViewHtml = renderMenuView(state, menuConfig);
    } else {
      mainViewHtml = renderBoardScreen(state);
    }

    root.innerHTML = `
      <div class="min-h-screen flex flex-col">
        ${renderMainHeader(state)}
        <div class="flex-1">
          ${mainViewHtml}
        </div>
        ${renderFooter(state)}
        ${renderQuestionModal(state)}
        ${renderVictoryModal(state)}
        ${renderRulesModal(state)}
        ${renderCodexModal(state)}
        ${renderToast(state)}
        ${renderCelebrationParticles(state)}
      </div>
    `;

    // Restaurar foco del input activo si corresponde
    if (activeSlotInput !== null) {
      const el = document.querySelector(`[data-slot-name-index="${activeSlotInput}"]`);
      if (el) {
        el.focus();
        if (selStart !== null) el.setSelectionRange(selStart, selEnd);
      }
    } else if (activeCodexSearch) {
      const el = document.getElementById('lex-codex-search-input');
      if (el) {
        el.focus();
        if (selStart !== null) el.setSelectionRange(selStart, selEnd);
      }
    }
  }

  function setupEventDelegation() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');

      switch (action) {
        case 'restart-match': {
          store.setView('menu');
          store.showToast('Partida reiniciada. Ahora puedes configurar los jugadores.');
          break;
        }
        case 'select-mode': {
          const mode = target.getAttribute('data-mode');
          store.setGameMode(mode);
          break;
        }
        case 'set-player-count': {
          const count = Number(target.getAttribute('data-count'));
          store.setPlayerCount(count);
          break;
        }
        case 'cycle-slot-token': {
          const idx = Number(target.getAttribute('data-slot-index'));
          store.cycleSlotToken(idx);
          break;
        }
        case 'toggle-slot-bot': {
          const idx = Number(target.getAttribute('data-slot-index'));
          store.toggleSlotBot(idx);
          break;
        }
        case 'set-timer-seconds': {
          const sec = Number(target.getAttribute('data-seconds'));
          store.setTimerSeconds(sec);
          break;
        }
        case 'set-target-points': {
          const pts = Number(target.getAttribute('data-points'));
          store.setTargetPoints(pts);
          break;
        }
        case 'use-fifty-fifty': {
          store.useFiftyFiftyLifeline();
          break;
        }
        case 'use-extra-time': {
          store.useExtraTimeLifeline();
          break;
        }
        case 'start-new-game': {
          store.startNewGame();
          break;
        }
        case 'restore-saved-match': {
          store.loadSavedMatch();
          break;
        }
        case 'save-and-exit': {
          store.saveMatchToStorage();
          store.setView('menu');
          break;
        }
        case 'open-rules': {
          store.toggleRulesModal(true);
          break;
        }
        case 'close-rules': {
          store.toggleRulesModal(false);
          break;
        }
        case 'open-codex': {
          store.state.rulesModalOpen = false;
          store.toggleCodexModal(true);
          break;
        }
        case 'close-codex': {
          store.toggleCodexModal(false);
          break;
        }
        case 'toggle-sound': {
          sound.toggleMute();
          renderApp();
          break;
        }
        case 'roll-dice': {
          store.rollDice();
          break;
        }
        case 'open-question-modal': {
          store.openQuestionModal();
          break;
        }
        case 'toggle-minimize-modal': {
          store.toggleMinimizeQuestionModal();
          break;
        }
        case 'toggle-pause-timer': {
          store.togglePauseQuestionTimer();
          break;
        }
        case 'select-option': {
          const opt = target.getAttribute('data-option');
          store.selectOption(opt);
          break;
        }
        case 'eliminate-option': {
          e.stopPropagation();
          const opt = target.getAttribute('data-option');
          store.toggleEliminateOption(opt);
          break;
        }
        case 'confirm-answer': {
          store.confirmAnswer();
          break;
        }
        case 'apply-evaluation': {
          store.applyEvaluationAndContinue();
          break;
        }
        case 'inspect-tile': {
          const tileId = Number(target.getAttribute('data-tile-id'));
          store.inspectTile(tileId);
          break;
        }
        case 'close-tile-inspector': {
          store.inspectTile(null);
          break;
        }
        case 'close-victory-modal': {
          store.state.victoryModalOpen = false;
          store.notify();
          break;
        }
        default:
          break;
      }
    });

    // Inputs dinámicos (nombres de jugadores en Sala de Inicio y búsqueda en Glosario)
    document.addEventListener('input', (e) => {
      // 1. Nombres de jugadores en la Sala de Inicio (únicamente antes de iniciar la partida)
      const slotIdxAttr = e.target.getAttribute('data-slot-name-index');
      if (slotIdxAttr !== null && store.state.currentView === 'menu') {
        const idx = Number(slotIdxAttr);
        store.setSlotName(idx, e.target.value);
        return;
      }

      // 2. Búsqueda en el Códice / Glosario Jurídico
      if (e.target && e.target.id === 'lex-codex-search-input') {
        store.state.codexSearchQuery = e.target.value;
        renderApp();
      }
    });

    // Atajos de teclado intuitivos durante la partida
    document.addEventListener('keydown', (e) => {
      const state = store.state;
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT'
      ) {
        return;
      }

      if (state.questionModalOpen && !state.questionModalMinimized) {
        const keyUpper = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(keyUpper) && !state.evaluationResult) {
          e.preventDefault();
          store.selectOption(keyUpper);
        } else if (e.key === '1' && !state.evaluationResult) {
          e.preventDefault();
          store.selectOption('A');
        } else if (e.key === '2' && !state.evaluationResult) {
          e.preventDefault();
          store.selectOption('B');
        } else if (e.key === '3' && !state.evaluationResult) {
          e.preventDefault();
          store.selectOption('C');
        } else if (e.key === '4' && !state.evaluationResult) {
          e.preventDefault();
          store.selectOption('D');
        } else if (keyUpper === 'P' && !state.evaluationResult) {
          e.preventDefault();
          store.togglePauseQuestionTimer();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (!state.evaluationResult && state.selectedOption) {
            store.confirmAnswer();
          } else if (state.evaluationResult) {
            store.applyEvaluationAndContinue();
          }
        }
        return;
      }

      if (state.currentView === 'board' && !state.questionModalOpen && !state.victoryModalOpen) {
        if (e.code === 'Space') {
          e.preventDefault();
          if (state.phase === 'AWAITING_CASE') {
            store.openQuestionModal();
          } else {
            store.rollDice();
          }
        }
      }
    });
  }

  function initApp() {
    store.subscribe(() => {
      renderApp();
    });
    setupEventDelegation();
    renderApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(window);
