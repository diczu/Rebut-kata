import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Flame, Home, ShieldCheck, Trophy } from 'lucide-react';
import { Group, RoundNumber } from '../types/game';
import { ConfettiCanvas } from './ConfettiCanvas';
import { RuangguruPrivatLogo } from './RuangguruPrivatLogo';

interface RoundWinnerScreenProps {
  round: RoundNumber;
  groups: Group[];
  finalistGroupIds: string[];
  isLastRound: boolean;
  canGoBack: boolean;
  onGoBack: () => void;
  onGoMainMenu: () => void;
  onContinue: () => void;
}

const ROUND_NAMES: Record<RoundNumber, string> = {
  1: 'Ronde 1: Hakim Kata',
  2: 'Ronde 2: Rebut Makna',
  3: 'Ronde 3: Babak Final',
};

export function RoundWinnerScreen({
  round,
  groups,
  finalistGroupIds,
  isLastRound,
  canGoBack,
  onGoBack,
  onGoMainMenu,
  onContinue,
}: RoundWinnerScreenProps) {
  const sortedByRound = [...groups].sort((a, b) => {
    const rDiff = b.roundScores[round - 1] - a.roundScores[round - 1];
    if (rDiff !== 0) return rDiff;
    return b.totalScore - a.totalScore;
  });

  const sortedByTotal = [...groups].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedByRound[0];
  const finalistSet = new Set(finalistGroupIds);

  return (
    <div className="flex min-h-screen flex-col bg-[#F2FAFB] text-[#1E2428]">
      <ConfettiCanvas active={true} />

      <header className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RuangguruPrivatLogo compact />
            <span className="text-slate-300">|</span>
            <span className="text-sm font-extrabold text-[#006B76]">{ROUND_NAMES[round]}</span>
          </div>

          <div className="flex items-center gap-2">
            {canGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
            )}
            <button
              type="button"
              onClick={onGoMainMenu}
              className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-3 py-1.5 text-xs font-bold text-[#005F69] hover:bg-[#d3f2f5]"
            >
              <Home className="h-4 w-4" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="bg-[#006B76] px-8 py-6 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCA326] text-slate-950 shadow-md">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-xs font-bold tracking-wider text-[#FFE0B5] uppercase">
              Pemenang {ROUND_NAMES[round]}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{winner?.name}</h1>
            <p className="mt-1.5 font-mono-num text-xl font-extrabold text-[#FCA326]">
              +{winner?.roundScores[round - 1] ?? 0} ⭐ di ronde ini
            </p>
          </div>

          <div className="p-7">
            <div className="space-y-2.5">
              {(round === 2 && !isLastRound ? sortedByTotal : sortedByRound).map((g, idx) => {
                const isFinalist = finalistSet.has(g.id);
                return (
                  <motion.div
                    key={g.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 ${
                      round === 2 && !isLastRound && isFinalist
                        ? 'border-[#FCA326] bg-[#FFF8EB]'
                        : idx === 0
                        ? 'border-[#FCA326] bg-[#FFF8EB]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono-num text-sm font-extrabold ${
                          idx === 0
                            ? 'bg-[#FCA326] text-slate-950'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 sm:text-lg">
                        {g.name}
                      </span>
                      {g.streak >= 3 && (
                        <Flame className="h-4 w-4 text-amber-500 fill-amber-400" />
                      )}
                      {round === 2 && !isLastRound && isFinalist && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#006B76] px-2.5 py-0.5 text-xs font-bold text-white">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#FCA326]" />
                          Lolos Final
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 font-mono-num">
                      {round === 2 ? (
                        <span className="text-xs font-bold text-[#006B76]">
                          R1: {g.roundScores[0]} · R2: {g.roundScores[1]}
                        </span>
                      ) : (
                        <span className="hidden text-xs font-bold text-[#006B76] sm:inline">
                          Ronde {round}: {g.roundScores[round - 1]} ⭐
                        </span>
                      )}
                      <span className="rounded-lg bg-[#FFE0B5] px-2.5 py-1 text-sm font-extrabold text-slate-900">
                        Total: {g.totalScore} ⭐
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {round === 2 && !isLastRound && (
              <div className="mt-5 rounded-2xl border border-[#2BB3C0]/40 bg-[#E4F7F9] px-4 py-3 text-center text-sm font-bold text-[#005F69]">
                Hanya 2 kelompok dengan total poin tertinggi (Ronde 1 + Ronde 2) yang melanjutkan ke Ronde 3 (Babak Final).
              </div>
            )}

            <button
              type="button"
              onClick={onContinue}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#006B76] px-8 py-4 text-lg font-extrabold text-white shadow-sm transition-colors hover:bg-[#005761]"
            >
              <span>
                {isLastRound
                  ? 'Lihat Juara Umum'
                  : round === 2
                  ? 'Mulai Ronde 3: Babak Final (2 Terbaik)'
                  : `Lanjut ke Ronde ${round + 1}`}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#FCA326] px-6 py-2 text-center text-xs font-bold text-white">
        Ruangguru Privat Goes to School · Pembentukan Kata PPU
      </footer>
    </div>
  );
}
