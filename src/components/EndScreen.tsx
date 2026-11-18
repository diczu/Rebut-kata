import { useEffect } from 'react';
import { ArrowLeft, Home, RotateCcw, Trophy } from 'lucide-react';
import { Group, RoundWinnerRecord } from '../types/game';
import { ConfettiCanvas } from './ConfettiCanvas';
import { RuangguruPrivatLogo } from './RuangguruPrivatLogo';
import { soundEngine } from '../utils/sound';

interface EndScreenProps {
  groups: Group[];
  roundWinners: RoundWinnerRecord[];
  canGoBack: boolean;
  onGoBack: () => void;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
}

export function EndScreen({
  groups,
  roundWinners,
  canGoBack,
  onGoBack,
  onPlayAgain,
  onBackToSetup,
}: EndScreenProps) {
  useEffect(() => {
    soundEngine.playVictory();
  }, []);

  const ranked = [...groups].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return a.wrongCount - b.wrongCount;
  });

  const first = ranked[0];
  const second = ranked[1];
  const third = ranked[2];

  return (
    <div className="flex min-h-screen flex-col bg-[#F2FAFB] text-[#1E2428]">
      <ConfettiCanvas active={true} />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <RuangguruPrivatLogo compact />
          <div className="flex flex-wrap items-center gap-2">
            {canGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToSetup}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-3.5 py-2 text-xs font-bold text-[#005F69] hover:bg-[#d3f2f5]"
            >
              <Home className="h-4 w-4" />
              <span>Menu Utama</span>
            </button>
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex min-h-[40px] items-center gap-2 rounded-xl bg-[#006B76] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#005761]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <div className="text-center">
          <p className="text-xs font-extrabold tracking-wider text-[#006B76] uppercase">
            Hasil Akhir Kuis 3 Ronde
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Juara Umum Rebut Kata PPU
          </h1>
        </div>

        {/* Podium Juara 1 - 3 */}
        <section className="mt-8 grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
          <div className="order-2 sm:order-1">
            {second && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 font-mono-num text-xl font-extrabold text-slate-800">
                  2
                </div>
                <p className="text-xs font-extrabold text-slate-500 uppercase">Juara 2</p>
                <h2 className="mt-1 truncate text-2xl font-extrabold text-slate-900">
                  {second.name}
                </h2>
                <p className="mt-2 font-mono-num text-3xl font-extrabold text-[#D97706]">
                  {second.totalScore} ⭐
                </p>
              </div>
            )}
          </div>

          <div className="order-1 sm:order-2">
            {first && (
              <div className="rounded-3xl border-2 border-[#FCA326] bg-[#006B76] p-8 text-center text-white shadow-xl">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCA326] text-slate-950 shadow-md">
                  <Trophy className="h-9 w-9" />
                </div>
                <p className="text-xs font-extrabold tracking-wider text-[#FFE0B5] uppercase">
                  Juara Umum 1
                </p>
                <h2 className="mt-1 truncate text-3xl font-extrabold text-white">
                  {first.name}
                </h2>
                <p className="mt-2 font-mono-num text-4xl font-extrabold text-[#FCA326]">
                  {first.totalScore} ⭐
                </p>
              </div>
            )}
          </div>

          <div className="order-3">
            {third && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE0B5] font-mono-num text-xl font-extrabold text-[#9A3412]">
                  3
                </div>
                <p className="text-xs font-extrabold text-slate-500 uppercase">Juara 3</p>
                <h2 className="mt-1 truncate text-2xl font-extrabold text-slate-900">
                  {third.name}
                </h2>
                <p className="mt-2 font-mono-num text-3xl font-extrabold text-[#D97706]">
                  {third.totalScore} ⭐
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Rekap Pemenang Tiap Babak */}
        {roundWinners.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="mb-4 text-lg font-extrabold text-[#005F69]">
              Rekap Pemenang Tiap Ronde
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {roundWinners.map((rw) => (
                <div
                  key={rw.round}
                  className="rounded-2xl border border-[#2BB3C0]/40 bg-[#E4F7F9]/70 p-4"
                >
                  <p className="text-xs font-extrabold text-[#006B76] uppercase">
                    Ronde {rw.round}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {rw.winnerNames.join(' & ')}
                  </p>
                  <p className="mt-0.5 font-mono-num text-sm font-extrabold text-[#D97706]">
                    {rw.topRoundScore} ⭐
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabel Peringkat Semua Kelompok */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="mb-4 text-lg font-extrabold text-[#005F69]">Peringkat Lengkap</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase">
                  <th className="py-2.5 pr-4">Peringkat</th>
                  <th className="py-2.5 pr-4">Kelompok</th>
                  <th className="py-2.5 pr-4 text-right">R1</th>
                  <th className="py-2.5 pr-4 text-right">R2</th>
                  <th className="py-2.5 pr-4 text-right">R3</th>
                  <th className="py-2.5 text-right">Total Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                {ranked.map((g, idx) => (
                  <tr key={g.id}>
                    <td className="py-3 pr-4 font-mono-num font-extrabold text-slate-700">
                      #{idx + 1}
                    </td>
                    <td className="py-3 pr-4 font-extrabold text-slate-900">{g.name}</td>
                    <td className="py-3 pr-4 text-right font-mono-num text-slate-600">
                      {g.roundScores[0]} ⭐
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-num text-slate-600">
                      {g.roundScores[1]} ⭐
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-num text-slate-600">
                      {g.roundScores[2]} ⭐
                    </td>
                    <td className="py-3 text-right font-mono-num text-lg font-extrabold text-[#D97706]">
                      {g.totalScore} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="bg-[#FCA326] px-6 py-2 text-center text-xs font-bold text-white">
        Ruangguru Privat Goes to School · Pembentukan Kata PPU
      </footer>
    </div>
  );
}
