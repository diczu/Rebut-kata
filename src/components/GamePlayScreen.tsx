import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Home,
  Pause,
  Play,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { ROUND_1_FORMULAS } from '../data/questionBank';
import {
  FloatingStarEvent,
  Group,
  Round1Category,
  Round1Question,
  Round2Question,
  Round3QuestionItem,
  RoundNumber,
  SortirMistake,
  TurnPhase,
} from '../types/game';
import { RuangguruPrivatLogo } from './RuangguruPrivatLogo';

interface GamePlayScreenProps {
  currentRound: RoundNumber;
  turnLabel: string;
  phase: TurnPhase;
  groups: Group[];
  finalistGroupIds: string[];
  turnGroupIndex: number;
  stealGroupIndex: number | null;
  timeLeft: number;
  maxTime: number;
  isPaused: boolean;
  isMuted: boolean;
  canGoBack: boolean;
  shakeKey: number;
  wrongFlashKey: number;
  starBurstKey: number;
  floatingStars: FloatingStarEvent[];
  eliminatedOptionIndices: number[];
  doubleActive: boolean;
  chosenIndex: number | null;
  chosenCategory: Round1Category | null;
  lastOutcome: 'CORRECT' | 'WRONG' | 'TIMEOUT' | 'SKIPPED' | null;
  round1Question?: Round1Question;
  round2Question?: Round2Question;
  round3Items?: Round3QuestionItem[];
  sortirItemIndex: number;
  sortirMistakes: SortirMistake[];
  sortirRoundDelta: number;
  onGoBack: () => void;
  onGoMainMenu: () => void;
  onStartTurn: () => void;
  onUseFiftyFifty: () => void;
  onUseDoublePoints: () => void;
  onSubmitRound1: (category: Round1Category) => void;
  onSubmitRound2: (index: number) => void;
  onSelectStealGroup: (groupIndex: number) => void;
  onSkipSteal: () => void;
  onSubmitRound3Basket: (basketIndex: number) => void;
  onNextTurn: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenTeacherPanel: () => void;
}

const ROUND_THEMES: Record<
  RoundNumber,
  { badge: string; badgeClass: string; borderClass: string }
> = {
  1: {
    badge: 'Ronde 1 · Hakim Kata',
    badgeClass: 'bg-[#006B76] text-white',
    borderClass: 'border-[#2BB3C0]/50',
  },
  2: {
    badge: 'Ronde 2 · Rebut Makna',
    badgeClass: 'bg-[#FCA326] text-slate-950',
    borderClass: 'border-[#FCA326]/60',
  },
  3: {
    badge: 'Ronde 3 · Babak Final',
    badgeClass: 'bg-[#004D56] text-[#FCA326]',
    borderClass: 'border-[#006B76]',
  },
};

const LETTERS = ['A', 'B', 'C', 'D'] as const;

