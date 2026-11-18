class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.14,
    delay = 0,
    endFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 20), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playTurnStart() {
    this.playTone(587.33, 0.09, 'triangle', 0.12, 0);
    this.playTone(783.99, 0.13, 'triangle', 0.13, 0.07);
  }

  playCorrect() {
    this.playTone(523.25, 0.11, 'triangle', 0.15, 0);
    this.playTone(659.25, 0.11, 'triangle', 0.15, 0.08);
    this.playTone(783.99, 0.22, 'triangle', 0.18, 0.16);
  }

  playStreak() {
    this.playTone(523.25, 0.09, 'triangle', 0.15, 0);
    this.playTone(659.25, 0.09, 'triangle', 0.15, 0.07);
    this.playTone(783.99, 0.09, 'triangle', 0.16, 0.14);
    this.playTone(1046.5, 0.28, 'triangle', 0.18, 0.21);
  }

  playWrong() {
    this.playTone(230, 0.15, 'sawtooth', 0.09, 0, 175);
    this.playTone(170, 0.22, 'sawtooth', 0.09, 0.13, 130);
  }

  playCountdownTick(urgent = false) {
    if (urgent) {
      this.playTone(940, 0.08, 'square', 0.08, 0);
    } else {
      this.playTone(620, 0.035, 'sine', 0.04, 0);
    }
  }

  playRoundWin() {
    this.playTone(523.25, 0.12, 'triangle', 0.15, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.15, 0.1);
    this.playTone(783.99, 0.14, 'triangle', 0.16, 0.2);
    this.playTone(1046.5, 0.34, 'triangle', 0.18, 0.32);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.11, 0.22, 0.34, 0.5, 0.62];
    const durations = [0.12, 0.12, 0.12, 0.16, 0.12, 0.44];
    notes.forEach((n, idx) => {
      this.playTone(n, durations[idx], 'triangle', 0.17, times[idx]);
    });
  }
}

export const soundEngine = new SoundEngine();
