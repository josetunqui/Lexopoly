/**
 * ============================================================================
 * LEXOPOLY — MOTOR DE AUDIO SINTÉTICO (WEB AUDIO API)
 * ============================================================================
 * Genera efectos de sonido limpios y académicos para:
 * - Tirada de dados virtuales
 * - Desplazamiento de ficha casilla por casilla
 * - Alerta de temporizador
 * - Acierto jurídico (+Prestigio)
 * - Error / Sanción Procesal
 * - Victoria de partida
 */
(function (global) {
  'use strict';

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    _ensureContext() {
      if (!this.enabled) return null;
      try {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        return this.ctx;
      } catch (e) {
        return null;
      }
    }

    toggleMute() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, duration = 0.1, type = 'sine', gainVal = 0.08, delay = 0) {
      const ctx = this._ensureContext();
      if (!ctx) return;
      try {
        const startTime = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      } catch (e) {
        // Ignore audio errors on restricted environments
      }
    }

    playDiceRoll() {
      // Secuencia rítmica de rodamiento de dados
      const freqs = [240, 310, 275, 360, 290, 420, 520];
      freqs.forEach((f, idx) => {
        this.playTone(f, 0.055, 'triangle', 0.06, idx * 0.055);
      });
    }

    playTokenStep(isBackward = false) {
      this.playTone(isBackward ? 290 : 480, 0.075, 'sine', 0.07, 0);
    }

    playTick(urgent = false) {
      this.playTone(urgent ? 880 : 620, 0.04, 'sine', urgent ? 0.06 : 0.03, 0);
    }

    playSuccess() {
      // Acorde mayor ascendente (Do - Mi - Sol - Do)
      this.playTone(523.25, 0.14, 'triangle', 0.09, 0);
      this.playTone(659.25, 0.14, 'triangle', 0.09, 0.09);
      this.playTone(783.99, 0.16, 'triangle', 0.09, 0.18);
      this.playTone(1046.5, 0.32, 'sine', 0.11, 0.27);
    }

    playSanction() {
      // Doble tono grave de sanción procesal
      this.playTone(261.63, 0.18, 'sawtooth', 0.06, 0);
      this.playTone(196.0, 0.34, 'sawtooth', 0.07, 0.16);
    }

    playVictory() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      const delays = [0, 0.11, 0.22, 0.34, 0.5, 0.64];
      notes.forEach((n, i) => {
        this.playTone(n, i === notes.length - 1 ? 0.45 : 0.14, 'triangle', 0.1, delays[i]);
      });
    }
  }

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.sound = new SoundEngine();
})(window);

