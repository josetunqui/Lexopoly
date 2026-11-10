/**
 * ============================================================================
 * LEXOPOLY — MOTOR DE EVALUACIÓN Y LÓGICA DE SANCIONES PROCESALES
 * ============================================================================
 * Gestiona:
 * 1. Evaluación de Acierto: Puntos de Prestigio Jurídico + Avance adicional.
 * 2. Evaluación de Error ("Sanción Procesal"):
 *    - Defecto Procesal: Retroceso automático de 1 o 2 casillas.
 *    - Recurso Improcedente / Preclusión: Pérdida del próximo turno.
 * 3. Efectos de Casillas Especiales (Jurisprudencia Favorable y Vacío Legal).
 */
(function (global) {
  'use strict';

  class SanctionsEngine {
    /**
     * Evalúa la respuesta de un jugador ante un caso práctico.
     * @param {Object} params
     * @param {Object} params.question - Objeto del caso práctico
     * @param {string|null} params.selectedOption - 'A' | 'B' | 'C' | 'D' | null (timeout)
     * @param {number} params.timeSpent - Segundos empleados
     * @param {Object} params.player - Jugador actual
     * @param {Object} params.tile - Casilla actual (0..31)
     * @param {Array} params.boardTiles - Todas las casillas (0..31)
     */
    static evaluateResponse({ question, selectedOption, timeSpent, player, tile, boardTiles }) {
      const totalTiles = boardTiles.length; // 32
      const isTimeout = !selectedOption || selectedOption === 'TIMEOUT';
      const isCorrect = !isTimeout && selectedOption === question.correctOption;

      // Bonificación adicional si la casilla es de Jurisprudencia Favorable
      const isJurisprudenciaTile = tile && tile.type === 'JURISPRUDENCIA_FAVORABLE';
      const jurisBonus = isJurisprudenciaTile ? 10 : 0;

      if (isCorrect) {
        const pointsEarned = (question.rewardPoints || 30) + jurisBonus;
        const stepsToAdvance = question.advanceSteps || 2;
        const targetIndex = (player.position + stepsToAdvance) % totalTiles;
        const targetTile = boardTiles[targetIndex];

        return {
          isCorrect: true,
          isTimeout: false,
          selectedOption,
          correctOption: question.correctOption,
          pointsDelta: pointsEarned,
          stepsDelta: stepsToAdvance,
          sanctionType: null,
          sanctionBadge: null,
          skipTurnPenalty: 0,
          targetIndex,
          targetTile,
          timeSpent,
          headline: '¡Buen criterio! Tu argumento tiene fundamento.',
          explanation: question.feedbackCorrect,
          citation: question.legalCitation,
          actionButtonText: `Avanzar ${stepsToAdvance} ${stepsToAdvance === 1 ? 'casilla' : 'casillas'}`
        };
      }

      // ==================== EVALUACIÓN DE ERROR / SANCIÓN PROCESAL ====================
      // Si se agotó el tiempo: Preclusión procesal (retrocede 1 casilla y pierde 1 turno)
      if (isTimeout) {
        const setback = 1;
        const targetIndex = (player.position - setback + totalTiles) % totalTiles;
        const targetTile = boardTiles[targetIndex];

        return {
          isCorrect: false,
          isTimeout: true,
          selectedOption: null,
          correctOption: question.correctOption,
          pointsDelta: 0,
          stepsDelta: -setback,
          sanctionType: 'PRECLUSION_PROCESAL',
          sanctionBadge: 'Preclusión Procesal · Pierde 1 turno',
          skipTurnPenalty: 1,
          targetIndex,
          targetTile,
          timeSpent,
          headline: 'Sanción Procesal: Preclusión de Plazo (Retrocedes 1 casilla y pierdes 1 turno)',
          explanation: `Se agotó el término procesal sin contestación oportuna. La opción correcta era la ${question.correctOption}: ${question.feedbackWrong}`,
          citation: question.legalCitation,
          actionButtonText: 'Continuar · Aplicar Sanción'
        };
      }

      // Determinar si aplica Recurso Improcedente (pérdida de turno) o Defecto Procesal (retroceso 1-2 casillas)
      const penaltyType = question.penaltyType || 'RETROCESO';
      if (penaltyType === 'PERDIDA_TURNO') {
        const setback = 1; // Además de perder el próximo turno, retrocede 1 casilla por inadmisión
        const targetIndex = (player.position - setback + totalTiles) % totalTiles;
        const targetTile = boardTiles[targetIndex];

        return {
          isCorrect: false,
          isTimeout: false,
          selectedOption,
          correctOption: question.correctOption,
          pointsDelta: 0,
          stepsDelta: -setback,
          sanctionType: 'RECURSO_IMPROCEDENTE',
          sanctionBadge: 'Recurso Improcedente · Pierde 1 turno',
          skipTurnPenalty: 1,
          targetIndex,
          targetTile,
          timeSpent,
          headline: 'Sanción Procesal: Recurso Improcedente (Pierdes el próximo turno y retrocedes 1 casilla)',
          explanation: `La opción ${selectedOption} es errónea. ${question.feedbackWrong}`,
          citation: question.legalCitation,
          actionButtonText: 'Continuar · Acatar Sanción'
        };
      } else {
        const setback = question.penaltySteps || 1;
        const targetIndex = (player.position - setback + totalTiles) % totalTiles;
        const targetTile = boardTiles[targetIndex];

        return {
          isCorrect: false,
          isTimeout: false,
          selectedOption,
          correctOption: question.correctOption,
          pointsDelta: 0,
          stepsDelta: -setback,
          sanctionType: 'DEFECTO_PROCESAL',
          sanctionBadge: `Defecto Procesal (-${setback} ${setback === 1 ? 'casilla' : 'casillas'})`,
          skipTurnPenalty: 0,
          targetIndex,
          targetTile,
          timeSpent,
          headline: `Sanción Procesal: Defecto Procesal (Retrocedes ${setback} ${setback === 1 ? 'casilla' : 'casillas'})`,
          explanation: `La opción ${selectedOption} invierte o vulnera la regla aplicable. ${question.feedbackWrong}`,
          citation: question.legalCitation,
          actionButtonText: `Continuar · Retroceder ${setback}`
        };
      }
    }
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.SanctionsEngine = SanctionsEngine;
})(window);