const STAR_VECTORS = [
  { tx: '-140px', ty: '-95px' },
  { tx: '130px', ty: '-105px' },
  { tx: '-110px', ty: '75px' },
  { tx: '115px', ty: '80px' },
  { tx: '0px', ty: '-135px' },
  { tx: '-175px', ty: '-15px' },
  { tx: '175px', ty: '-20px' },
  { tx: '45px', ty: '-120px' },
];

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (display === value) return;
    const diff = value - display;
    const steps = 10;
    let step = 0;
    const start = display;
    const timer = window.setInterval(() => {
      step += 1;
      if (step >= steps) {
        setDisplay(value);
        window.clearInterval(timer);
      } else {
        setDisplay(Math.round(start + (diff * step) / steps));
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, [value, display]);

  return <span className="font-mono-num">{display} ⭐</span>;
}

export function GamePlayScreen({
  currentRound,
  turnLabel,
  phase,
  groups,
  finalistGroupIds,
  turnGroupIndex,
  stealGroupIndex,
  timeLeft,
  maxTime,
  isPaused,
  isMuted,
  canGoBack,
  shakeKey,
  wrongFlashKey,
  starBurstKey,
  floatingStars,
  eliminatedOptionIndices,
  doubleActive,
  chosenIndex,
  chosenCategory,
  lastOutcome,
  round1Question,
  round2Question,
  round3Items,
  sortirItemIndex,
  sortirMistakes,
  sortirRoundDelta,
  onGoBack,
  onGoMainMenu,
  onStartTurn,
  onUseFiftyFifty,
  onUseDoublePoints,
  onSubmitRound1,
  onSubmitRound2,
  onSelectStealGroup,
  onSkipSteal,
  onSubmitRound3Basket,
  onNextTurn,
  onTogglePause,
  onToggleMute,
  onOpenTeacherPanel,
}: GamePlayScreenProps) {
  const [dragOverBasket, setDragOverBasket] = useState<number | null>(null);

  const activeGroupIndex =
    phase === 'STEAL_ACTIVE' ? stealGroupIndex ?? turnGroupIndex : turnGroupIndex;
  const activeGroup = groups[activeGroupIndex];

  const activeMemberName =
    activeGroup && activeGroup.members.length > 0
      ? activeGroup.members[activeGroup.currentMemberIndex % activeGroup.members.length]
      : null;

  const sortedGroups = [...groups].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.correctCount - a.correctCount;
  });

  const finalistSet = new Set(finalistGroupIds);
  const stealCandidates = groups
    .map((g, idx) => ({ group: g, index: idx }))
    .filter((entry) => entry.index !== turnGroupIndex);

  const isUrgent =
    (phase === 'QUESTION_ACTIVE' || phase === 'STEAL_ACTIVE') &&
    timeLeft <= 3 &&
    timeLeft > 0;

  const progressPct = maxTime > 0 ? Math.max(0, Math.min(100, (timeLeft / maxTime) * 100)) : 0;
  const currentSortirItem = round3Items?.[sortirItemIndex];
  const theme = ROUND_THEMES[currentRound];

  return (
    <div
      className={`relative flex min-h-screen flex-col transition-colors duration-300 ${
        wrongFlashKey > 0 && lastOutcome === 'WRONG' && phase === 'REVEALED'
          ? 'bg-rose-50'
          : 'bg-[#F2FAFB]'
      } text-[#1E2428]`}
    >
      {/* Top Bar: Navigation + Round Theme Badge (Left) & Compact Live Scoreboard (Top-Right) */}
      <header className="border-b border-slate-200 bg-white px-5 py-3">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <RuangguruPrivatLogo compact />
            <span className="hidden text-slate-300 sm:inline">|</span>

            {/* Navigasi Kembali & Menu Utama */}
            <button
              type="button"
              onClick={onGoBack}
              className="flex min-h-[36px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
              title={canGoBack ? 'Kembali ke langkah sebelumnya' : 'Kembali ke pengaturan'}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={onGoMainMenu}
              className="flex min-h-[36px] items-center gap-1 rounded-xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-2.5 py-1 text-xs font-bold text-[#005F69] hover:bg-[#d3f2f5]"
              title="Kembali ke Menu Utama"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Menu Utama</span>
            </button>

            <span className={`rounded-xl px-3 py-1 text-xs font-extrabold whitespace-nowrap ${theme.badgeClass}`}>
              {theme.badge}
            </span>
            <span className="font-mono-num text-xs font-bold text-slate-600 whitespace-nowrap">
              {turnLabel}
            </span>
          </div>

          {/* Pojok Kanan Atas: Papan Skor Ringkas Semua Kelompok + Bisu & Guru (H) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {sortedGroups.map((g, rankIdx) => {
                const isTurn =
                  phase !== 'STEAL_PROMPT' && activeGroup?.id === g.id;
                const isSpectatorInR3 = currentRound === 3 && !finalistSet.has(g.id);
                const isTopTwoInR2 = currentRound === 2 && rankIdx < 2;
                const recentDelta = floatingStars.find((f) => f.groupId === g.id);

                return (
                  <motion.div
                    key={g.id}
                    layout
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className={`relative flex flex-col rounded-xl border px-3 py-1.5 text-xs font-extrabold transition-colors sm:text-sm ${
                      isTurn
                        ? 'border-[#FCA326] bg-[#FFE0B5] text-slate-950 shadow-sm ring-2 ring-[#006B76]/30'
                        : isSpectatorInR3
                        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                        : isTopTwoInR2
                        ? 'border-[#2BB3C0] bg-[#E4F7F9] text-slate-900'
                        : 'border-slate-200 bg-[#F2FAFB] text-slate-800'
                    }`}
                  >
                    {recentDelta && (
                      <span
                        key={recentDelta.id}
                        className={`pointer-events-none absolute -bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-md px-2 py-0.5 font-mono-num text-xs font-extrabold shadow-sm ${
                          recentDelta.delta >= 0
                            ? 'bg-[#006B76] text-[#FCA326]'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {recentDelta.delta >= 0 ? `+${recentDelta.delta}` : recentDelta.delta} ⭐
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-num text-xs text-slate-500">#{rankIdx + 1}</span>
                      <span className="max-w-[96px] truncate">{g.name}</span>
                      {g.streak >= 3 && (
                        <Flame
                          className="h-3.5 w-3.5 shrink-0 text-amber-500 fill-amber-400"
                          aria-label="Beruntun"
                        />
                      )}
                      {isTopTwoInR2 && (
                        <span className="rounded bg-[#006B76] px-1.5 py-0.5 text-[10px] font-extrabold text-[#FFE0B5]">
                          2 Besar
                        </span>
                      )}
                      <span
                        className={`ml-auto rounded-lg px-2 py-0.5 text-xs font-extrabold ${
                          isTurn
                            ? 'bg-[#006B76] text-[#FFE0B5]'
                            : 'bg-[#FFE0B5]/80 text-slate-900'
                        }`}
                      >
                        <AnimatedScore value={g.totalScore} />
                      </span>
                    </div>

                    {currentRound >= 2 && (
                      <div className="mt-0.5 flex items-center gap-2 font-mono-num text-[10px] font-bold text-slate-600">
                        <span>R1: {g.roundScores[0]}</span>
                        <span>·</span>
                        <span>R2: {g.roundScores[1]}</span>
                        {currentRound === 3 && (
                          <>
                            <span>·</span>
                            <span>R3: {g.roundScores[2]}</span>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="ml-1 flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                title={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
                aria-label="Bisukan suara"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4 text-[#006B76]" />
                )}
              </button>
              <button
                type="button"
                onClick={onOpenTeacherPanel}
                className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                title="Panel Guru (Tombol H)"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="font-mono-num">H</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Clean Arena */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-6">
        {/* Flying Stars Overlay on Correct Answer */}
        {starBurstKey > 0 && (
          <div
            key={starBurstKey}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
          >
            {STAR_VECTORS.map((vec, i) => (
              <span
                key={i}
                style={{ '--tx': vec.tx, '--ty': vec.ty } as React.CSSProperties}
                className="animate-star-burst absolute text-3xl select-none"
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* PHASE 1: TURN SPOTLIGHT */}
        {phase === 'TURN_SPOTLIGHT' && activeGroup && (
          <motion.div
            key={`spotlight-${activeGroup.id}-${turnLabel}`}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border-2 ${theme.borderClass} bg-white text-center shadow-lg`}
          >
            <div className={`px-6 py-3 text-sm font-extrabold uppercase ${theme.badgeClass}`}>
              {theme.badge} · {turnLabel}
            </div>

            <div className="p-9">
              <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                Giliran Menjawab
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {activeGroup.name}
              </h1>
              {activeMemberName && (
                <p className="mt-3 inline-block rounded-2xl bg-[#FFE0B5] px-5 py-2 text-2xl font-extrabold text-slate-950">
                  Giliran: {activeMemberName}
                </p>
              )}
              <p className="mt-4 font-mono-num text-lg font-bold text-[#D97706]">
                Total Akumulasi: {activeGroup.totalScore} ⭐
              </p>
              {currentRound >= 2 && (
                <p className="mt-1 font-mono-num text-xs font-bold text-slate-500">
                  Ronde 1: {activeGroup.roundScores[0]} ⭐ · Ronde 2: {activeGroup.roundScores[1]} ⭐
                  {currentRound === 3 ? ` · Ronde 3: ${activeGroup.roundScores[2]} ⭐` : ''}
                </p>
              )}

              <button
                type="button"
                onClick={onStartTurn}
                className="mt-8 flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#006B76] px-8 py-4 text-xl font-extrabold text-white shadow-md transition-transform hover:scale-[1.01] hover:bg-[#005761]"
              >
                <Play className="h-6 w-6 fill-current text-[#FCA326]" />
                <span>Buka Soal</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE: STEAL PROMPT (Babak 2 — Rebutan Terbuka Antarkelompok) */}
        {phase === 'STEAL_PROMPT' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-[#FCA326] bg-white text-center shadow-lg"
          >
            <div className="bg-[#FCA326] px-6 py-3 text-sm font-extrabold text-slate-950 uppercase">
              Kesempatan Rebutan Antarkelompok (+15 ⭐ jika benar · -5 ⭐ jika salah)
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Kelompok mana yang ingin merebut soal ini?
              </h2>
              <p className="mt-1.5 text-sm font-medium text-slate-600">
                <strong className="text-slate-900">{groups[turnGroupIndex]?.name}</strong> belum tepat (0 pengurangan poin) dan satu pilihan salah telah dicoret. Setelah rebutan selesai,{' '}
                <strong className="text-slate-900">{groups[turnGroupIndex]?.name}</strong> tetap melanjutkan sisa soal utamanya.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {stealCandidates.map(({ group, index }) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => onSelectStealGroup(index)}
                    className="flex min-h-[58px] items-center justify-between rounded-2xl border-2 border-[#2BB3C0] bg-[#E4F7F9] px-5 py-3 text-left transition-all hover:border-[#006B76] hover:bg-[#d2f1f4]"
                  >
                    <span className="text-lg font-extrabold text-[#004D56]">{group.name}</span>
                    <span className="rounded-lg bg-[#006B76] px-2.5 py-1 text-xs font-extrabold text-[#FFE0B5]">
                      Rebut!
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onSkipSteal}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Tidak Ada yang Merebut (Lihat Pembahasan)
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE: QUESTION ACTIVE / STEAL ACTIVE / REVEALED (Ronde 1 & 2) */}
        {(phase === 'QUESTION_ACTIVE' || phase === 'STEAL_ACTIVE' || phase === 'REVEALED') &&
          currentRound !== 3 &&
          activeGroup && (
            <div
              key={shakeKey}
              className={`rounded-3xl border-2 ${theme.borderClass} bg-white p-6 shadow-md sm:p-8 ${
                shakeKey > 0 && (phase !== 'REVEALED' || lastOutcome === 'WRONG')
                  ? 'animate-shake'
                  : ''
              }`}
            >
              {/* Turn Marker + Helpers + Timer */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-xl bg-[#FFE0B5] px-3.5 py-1.5 text-base font-extrabold text-slate-950">
                    {activeGroup.name}
                    {activeMemberName ? ` · ${activeMemberName}` : ''}
                  </span>
                  {phase === 'STEAL_ACTIVE' && (
                    <span className="rounded-xl bg-[#FCA326] px-3 py-1.5 text-sm font-extrabold text-slate-950">
                      Poin Rebutan (+15 ⭐)
                    </span>
                  )}
                  {doubleActive && (
                    <span className="rounded-xl bg-[#006B76] px-3 py-1.5 text-sm font-extrabold text-[#FFE0B5]">
                      2× Poin Aktif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {phase === 'QUESTION_ACTIVE' && (
                    <>
                      {currentRound === 2 && !activeGroup.usedFiftyFifty && (
                        <button
                          type="button"
                          onClick={onUseFiftyFifty}
                          className="flex h-10 items-center gap-1.5 rounded-xl border border-[#2BB3C0] bg-[#E4F7F9] px-3 text-xs font-extrabold text-[#005F69] hover:bg-[#d3f2f5]"
                          title="Hapus 2 pilihan salah (1x per kelompok)"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>50:50</span>
                        </button>
                      )}
                      {!activeGroup.usedDoublePoints && !doubleActive && (
                        <button
                          type="button"
                          onClick={onUseDoublePoints}
                          className="flex h-10 items-center gap-1.5 rounded-xl border border-[#FCA326] bg-[#FFF8EB] px-3 text-xs font-extrabold text-slate-900 hover:bg-[#FFE0B5]"
                          title="Gandakan poin benar pada giliran ini (1x per kelompok)"
                        >
                          <Zap className="h-4 w-4 text-[#D97706]" />
                          <span>2× Poin</span>
                        </button>
                      )}
                    </>
                  )}

                  <div
                    className={`flex min-w-[76px] items-center justify-center rounded-xl px-3.5 py-1.5 font-mono-num text-2xl font-extrabold ${
                      isUrgent
                        ? 'animate-timer-urgent bg-rose-600 text-white'
                        : 'bg-[#006B76] text-[#FFE0B5]'
                    }`}
                  >
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Shrinking Timer Bar */}
              <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  style={{ width: `${progressPct}%` }}
                  className={`h-full transition-all duration-700 ease-linear ${
                    isUrgent
                      ? 'bg-rose-600'
                      : currentRound === 2
                      ? 'bg-[#FCA326]'
                      : 'bg-[#0F7E89]'
                  }`}
                />
              </div>

              {/* RONDE 1 CONTENT */}
              {currentRound === 1 && round1Question && (
                <div className="space-y-8">
                  <div className="py-4 text-center">
                    <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                      “{round1Question.phrase}”
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {(['MAJEMUK', 'IDIOM', 'FRASA'] as Round1Category[]).map((cat, idx) => {
                      const info = ROUND_1_FORMULAS[cat];
                      const isCorrect = round1Question.category === cat;
                      const isChosen = chosenCategory === cat;

                      let btnStyle =
                        'border-[#2BB3C0]/50 bg-[#F2FAFB] text-slate-900 hover:border-[#006B76] hover:bg-[#E4F7F9]';
                      if (phase === 'REVEALED') {
                        if (isCorrect) {
                          btnStyle = 'border-[#006B76] bg-[#006B76] text-white shadow-md';
                        } else if (isChosen) {
                          btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        } else {
                          btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={phase === 'REVEALED'}
                          onClick={() => onSubmitRound1(cat)}
                          className={`flex min-h-[100px] flex-col items-center justify-center rounded-2xl border-2 px-4 py-5 transition-all ${btnStyle}`}
                        >
                          <span className="mb-1 font-mono-num text-xs font-bold opacity-70">
                            {idx + 1} / {LETTERS[idx]}
                          </span>
                          <span className="text-2xl font-extrabold">{info.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {phase === 'REVEALED' && (
                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-5 py-4 sm:flex-row">
                      <p className="text-base font-bold text-[#004D56]">
                        {round1Question.oneLineExplanation}
                      </p>
                      <button
                        type="button"
                        onClick={onNextTurn}
                        className="flex min-h-[46px] shrink-0 items-center gap-2 rounded-xl bg-[#006B76] px-6 py-2.5 text-base font-extrabold text-white hover:bg-[#005761] whitespace-nowrap"
                      >
                        <span>Lanjut</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* RONDE 2 CONTENT (Gaya Quick Check Ruangguru Privat: Badge A/B/C/D Amber) */}
              {currentRound === 2 && round2Question && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-extrabold text-[#006B76]">
                      Makna imbuhan <span className="font-mono-num">{round2Question.affix}</span> pada kata tersebut?
                    </p>
                    <blockquote className="mt-2 rounded-2xl border border-slate-200 bg-[#F8FCFD] px-6 py-5 text-2xl leading-snug font-medium text-slate-900 sm:text-3xl">
                      “{round2Question.sentenceBefore}
                      <strong className="rounded-md bg-[#FFE0B5] px-1.5 py-0.5 font-extrabold text-slate-950">
                        {round2Question.targetWord}
                      </strong>
                      {round2Question.sentenceAfter}”
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {round2Question.options.map((opt, idx) => {
                      const isEliminated = eliminatedOptionIndices.includes(idx);
                      const isCorrect = round2Question.correctIndex === idx;
                      const isChosen = chosenIndex === idx;

                      let optStyle =
                        'border-[#FCA326]/60 bg-white text-slate-900 hover:border-[#006B76] hover:bg-[#F2FAFB]';
                      if (isEliminated && phase !== 'REVEALED') {
                        optStyle =
                          'border-slate-200 bg-slate-100 text-slate-400 line-through opacity-40 cursor-not-allowed';
                      } else if (phase === 'REVEALED') {
                        if (isCorrect) {
                          optStyle = 'border-[#006B76] bg-[#006B76] text-white shadow-md';
                        } else if (isChosen) {
                          optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        } else {
                          optStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-65';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={phase === 'REVEALED' || isEliminated}
                          onClick={() => onSubmitRound2(idx)}
                          className={`flex min-h-[78px] items-stretch overflow-hidden rounded-2xl border-2 text-left transition-all ${optStyle}`}
                        >
                          <span
                            className={`flex w-14 shrink-0 items-center justify-center font-mono-num text-xl font-extrabold ${
                              phase === 'REVEALED' && isCorrect
                                ? 'bg-[#FCA326] text-slate-950'
                                : 'bg-[#FFCA7A] text-slate-950'
                            }`}
                          >
                            {LETTERS[idx]}
                          </span>
                          <span className="flex flex-1 items-center px-4 py-3 text-lg font-bold leading-snug">
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {phase === 'REVEALED' && (
                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-5 py-4 sm:flex-row">
                      <div className="space-y-1">
                        {stealGroupIndex !== null ? (
                          <p className="text-xs font-extrabold text-[#006B76] uppercase">
                            {lastOutcome === 'CORRECT'
                              ? `Berhasil direbut ${groups[stealGroupIndex]?.name} (+15 ⭐)! Giliran kembali ke ${groups[turnGroupIndex]?.name}.`
                              : `Rebutan ${groups[stealGroupIndex]?.name} belum tepat. Giliran kembali ke ${groups[turnGroupIndex]?.name}.`}
                          </p>
                        ) : lastOutcome !== 'CORRECT' ? (
                          <p className="text-xs font-extrabold text-slate-600 uppercase">
                            Tidak ada yang merebut · {groups[turnGroupIndex]?.name} (0 pengurangan poin) melanjutkan soal berikutnya.
                          </p>
                        ) : null}
                        <p className="text-base font-bold text-[#004D56]">
                          {round2Question.oneLineExplanation}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onNextTurn}
                        className="flex min-h-[46px] shrink-0 items-center gap-2 rounded-xl bg-[#006B76] px-6 py-2.5 text-base font-extrabold text-white hover:bg-[#005761] whitespace-nowrap"
                      >
                        <span>Lanjut</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* RONDE 3: BABAK FINAL (2 Kelompok Terbaik, 5 Soal Makna Imbuhan Beragam & Acak) */}
        {currentRound === 3 &&
          phase === 'QUESTION_ACTIVE' &&
          round3Items &&
          currentSortirItem &&
          activeGroup && (
            <div
              key={shakeKey}
              className={`rounded-3xl border-2 border-[#006B76] bg-white p-6 shadow-md sm:p-8 ${
                shakeKey > 0 ? 'animate-shake' : ''
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-[#FFE0B5] px-3.5 py-1.5 text-base font-extrabold text-slate-950">
                    {activeGroup.name}
                    {activeMemberName ? ` · ${activeMemberName}` : ''}
                  </span>
                  <span className="font-mono-num text-sm font-extrabold text-[#006B76]">
                    Soal {sortirItemIndex + 1}/{round3Items.length}
                  </span>
                </div>

                <div
                  className={`flex min-w-[82px] items-center justify-center rounded-xl px-4 py-1.5 font-mono-num text-2xl font-extrabold ${
                    isUrgent
                      ? 'animate-timer-urgent bg-rose-600 text-white'
                      : 'bg-[#004D56] text-[#FCA326]'
                  }`}
                >
                  {timeLeft}s
                </div>
              </div>

              <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  style={{ width: `${progressPct}%` }}
                  className={`h-full transition-all duration-700 ease-linear ${
                    isUrgent ? 'bg-rose-600' : 'bg-[#006B76]'
                  }`}
                />
              </div>

              {/* Draggable Diverse-Affix Word Card */}
              <div className="my-5 flex justify-center">
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', currentSortirItem.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  className="w-full max-w-2xl cursor-grab rounded-3xl border-2 border-[#2BB3C0] bg-[#E4F7F9] px-8 py-6 text-center shadow-sm active:cursor-grabbing"
                >
                  <p className="font-mono-num text-xs font-extrabold text-[#006B76] uppercase">
                    Imbuhan {currentSortirItem.affix} · +20 ⭐ / -10 ⭐
                  </p>
                  <h2 className="mt-1 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                    {currentSortirItem.word}
                  </h2>
                  <p className="mt-2.5 text-base font-medium text-slate-700">
                    “{currentSortirItem.contextSentence}”
                  </p>
                </div>
              </div>

              {/* 3 Keranjang Makna (Click, Keyboard 1-3/A-C, or Drag & Drop) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {currentSortirItem.baskets.map((basket, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSubmitRound3Basket(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverBasket(idx);
                    }}
                    onDragLeave={() => setDragOverBasket(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverBasket(null);
                      onSubmitRound3Basket(idx);
                    }}
                    className={`flex min-h-[112px] flex-col items-center justify-center rounded-2xl border-2 px-5 py-5 text-center transition-all ${
                      dragOverBasket === idx
                        ? 'scale-[1.03] border-[#FCA326] bg-[#FFF8EB] shadow-md'
                        : 'border-[#2BB3C0]/50 bg-[#F2FAFB] text-slate-900 hover:border-[#006B76] hover:bg-[#E4F7F9]'
                    }`}
                  >
                    <span className="mb-1.5 font-mono-num text-xs font-extrabold text-[#006B76]">
                      {idx + 1} / {LETTERS[idx]}
                    </span>
                    <span className="text-lg font-extrabold leading-snug sm:text-xl">
                      {basket}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* RONDE 3: RINGKASAN SETELAH 5 SOAL FINALIS */}
        {currentRound === 3 && phase === 'SORTIR_SUMMARY' && activeGroup && (
          <div className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-[#006B76] bg-white p-7 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-extrabold text-[#006B76] uppercase">
                  Hasil Babak Final
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900">{activeGroup.name}</h2>
              </div>
              <div className="rounded-2xl bg-[#FFE0B5] px-5 py-2.5 font-mono-num text-2xl font-extrabold text-slate-950">
                {sortirRoundDelta >= 0 ? `+${sortirRoundDelta}` : sortirRoundDelta} ⭐
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2.5 text-sm font-extrabold text-slate-700">
                Rekap Kata Salah ({sortirMistakes.length})
              </p>
              {sortirMistakes.length === 0 ? (
                <p className="rounded-2xl bg-[#E4F7F9] px-4 py-3 text-base font-bold text-[#004D56]">
                  Sempurna! Tidak ada kesalahan pada babak final.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                  {sortirMistakes.map((m, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                    >
                      <div>
                        <strong className="text-lg font-extrabold text-slate-900">{m.word}</strong>
                        <span className="ml-2 font-mono-num text-xs font-bold text-[#006B76]">
                          ({m.affix})
                        </span>
                        <span className="ml-2 text-xs text-rose-600">
                          Dipilih: {m.chosenBasket}
                        </span>
                      </div>
                      <span className="rounded-lg bg-[#E4F7F9] px-3 py-1 text-sm font-extrabold text-[#004D56]">
                        Benar: {m.correctBasket}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onNextTurn}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#006B76] px-6 py-3.5 text-lg font-extrabold text-white hover:bg-[#005761]"
            >
              <span>Lanjut</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>

      {/* Pause Overlay */}
      {isPaused && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-[#2BB3C0] bg-white p-8 text-center shadow-2xl">
            <Pause className="mx-auto h-12 w-12 text-[#006B76]" />
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Permainan Dijeda</h2>
            <button
              type="button"
              onClick={onTogglePause}
              className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#006B76] px-6 py-3 text-base font-extrabold text-white hover:bg-[#005761]"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Lanjutkan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
