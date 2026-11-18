import { useState } from 'react';
import { ArrowLeft, Home, Zap } from 'lucide-react';
import { Group, Round2Question } from '../types/game';
import { RuangguruPrivatLogo } from './RuangguruPrivatLogo';

interface TieBreakerScreenProps {
  title: string;
  subtitle?: string;
  tiedGroups: Group[];
  question: Round2Question;
  canGoBack: boolean;
  onGoBack: () => void;
  onGoMainMenu: () => void;
  onResolve: (winnerGroupId: string) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export function TieBreakerScreen({
  title,
  subtitle,
  tiedGroups,
  question,
  canGoBack,
  onGoBack,
  onGoMainMenu,
  onResolve,
}: TieBreakerScreenProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [wrongGroupIds, setWrongGroupIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChooseOption = (idx: number) => {
    if (!selectedGroupId) return;
    if (idx === question.correctIndex) {
      onResolve(selectedGroupId);
      return;
    }

    const nextWrong = [...wrongGroupIds, selectedGroupId];
    setWrongGroupIds(nextWrong);
    setSelectedGroupId(null);
    setFeedback('Kurang tepat! Kelompok imbang lainnya boleh mencoba.');

    const remaining = tiedGroups.filter((g) => !nextWrong.includes(g.id));
    if (remaining.length === 1) {
      onResolve(remaining[0].id);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F2FAFB] text-[#1E2428]">
      <header className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RuangguruPrivatLogo compact />
            <span className="rounded-lg bg-[#FFF8EB] px-3 py-1 text-xs font-extrabold text-[#B45309]">
              Soal Penentu Cepat
            </span>
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

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-8">
        <div className="rounded-3xl border-2 border-[#FCA326] bg-white p-7 shadow-lg">
          <div className="flex items-center gap-2.5 text-[#D97706]">
            <Zap className="h-6 w-6 fill-[#FCA326]" />
            <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {subtitle ||
              'Pilih kelompok imbang yang lebih dulu menjawab, lalu ketuk pilihan jawabannya (+5 ⭐ penentu).'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {tiedGroups.map((g) => {
              const isOut = wrongGroupIds.includes(g.id);
              const isActive = selectedGroupId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  disabled={isOut}
                  onClick={() => {
                    setSelectedGroupId(g.id);
                    setFeedback(null);
                  }}
                  className={`min-h-[46px] rounded-xl border-2 px-5 py-2 text-base font-extrabold transition-all ${
                    isActive
                      ? 'border-[#FCA326] bg-[#FCA326] text-slate-950 shadow-sm'
                      : isOut
                      ? 'border-slate-200 bg-slate-100 text-slate-400 line-through opacity-50'
                      : 'border-[#2BB3C0] bg-[#E4F7F9] text-[#005F69] hover:border-[#006B76]'
                  }`}
                >
                  {g.name} ({g.totalScore} ⭐)
                </button>
              );
            })}
          </div>

          {feedback && (
            <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
              {feedback}
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-extrabold tracking-wide text-[#006B76] uppercase">
              Makna imbuhan {question.affix} pada kata bercetak tebal?
            </p>
            <p className="mt-2 text-2xl font-medium text-slate-900">
              “{question.sentenceBefore}
              <strong className="rounded bg-[#FFE0B5] px-1.5 font-extrabold text-slate-950">
                {question.targetWord}
              </strong>
              {question.sentenceAfter}”
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!selectedGroupId}
                onClick={() => handleChooseOption(idx)}
                className="flex min-h-[68px] items-center gap-3.5 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-[#006B76] hover:bg-[#E4F7F9] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCA326] font-mono-num text-base font-extrabold text-slate-950">
                  {LETTERS[idx]}
                </span>
                <span className="text-base font-bold text-slate-900">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
