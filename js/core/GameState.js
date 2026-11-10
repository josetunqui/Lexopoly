/**
 * ============================================================================
 * LEXOPOLY — GESTOR CENTRAL DE ESTADO (EXPERIENCIA COMPLETA LISTA PARA JUGAR)
 * ============================================================================
 * Incluye:
 * - Sala de Jugadores completa (Nombres editables, Ficha individual por jugador,
 *   Oponentes Humanos o Bots Jurídicos IA, Meta de puntos y Tiempo por turno).
 * - Edición de nombres de jugadores en vivo durante la partida.
 * - Comodines / Recursos Procesales por jugador (50/50 y Prórroga +20s).
 * - Rachas de aciertos ("Racha Jurisprudencial 🔥") y Rangos Académicos.
 * - Inteligencia Artificial para turnos automáticos de Bots Jurídicos.
 */
(function (global) {
  'use strict';

  const { BOARD_TILES, PLAYER_TOKENS, QUESTIONS_BANK, SanctionsEngine, sound } = global.Lexopoly;
  const STORAGE_KEY = 'lexopoly_saved_match_v3';
  const CUSTOM_CASES_KEY = 'lexopoly_custom_cases_v3';

  class GameState {
    constructor() {
      this.listeners = [];
      this.usedQuestionIds = new Set();
      this.randomDeck = [];
      this.timerInterval = null;
      this.elapsedGameInterval = null;
      this.toastTimeout = null;
      this.botTimeouts = [];

      this._loadCustomCasesFromStorage();

      // Configuración completa y visible en la Sala de Inicio (Pantalla 01)
      this.menuConfig = {
        mode: 'clasico', // 'clasico' | 'practica' | 'duelo'
        playerCount: 3,
        targetCircuits: 1,
        targetPoints: 200,
        maxRounds: 12,
        timerSeconds: 30,
        slots: [
          { name: 'Bryan Pulpin Salado', tokenIndex: 0, isBot: false },
          { name: 'Kevin Coco Cuadrado', tokenIndex: 1, isBot: false },
          { name: 'Taylor Poco Tirado', tokenIndex: 2, isBot: false },
          { name: 'Sneider Paco Duro', tokenIndex: 3, isBot: true }
        ]
      };

      // Estado general de la SPA
      this.state = {
        currentView: 'menu', // 'menu' | 'board' | 'design'
        matchId: 'LEX-024',
        mode: 'clasico',
        modeLabel: 'Modo clásico',
        round: 1,
        maxRounds: 12,
        elapsedSeconds: 0,
        turnIndex: 0,
        phase: 'AWAITING_ROLL', // 'AWAITING_ROLL' | 'MOVING' | 'AWAITING_CASE' | 'IN_QUESTION' | 'GAME_OVER'
        isRolling: false,
        isMovingToken: false,
        lastRoll: null,
        lastDicePair: [2, 3],
        lastRollerName: 'Ana',
        steppingTileId: null,
        selectedTileInspectorId: null,
        editingPlayerId: null,
        toastMessage: null,
        celebrationBurst: false,

        // Controles de manipulación gráfica del tablero 9x9
        boardBranchFilter: 'ALL',
        boardScale: 1,
        showPathPreview: true,
        sandboxMode: false,

        // Jugadores activos
        players: [],

        // Caso jurídico pendiente o activo en el turno actual
        activeQuestion: null,
        questionModalOpen: false,
        questionModalMinimized: false,
        questionTimerRemaining: 30,
        questionTimerTotal: 30,
        questionTimerPaused: false,
        selectedOption: null,
        eliminatedOptions: [],
        showDoctrineHint: false,
        evaluationResult: null,

        // Modales informativos, Códice y Victoria
        rulesModalOpen: false,
        codexModalOpen: false,
        codexSearchQuery: '',
        victoryModalOpen: false,
        winner: null,
        victoryReason: '',

        // Bitácora procesal (Últimos movimientos)
        logs: []
      };

      this._initDemoMatchState();
      this._startElapsedClock();
    }

    static getPlayerRank(points) {
      if (points >= 180) return { title: 'Magistrado Supremo', icon: '👑' };
      if (points >= 120) return { title: 'Abogado Litigante', icon: '⚖️' };
      if (points >= 60) return { title: 'Pasante Judicial', icon: '📜' };
      return { title: 'Estudiante de Derecho', icon: '🎓' };
    }

    _clearBotTimeouts() {
      this.botTimeouts.forEach((t) => clearTimeout(t));
      this.botTimeouts = [];
    }

    _scheduleBotAction(fn, delayMs) {
      const id = setTimeout(fn, delayMs);
      this.botTimeouts.push(id);
      return id;
    }

    _loadCustomCasesFromStorage() {
      try {
        const raw = localStorage.getItem(CUSTOM_CASES_KEY);
        if (!raw) return;
        const customList = JSON.parse(raw);
        if (Array.isArray(customList)) {
          customList.forEach((c) => {
            if (c && c.id && !QUESTIONS_BANK.some((q) => q.id === c.id)) {
              QUESTIONS_BANK.unshift(c);
            }
          });
        }
      } catch (e) {
        // Ignore storage errors
      }
    }

    addCustomCase(caseData) {
      const id = `USR-${String(QUESTIONS_BANK.length + 1).padStart(3, '0')}`;
      const branchMap = {
        CIVIL: 'DERECHO CIVIL · CASO PERSONALIZADO',
        PENAL: 'DERECHO PENAL · CASO PERSONALIZADO',
        CONSTITUCIONAL: 'DERECHO CONSTITUCIONAL · CASO PERSONALIZADO',
        ADMINISTRATIVO: 'DERECHO ADMINISTRATIVO · CASO PERSONALIZADO'
      };
      const newCase = {
        id,
        category: caseData.category || 'CIVIL',
        branchLabel: branchMap[caseData.category] || 'DERECHO · CASO PERSONALIZADO',
        title: caseData.title || 'Caso Práctico Académico',
        caseText: caseData.caseText || '',
        questionPrompt: caseData.questionPrompt || '¿Cuál es la solución jurídica aplicable?',
        options: {
          A: caseData.optionA || 'Opción A',
          B: caseData.optionB || 'Opción B',
          C: caseData.optionC || 'Opción C',
          D: caseData.optionD || 'Opción D'
        },
        correctOption: caseData.correctOption || 'B',
        rewardPoints: 35,
        advanceSteps: 3,
        penaltyType: caseData.penaltyType || 'RETROCESO',
        penaltySteps: 1,
        penaltyTitle:
          caseData.penaltyType === 'PERDIDA_TURNO'
            ? 'Sanción Procesal: Recurso Improcedente (Pierdes el próximo turno)'
            : 'Sanción Procesal: Defecto Procesal (Retrocedes 1 casilla)',
        feedbackCorrect:
          caseData.feedback ||
          'Argumento jurídico correcto conforme a los principios rectores de la materia.',
        feedbackWrong:
          caseData.feedback ||
          'El criterio seleccionado no se ajusta a la norma aplicable al supuesto de hecho.',
        legalCitation: caseData.legalCitation || 'Jurisprudencia y Doctrina Académica Lexopoly.'
      };

      QUESTIONS_BANK.unshift(newCase);
      try {
        const raw = localStorage.getItem(CUSTOM_CASES_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(newCase);
        localStorage.setItem(CUSTOM_CASES_KEY, JSON.stringify(list));
      } catch (e) {
        // Ignore storage errors
      }

      this.showToast(`Caso ${id} ("${newCase.title}") añadido al banco de datos.`);
      this.notify();
      return newCase;
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      };
    }

    notify() {
      this.listeners.forEach((listener) => {
        try {
          listener(this.state);
        } catch (err) {
          console.error('Error en listener de GameState:', err);
        }
      });
    }

    showToast(message, durationMs = 3400) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.state.toastMessage = message;
      this.notify();
      this.toastTimeout = setTimeout(() => {
        this.state.toastMessage = null;
        this.notify();
      }, durationMs);
    }

    triggerCelebration() {
      this.state.celebrationBurst = true;
      this.notify();
      setTimeout(() => {
        this.state.celebrationBurst = false;
        this.notify();
      }, 1800);
    }

    hasSavedMatch() {
      try {
        return Boolean(localStorage.getItem(STORAGE_KEY));
      } catch (e) {
        return false;
      }
    }

    saveMatchToStorage() {
      try {
        const snapshot = {
          matchId: this.state.matchId,
          mode: this.state.mode,
          modeLabel: this.state.modeLabel,
          round: this.state.round,
          maxRounds: this.state.maxRounds,
          elapsedSeconds: this.state.elapsedSeconds,
          turnIndex: this.state.turnIndex,
          phase: this.state.phase === 'IN_QUESTION' ? 'AWAITING_CASE' : this.state.phase,
          lastRoll: this.state.lastRoll,
          lastDicePair: this.state.lastDicePair,
          lastRollerName: this.state.lastRollerName,
          players: this.state.players,
          activeQuestion: this.state.activeQuestion,
          logs: this.state.logs
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        this.showToast('Partida guardada en el navegador. Puedes reanudarla cuando quieras.');
        return true;
      } catch (e) {
        return false;
      }
    }

    loadSavedMatch() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        this._stopQuestionTimer();
        this._clearBotTimeouts();
        Object.assign(this.state, {
          ...data,
          currentView: 'board',
          questionModalOpen: false,
          questionModalMinimized: false,
          selectedOption: null,
          eliminatedOptions: [],
          evaluationResult: null,
          isRolling: false,
          isMovingToken: false
        });
        this.showToast(`Partida ${this.state.matchId} restaurada (Ronda ${this.state.round}).`);
        this.notify();
        this._checkAndRunBotTurn();
        return true;
      } catch (e) {
        return false;
      }
    }

    _startElapsedClock() {
      if (this.elapsedGameInterval) clearInterval(this.elapsedGameInterval);
      this.elapsedGameInterval = setInterval(() => {
        if (this.state.currentView === 'board' && !this.state.victoryModalOpen) {
          this.state.elapsedSeconds += 1;
          const clockEl = document.getElementById('lex-elapsed-clock');
          if (clockEl) {
            clockEl.textContent = `${this.formatTime(this.state.elapsedSeconds)} transcurridos`;
          }
        }
      }, 1000);
    }

    formatTime(totalSec) {
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    _computeInitials(fullName) {
      const clean = (fullName || 'Jugador').trim();
      const parts = clean.split(/\s+/);
      return parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : clean.slice(0, 2).toUpperCase();
    }

    /**
     * Inicializa el estado de demostración con selección aleatoria del banco de 31 preguntas
     */
    _initDemoMatchState() {
      const randomInitialQuestion = this._pickQuestionForTile();

      this.state.players = [
        {
          id: 'p1',
          name: 'Ana Vargas',
          initials: 'AV',
          token: PLAYER_TOKENS[0],
          isBot: false,
          position: 6, // Casilla 07 (ID 6): Prueba
          points: 120,
          circuits: 0,
          streak: 2,
          lifelines: { fiftyFifty: 2, extraTime: 2 },
          skipTurns: 0,
          activeSanction: null,
          sanctionHistory: [],
          correctCount: 4,
          wrongCount: 0
        },
        {
          id: 'p2',
          name: 'Mateo Ruiz',
          initials: 'MR',
          token: PLAYER_TOKENS[1],
          isBot: false,
          position: 11, // Casilla 12 (ID 11): Argumentación
          points: 90,
          circuits: 0,
          streak: 1,
          lifelines: { fiftyFifty: 2, extraTime: 2 },
          skipTurns: 0,
          activeSanction: null,
          sanctionHistory: [],
          correctCount: 3,
          wrongCount: 1
        },
        {
          id: 'p3',
          name: 'Lucía Torres',
          initials: 'LT',
          token: PLAYER_TOKENS[2],
          isBot: false,
          position: 28, // Casilla 29 (ID 28): Defensa
          points: 75,
          circuits: 0,
          streak: 0,
          lifelines: { fiftyFifty: 2, extraTime: 2 },
          skipTurns: 0,
          activeSanction: null,
          sanctionHistory: [],
          correctCount: 2,
          wrongCount: 1
        }
      ];

      this.state.turnIndex = 0;
      this.state.round = 4;
      this.state.maxRounds = 12;
      this.state.elapsedSeconds = 768;
      this.state.lastRoll = 5;
      this.state.lastDicePair = [2, 3];
      this.state.lastRollerName = 'Ana';
      this.state.phase = 'AWAITING_CASE';
      this.state.activeQuestion = randomInitialQuestion;
      this.state.questionModalOpen = false;
      this.state.questionModalMinimized = false;
      this.state.selectedOption = null;
      this.state.eliminatedOptions = [];
      this.state.evaluationResult = null;
      this.state.logs = [
        'Ana llegó a Prueba con una tirada de 5.',
        'Mateo sumó 30 puntos en Argumentación.',
        'Lucía completó su turno en Defensa.'
      ];
    }

    /**
     * Inicia una nueva partida lista para jugar desde la Casilla 01 · Salida
     * usando todos los nombres, fichas, bots y reglas definidos en la pantalla de Inicio.
     */
    startNewGame() {
      this._stopQuestionTimer();
      this._clearBotTimeouts();

      const mode = this.menuConfig.mode;
      let playerCount = this.menuConfig.playerCount || 3;
      let modeLabel = 'Modo clásico';

      if (mode === 'practica') {
        playerCount = 1;
        modeLabel = 'Práctica individual';
      } else if (mode === 'duelo') {
        playerCount = 2;
        modeLabel = 'Duelo jurídico';
      } else {
        playerCount = Math.min(4, Math.max(2, playerCount));
        modeLabel = 'Modo clásico';
      }

      const players = [];
      for (let i = 0; i < playerCount; i++) {
        const slot = this.menuConfig.slots[i] || {
          name: `Jugador ${i + 1}`,
          tokenIndex: i % PLAYER_TOKENS.length,
          isBot: false
        };
        const cleanName = (slot.name || `Jugador ${i + 1}`).trim() || `Jugador ${i + 1}`;
        const tokenObj = PLAYER_TOKENS[slot.tokenIndex % PLAYER_TOKENS.length] || PLAYER_TOKENS[i];

        players.push({
          id: `p${i + 1}`,
          name: cleanName,
          initials: this._computeInitials(cleanName),
          token: tokenObj,
          isBot: mode === 'practica' ? false : Boolean(slot.isBot),
          position: 0, // Casilla 00 (01 · Salida)
          points: 0,
          circuits: 0,
          streak: 0,
          lifelines: { fiftyFifty: 2, extraTime: 2 },
          skipTurns: 0,
          activeSanction: null,
          sanctionHistory: [],
          correctCount: 0,
          wrongCount: 0
        });
      }

      this.usedQuestionIds.clear();
      this._shuffleQuestionDeck();
      this.state.matchId = `LEX-${String(Math.floor(100 + Math.random() * 899))}`;
      this.state.mode = mode;
      this.state.modeLabel = modeLabel;
      this.state.players = players;
      this.state.turnIndex = 0;
      this.state.round = 1;
      this.state.maxRounds = mode === 'duelo' ? 8 : 12;
      this.state.elapsedSeconds = 0;
      this.state.lastRoll = null;
      this.state.lastDicePair = [1, 1];
      this.state.lastRollerName = players[0].name.split(' ')[0];
      this.state.phase = 'AWAITING_ROLL';
      this.state.activeQuestion = null;
      this.state.questionModalOpen = false;
      this.state.questionModalMinimized = false;
      this.state.selectedOption = null;
      this.state.eliminatedOptions = [];
      this.state.evaluationResult = null;
      this.state.victoryModalOpen = false;
      this.state.winner = null;
      this.state.editingPlayerId = null;
      this.state.logs = [
        `¡Partida ${this.state.matchId} iniciada! Meta: ${this.menuConfig.targetPoints} puntos o completar circuito.`,
        `Turno de ${players[0].name} en Casilla 01 · Salida. ¡Lanza los dados!`
      ];
      this.state.currentView = 'board';
      this.showToast(`¡Partida iniciada! Turno de ${players[0].name}.`);
      this.notify();
      this._checkAndRunBotTurn();
    }

    loadDemoScenario(openModalImmediately = false) {
      this._stopQuestionTimer();
      this._clearBotTimeouts();
      this._initDemoMatchState();
      this.state.currentView = 'board';
      if (openModalImmediately) {
        this.openQuestionModal();
      } else {
        this.notify();
      }
    }

    setView(viewName) {
      if (viewName !== 'board') {
        this._stopQuestionTimer();
        this._clearBotTimeouts();
        this.state.questionModalOpen = false;
        this.state.questionModalMinimized = false;
      }
      this.state.currentView = viewName;
      this.notify();
    }

    // ==================== CONFIGURACIÓN EN LA SALA DE JUGADORES ====================
    setGameMode(mode) {
      this.menuConfig.mode = mode;
      if (mode === 'practica') {
        this.menuConfig.playerCount = 1;
      } else if (mode === 'duelo') {
        this.menuConfig.playerCount = 2;
      } else if (this.menuConfig.playerCount < 2) {
        this.menuConfig.playerCount = 3;
      }
      this.notify();
    }

    setPlayerCount(count) {
      this.menuConfig.playerCount = Math.min(4, Math.max(1, Number(count) || 2));
      if (this.menuConfig.playerCount === 1) {
        this.menuConfig.mode = 'practica';
      } else if (this.menuConfig.mode === 'practica') {
        this.menuConfig.mode = 'clasico';
      }
      this.notify();
    }

    setSlotName(index, newName) {
      if (this.menuConfig.slots[index]) {
        this.menuConfig.slots[index].name = newName;
      }
    }

    cycleSlotToken(index) {
      if (this.menuConfig.slots[index]) {
        this.menuConfig.slots[index].tokenIndex =
          (this.menuConfig.slots[index].tokenIndex + 1) % PLAYER_TOKENS.length;
        this.notify();
      }
    }

    toggleSlotBot(index) {
      if (this.menuConfig.slots[index]) {
        const slot = this.menuConfig.slots[index];
        slot.isBot = !slot.isBot;
        if (slot.isBot && !slot.name.includes('IA') && !slot.name.includes('Bot')) {
          slot.name = `${slot.name.split(' ')[0]} (Bot IA)`;
        } else if (!slot.isBot) {
          slot.name = slot.name.replace(/\s*\(Bot IA\)|\s*\(IA\)/gi, '');
        }
        this.notify();
      }
    }

    setTargetPoints(points) {
      this.menuConfig.targetPoints = Number(points) || 200;
      this.notify();
    }

    setTimerSeconds(sec) {
      this.menuConfig.timerSeconds = Number(sec);
      this.notify();
    }

    // ==================== EDICIÓN DE JUGADORES EN VIVO DURANTE LA PARTIDA ====================
    toggleEditPlayerInGame(playerId) {
      this.state.editingPlayerId =
        this.state.editingPlayerId === playerId ? null : playerId;
      this.notify();
    }

    renamePlayerInGame(playerId, newName) {
      const p = this.state.players.find((pl) => pl.id === playerId);
      if (p) {
        const clean = (newName || '').trim() || p.name;
        p.name = clean;
        p.initials = this._computeInitials(clean);
      }
    }

    cyclePlayerTokenInGame(playerId) {
      const p = this.state.players.find((pl) => pl.id === playerId);
      if (p) {
        const currentIdx = PLAYER_TOKENS.findIndex((t) => t.id === p.token.id);
        p.token = PLAYER_TOKENS[(currentIdx + 1) % PLAYER_TOKENS.length];
        this.notify();
      }
    }

    togglePlayerBotInGame(playerId) {
      const p = this.state.players.find((pl) => pl.id === playerId);
      if (p) {
        p.isBot = !p.isBot;
        this.showToast(
          p.isBot
            ? `${p.name} ahora es controlado por la IA Jurídica.`
            : `${p.name} ahora es controlado por un jugador humano.`
        );
        this.notify();
        this._checkAndRunBotTurn();
      }
    }

    // ==================== COMODINES / RECURSOS PROCESALES ====================
    useFiftyFiftyLifeline() {
      if (!this.state.questionModalOpen || this.state.evaluationResult) return;
      const player = this.getCurrentPlayer();
      const question = this.state.activeQuestion;
      if (!player || !question) return;

      if (!player.lifelines || player.lifelines.fiftyFifty <= 0) {
        this.showToast('Ya agotaste tus recursos de Descarte 50/50 en esta partida.');
        return;
      }

      const wrongKeys = ['A', 'B', 'C', 'D'].filter(
        (k) => k !== question.correctOption && !this.state.eliminatedOptions.includes(k)
      );
      if (wrongKeys.length === 0) return;

      player.lifelines.fiftyFifty -= 1;
      // Mezclar y eliminar hasta 2 opciones incorrectas
      const shuffled = wrongKeys.sort(() => Math.random() - 0.5).slice(0, 2);
      shuffled.forEach((k) => {
        if (!this.state.eliminatedOptions.includes(k)) {
          this.state.eliminatedOptions.push(k);
        }
        if (this.state.selectedOption === k) {
          this.state.selectedOption = null;
        }
      });

      sound.playTokenStep(false);
      this.showToast('⚖️ Descarte 50/50 aplicado: 2 argumentos improcedentes descartados.');
      this.notify();
    }

    useExtraTimeLifeline() {
      if (!this.state.questionModalOpen || this.state.evaluationResult) return;
      const player = this.getCurrentPlayer();
      if (!player || !player.lifelines || player.lifelines.extraTime <= 0) {
        this.showToast('Ya agotaste tus Prórrogas Procesales (+20s) en esta partida.');
        return;
      }

      player.lifelines.extraTime -= 1;
      this.state.questionTimerRemaining += 20;
      this.state.questionTimerTotal += 20;
      sound.playTokenStep(false);
      this.showToast('⏳ Prórroga Procesal concedida: +20 segundos adicionales.');
      this.notify();
    }

    // ==================== CONTROLES DE MANIPULACIÓN DEL TABLERO ====================
    setBoardBranchFilter(filterCode) {
      this.state.boardBranchFilter =
        this.state.boardBranchFilter === filterCode && filterCode !== 'ALL' ? 'ALL' : filterCode;
      this.notify();
    }

    setBoardScale(scaleVal) {
      const clamped = Math.min(1.12, Math.max(0.82, Number(scaleVal) || 1));
      this.state.boardScale = clamped;
      document.documentElement.style.setProperty('--board-scale', String(clamped));
      this.notify();
    }

    togglePathPreview() {
      this.state.showPathPreview = !this.state.showPathPreview;
      this.notify();
    }

    toggleSandboxMode() {
      this.state.sandboxMode = !this.state.sandboxMode;
      this.showToast(
        this.state.sandboxMode
          ? 'Modo Manipulación Libre activado: haz clic en cualquier casilla o elige el dado (1–6).'
          : 'Modo Manipulación Libre desactivado.'
      );
      this.notify();
    }

    movePlayerDirectlyToTile(targetTileId) {
      if (this.state.isRolling || this.state.isMovingToken) return;
      const player = this.getCurrentPlayer();
      const totalTiles = BOARD_TILES.length;
      const currentPos = player.position;
      const forwardSteps = (targetTileId - currentPos + totalTiles) % totalTiles;

      this.state.selectedTileInspectorId = null;

      if (forwardSteps === 0) {
        const tile = BOARD_TILES[targetTileId];
        this.state.activeQuestion = this._pickQuestionForTile(tile);
        this.state.phase = 'AWAITING_CASE';
        this.openQuestionModal();
        return;
      }

      this.animatePlayerMove(player.id, forwardSteps, () => {
        const landedTile = BOARD_TILES[player.position];
        this.addLog(
          `${player.name.split(' ')[0]} se desplazó a ${landedTile.name} (Casilla ${landedTile.displayNum}).`
        );
        this.state.activeQuestion = this._pickQuestionForTile(landedTile);
        this.state.phase = 'AWAITING_CASE';
        this.notify();
        setTimeout(() => {
          this.openQuestionModal();
        }, 300);
      });
    }

    toggleRulesModal(open) {
      this.state.rulesModalOpen = typeof open === 'boolean' ? open : !this.state.rulesModalOpen;
      this.notify();
    }

    toggleCodexModal(open) {
      this.state.codexModalOpen = typeof open === 'boolean' ? open : !this.state.codexModalOpen;
      this.notify();
    }

    getCurrentPlayer() {
      return this.state.players[this.state.turnIndex] || this.state.players[0];
    }

    getCurrentTile() {
      const player = this.getCurrentPlayer();
      return BOARD_TILES[player ? player.position : 0];
    }

    addLog(entry) {
      this.state.logs.unshift(entry);
      if (this.state.logs.length > 14) {
        this.state.logs.pop();
      }
    }

    /**
     * Baraja todas las preguntas del banco con el algoritmo Fisher-Yates
     * para garantizar aparición 100 % aleatoria y sin repeticiones.
     */
    _shuffleQuestionDeck() {
      const pool = QUESTIONS_BANK.filter((q) => !this.usedQuestionIds.has(q.id));
      const source = pool.length > 0 ? [...pool] : [...QUESTIONS_BANK];
      if (pool.length === 0) {
        this.usedQuestionIds.clear();
      }
      for (let i = source.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = source[i];
        source[i] = source[j];
        source[j] = temp;
      }
      this.randomDeck = source;
    }

    _pickQuestionForTile() {
      if (!this.randomDeck || this.randomDeck.length === 0) {
        this._shuffleQuestionDeck();
      }
      const nextQuestion = this.randomDeck.pop() || QUESTIONS_BANK[Math.floor(Math.random() * QUESTIONS_BANK.length)];
      if (nextQuestion && nextQuestion.id) {
        this.usedQuestionIds.add(nextQuestion.id);
      }
      return nextQuestion;
    }

    drawAnotherRandomQuestion() {
      const nextQ = this._pickQuestionForTile();
      this.state.activeQuestion = nextQ;
      this.state.selectedOption = null;
      this.state.eliminatedOptions = [];
      this.state.showDoctrineHint = false;
      this.state.evaluationResult = null;
      const configuredTime = this.menuConfig.timerSeconds;
      const noTimer = configuredTime === 0;
      this.state.questionTimerTotal = noTimer ? 999 : configuredTime || 30;
      this.state.questionTimerRemaining = noTimer ? 999 : configuredTime || 30;
      if (this.state.questionModalOpen && !noTimer) {
        this._startQuestionTimer();
      }
      sound.playTokenStep(false);
      this.showToast(`🎲 Pregunta aleatoria sorteada: ${nextQ.id} (${nextQ.title})`);
      this.notify();
    }

    /**
     * Automatiza el turno si el jugador actual es un Bot IA
     */
    _checkAndRunBotTurn() {
      this._clearBotTimeouts();
      if (this.state.currentView !== 'board' || this.state.victoryModalOpen) return;

      const player = this.getCurrentPlayer();
      if (!player || !player.isBot) return;

      if (this.state.phase === 'AWAITING_ROLL') {
        this._scheduleBotAction(() => {
          if (this.state.currentView === 'board' && this.getCurrentPlayer().isBot) {
            this.rollDice();
          }
        }, 950);
      } else if (this.state.phase === 'AWAITING_CASE' && !this.state.questionModalOpen) {
        this._scheduleBotAction(() => {
          if (this.state.currentView === 'board' && this.getCurrentPlayer().isBot) {
            this.openQuestionModal();
          }
        }, 700);
      }
    }

    /**
     * Lanza el dado virtual (1 al 6)
     */
    rollDice(forcedRollValue = null) {
      if (
        this.state.isRolling ||
        this.state.isMovingToken ||
        this.state.phase === 'IN_QUESTION' ||
        this.state.victoryModalOpen
      ) {
        return;
      }

      const player = this.getCurrentPlayer();

      // Verificar si el jugador tiene una sanción activa de pérdida de turno
      if (player.skipTurns > 0) {
        player.skipTurns -= 1;
        const sanctionText = player.activeSanction || 'Recurso Improcedente';
        player.activeSanction = null;
        sound.playSanction();
        this.addLog(`${player.name} cumple sanción (${sanctionText}) y cede su turno.`);
        this.showToast(`${player.name} cumplió su sanción procesal y cede el turno.`);
        this.advanceToNextTurn();
        return;
      }

      this.state.isRolling = true;
      this.state.selectedTileInspectorId = null;
      sound.playDiceRoll();
      this.notify();

      setTimeout(() => {
        const rollResult =
          forcedRollValue && forcedRollValue >= 1 && forcedRollValue <= 6
            ? Number(forcedRollValue)
            : Math.floor(Math.random() * 6) + 1;

        const d1 = rollResult > 1 ? Math.floor(rollResult / 2) : 1;
        const d2 = rollResult - d1;

        this.state.isRolling = false;
        this.state.lastRoll = rollResult;
        this.state.lastDicePair = [rollResult, d2 > 0 ? d2 : rollResult];
        this.state.lastRollerName = player.name.split(' ')[0];

        this.animatePlayerMove(player.id, rollResult, () => {
          const landedTile = BOARD_TILES[player.position];
          this.addLog(
            `${player.name.split(' ')[0]} llegó a ${landedTile.name} (Casilla ${landedTile.displayNum}) con una tirada de ${rollResult}.`
          );

          if (landedTile.type === 'JURISPRUDENCIA_FAVORABLE') {
            player.points += 15;
            this.addLog(
              `Jurisprudencia Favorable en ${landedTile.name}: +15 puntos de Prestigio Jurídico para ${player.name.split(' ')[0]}.`
            );
            this.showToast(`Jurisprudencia Favorable (${landedTile.name}): +15 puntos inmediatos.`);
          } else if (landedTile.type === 'VACIO_LEGAL') {
            this.addLog(
              `Vacío Legal en ${landedTile.name}: ${player.name.split(' ')[0]} debe integrar la laguna normativa resolviendo el caso.`
            );
            this.showToast(`Casilla de Vacío Legal (${landedTile.name}): aplica integración jurídica.`);
          }

          if (this._checkVictoryCondition(player)) {
            this.notify();
            return;
          }

          const question = this._pickQuestionForTile(landedTile);
          this.state.activeQuestion = question;
          this.state.phase = 'AWAITING_CASE';
          this.notify();

          setTimeout(() => {
            if (this.state.currentView === 'board' && this.state.phase === 'AWAITING_CASE') {
              this.openQuestionModal();
            }
          }, 420);
        });
      }, 520);
    }

    animatePlayerMove(playerId, stepsDelta, onComplete) {
      const player = this.state.players.find((p) => p.id === playerId);
      if (!player || stepsDelta === 0) {
        if (onComplete) onComplete();
        return;
      }

      const totalTiles = BOARD_TILES.length; // 32
      const direction = stepsDelta > 0 ? 1 : -1;
      let remaining = Math.abs(stepsDelta);

      this.state.isMovingToken = true;
      this.state.phase = 'MOVING';
      this.notify();

      const stepInterval = setInterval(() => {
        const prevPos = player.position;
        const nextPos = (prevPos + direction + totalTiles) % totalTiles;
        player.position = nextPos;
        this.state.steppingTileId = nextPos;

        if (direction > 0 && nextPos === 0) {
          player.circuits += 1;
          player.points += 25;
          sound.playSuccess();
          this.triggerCelebration();
          this.addLog(
            `¡${player.name} completó un circuito jurídico por Salida y recibió +25 puntos de Impulso Procesal!`
          );
        } else {
          sound.playTokenStep(direction < 0);
        }

        remaining -= 1;
        this.notify();

        if (remaining <= 0) {
          clearInterval(stepInterval);
          setTimeout(() => {
            this.state.isMovingToken = false;
            this.state.steppingTileId = null;
            this.notify();
            if (onComplete) onComplete();
          }, 200);
        }
      }, 190);
    }

    openQuestionModal() {
      if (!this.state.activeQuestion) {
        const currentTile = this.getCurrentTile();
        this.state.activeQuestion = this._pickQuestionForTile(currentTile);
      }

      const configuredTime = this.menuConfig.timerSeconds;
      const noTimer = configuredTime === 0;

      this.state.questionModalOpen = true;
      this.state.questionModalMinimized = false;
      this.state.phase = 'IN_QUESTION';
      this.state.selectedOption = null;
      this.state.eliminatedOptions = [];
      this.state.showDoctrineHint = false;
      this.state.evaluationResult = null;
      this.state.questionTimerTotal = noTimer ? 999 : configuredTime || 30;
      this.state.questionTimerRemaining = noTimer ? 999 : configuredTime || 30;
      this.state.questionTimerPaused = noTimer;

      if (!noTimer) {
        this._startQuestionTimer();
      }
      this.notify();

      // Si el jugador activo es un Bot IA, que delibere y responda automáticamente
      const player = this.getCurrentPlayer();
      if (player && player.isBot) {
        this._scheduleBotAction(() => {
          if (!this.state.questionModalOpen || this.state.evaluationResult) return;
          const q = this.state.activeQuestion;
          const isBotRight = Math.random() < 0.76; // 76% de precisión jurídica para el Bot
          const wrongKeys = ['A', 'B', 'C', 'D'].filter((k) => k !== q.correctOption);
          const chosenKey = isBotRight
            ? q.correctOption
            : wrongKeys[Math.floor(Math.random() * wrongKeys.length)];

          this.selectOption(chosenKey);
          this._scheduleBotAction(() => {
            if (!this.state.questionModalOpen || this.state.evaluationResult) return;
            this.confirmAnswer(chosenKey);
            this._scheduleBotAction(() => {
              if (this.state.questionModalOpen && this.state.evaluationResult) {
                this.applyEvaluationAndContinue();
              }
            }, 2200);
          }, 900);
        }, 1500);
      }
    }

    toggleMinimizeQuestionModal() {
      if (!this.state.questionModalOpen) return;
      this.state.questionModalMinimized = !this.state.questionModalMinimized;
      this.notify();
    }

    togglePauseQuestionTimer() {
      if (!this.state.questionModalOpen || this.state.evaluationResult) return;
      this.state.questionTimerPaused = !this.state.questionTimerPaused;
      this.notify();
    }

    toggleDoctrineHint() {
      this.state.showDoctrineHint = !this.state.showDoctrineHint;
      this.notify();
    }

    toggleEliminateOption(optKey) {
      if (this.state.evaluationResult) return;
      const idx = this.state.eliminatedOptions.indexOf(optKey);
      if (idx >= 0) {
        this.state.eliminatedOptions.splice(idx, 1);
      } else {
        this.state.eliminatedOptions.push(optKey);
        if (this.state.selectedOption === optKey) {
          this.state.selectedOption = null;
        }
      }
      this.notify();
    }

    _startQuestionTimer() {
      this._stopQuestionTimer();
      this.timerInterval = setInterval(() => {
        if (
          !this.state.questionModalOpen ||
          this.state.evaluationResult ||
          this.state.questionTimerPaused ||
          this.state.questionModalMinimized
        ) {
          return;
        }

        this.state.questionTimerRemaining -= 1;

        if (this.state.questionTimerRemaining <= 5 && this.state.questionTimerRemaining > 0) {
          sound.playTick(true);
        }

        const timerTextEl = document.getElementById('lex-modal-timer-text');
        const timerBadgeEl = document.getElementById('lex-modal-timer-badge');
        if (timerTextEl) {
          timerTextEl.textContent = `00:${String(
            Math.max(0, this.state.questionTimerRemaining)
          ).padStart(2, '0')}`;
        }
        if (timerBadgeEl && this.state.questionTimerRemaining <= 8) {
          timerBadgeEl.classList.add('bg-[#FDF0F0]', 'text-[#B8333A]', 'border-[#B8333A]');
        }

        if (this.state.questionTimerRemaining <= 0) {
          this._stopQuestionTimer();
          this.confirmAnswer('TIMEOUT');
        }
      }, 1000);
    }

    _stopQuestionTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    selectOption(optKey) {
      if (this.state.evaluationResult) return;
      const elimIdx = this.state.eliminatedOptions.indexOf(optKey);
      if (elimIdx >= 0) {
        this.state.eliminatedOptions.splice(elimIdx, 1);
      }
      this.state.selectedOption = optKey;
      this.notify();
    }

    confirmAnswer(forcedSelection = null) {
      if (this.state.evaluationResult) return;
      const choice = forcedSelection || this.state.selectedOption;
      if (!choice) return;

      this._stopQuestionTimer();
      this.state.questionModalMinimized = false;

      const player = this.getCurrentPlayer();
      const tile = this.getCurrentTile();
      const question = this.state.activeQuestion;
      const timeSpent = Math.max(
        1,
        this.state.questionTimerTotal - this.state.questionTimerRemaining
      );

      this.usedQuestionIds.add(question.id);

      const evaluation = SanctionsEngine.evaluateResponse({
        question,
        selectedOption: choice,
        timeSpent: timeSpent > 120 ? 18 : timeSpent,
        player,
        tile,
        boardTiles: BOARD_TILES
      });

      if (evaluation.isCorrect) {
        player.streak = (player.streak || 0) + 1;
        // Bono por racha jurisprudencial (2 o más aciertos consecutivos)
        if (player.streak >= 2) {
          const streakBonus = 10;
          evaluation.pointsDelta += streakBonus;
          evaluation.streakBonus = streakBonus;
          evaluation.headline = `¡Racha Jurisprudencial 🔥 x${player.streak}! Argumento sólido (+${streakBonus} pts extra).`;
        }
        sound.playSuccess();
        player.points += evaluation.pointsDelta;
        player.correctCount += 1;
        player.activeSanction = null;
        this.triggerCelebration();
      } else {
        player.streak = 0;
        sound.playSanction();
        player.wrongCount += 1;
        if (evaluation.skipTurnPenalty > 0) {
          player.skipTurns += evaluation.skipTurnPenalty;
        }
        player.activeSanction = evaluation.sanctionBadge;
        player.sanctionHistory.push({
          caseId: question.id,
          type: evaluation.sanctionType,
          badge: evaluation.sanctionBadge
        });
      }

      this.state.evaluationResult = evaluation;
      this.notify();
    }

    applyEvaluationAndContinue() {
      const evalResult = this.state.evaluationResult;
      const player = this.getCurrentPlayer();

      this.state.questionModalOpen = false;
      this.state.questionModalMinimized = false;
      this.state.evaluationResult = null;
      this.state.activeQuestion = null;

      if (!evalResult) {
        this.advanceToNextTurn();
        return;
      }

      const steps = evalResult.stepsDelta;
      if (evalResult.isCorrect) {
        this.addLog(
          `${player.name.split(' ')[0]} acertó el caso (+${evalResult.pointsDelta} pts) y avanza ${steps} casillas.`
        );
      } else {
        this.addLog(
          `${player.name.split(' ')[0]} recibió ${evalResult.sanctionBadge} en ${BOARD_TILES[player.position].name
          }.`
        );
      }

      this.animatePlayerMove(player.id, steps, () => {
        if (this._checkVictoryCondition(player)) {
          this.notify();
          return;
        }
        this.advanceToNextTurn();
      });
    }

    _checkVictoryCondition(player) {
      if (player.circuits >= this.menuConfig.targetCircuits) {
        this.state.victoryModalOpen = true;
        this.state.phase = 'GAME_OVER';
        this.state.winner = player;
        this.state.victoryReason = `Completó exitosamente el circuito perimetral del tablero con ${player.points} puntos de Prestigio Jurídico.`;
        sound.playVictory();
        this.triggerCelebration();
        return true;
      }
      if (player.points >= this.menuConfig.targetPoints) {
        this.state.victoryModalOpen = true;
        this.state.phase = 'GAME_OVER';
        this.state.winner = player;
        this.state.victoryReason = `Alcanzó la excelencia académica superando la meta de ${this.menuConfig.targetPoints} puntos de Prestigio Jurídico (${player.points} pts).`;
        sound.playVictory();
        this.triggerCelebration();
        return true;
      }
      return false;
    }

    advanceToNextTurn() {
      const totalPlayers = this.state.players.length;
      let nextIndex = (this.state.turnIndex + 1) % totalPlayers;

      if (nextIndex === 0) {
        this.state.round += 1;
        if (this.state.round > this.state.maxRounds && this.state.mode !== 'practica') {
          const sorted = [...this.state.players].sort((a, b) => b.points - a.points);
          this.state.victoryModalOpen = true;
          this.state.phase = 'GAME_OVER';
          this.state.winner = sorted[0];
          this.state.victoryReason = `Concluyeron las ${this.state.maxRounds} rondas reglamentarias con el mayor Prestigio Jurídico (${sorted[0].points} pts).`;
          sound.playVictory();
          this.triggerCelebration();
          this.notify();
          return;
        }
      }

      this.state.turnIndex = nextIndex;
      this.state.phase = 'AWAITING_ROLL';
      this.state.activeQuestion = null;
      const nextPlayer = this.getCurrentPlayer();
      this.showToast(`Turno de ${nextPlayer.name}${nextPlayer.isBot ? ' 🤖' : ''}`);
      this.notify();
      this._checkAndRunBotTurn();
    }

    inspectTile(tileId) {
      this.state.selectedTileInspectorId =
        this.state.selectedTileInspectorId === tileId ? null : tileId;
      this.notify();
    }
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.GameState = GameState;
  global.Lexopoly.store = new GameState();
})(window);
