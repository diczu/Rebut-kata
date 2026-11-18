import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import {
  ALL_ROUND3_BANK,
  HAKIM_KATA_BANK,
  REBUT_MAKNA_BANK,
  ROUND_1_FORMULAS,
  TIE_BREAKER_BANK,
} from '../data/questionBank';
import { RoundNumber } from '../types/game';

interface QuestionBankModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuestionBankModal({ open, onClose }: QuestionBankModalProps) {
  const [activeTab, setActiveTab] = useState<RoundNumber>(1);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bank-soal-title"
    >
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#2BB3C0]/40 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#006B76] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#FCA326]" />
            <h2 id="bank-soal-title" className="text-xl font-bold">
              Bank Soal Materi PPU
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Tutup bank soal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-[#F2FAFB] px-6 py-3">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 1
                ? 'bg-[#006B76] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Ronde 1: Hakim Kata ({HAKIM_KATA_BANK.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 2
                ? 'bg-[#FCA326] text-slate-950'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Ronde 2: Rebut Makna ({REBUT_MAKNA_BANK.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 3
                ? 'bg-[#004D56] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Ronde 3: Babak Final ({ALL_ROUND3_BANK.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 1 && (
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {HAKIM_KATA_BANK.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="mr-2 font-mono-num text-xs text-slate-400">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-bold text-slate-900">{q.phrase}</span>
                    <p className="mt-0.5 text-xs text-slate-600">{q.oneLineExplanation}</p>
                  </div>
                  <span className="shrink-0 font-mono-num text-xs font-bold text-[#006B76]">
                    {ROUND_1_FORMULAS[q.category].label} ({ROUND_1_FORMULAS[q.category].formula})
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {REBUT_MAKNA_BANK.map((q, idx) => (
                <div key={q.id} className="space-y-1 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-slate-900">
                      <span className="mr-2 font-mono-num text-xs text-slate-400">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {q.sentenceBefore}
                      <strong className="font-bold text-[#006B76] underline decoration-[#FCA326] decoration-2 underline-offset-2">
                        {q.targetWord}
                      </strong>
                      {q.sentenceAfter}
                    </span>
                    <span className="font-mono-num text-xs font-bold text-[#006B76]">
                      {q.affix}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Jawaban: <strong className="text-slate-900">{q.options[q.correctIndex]}</strong> ·{' '}
                    {q.oneLineExplanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-5">
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                {ALL_ROUND3_BANK.map((item, idx) => (
                  <div key={item.id} className="space-y-1 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="mr-2 font-mono-num text-xs text-slate-400">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <strong className="text-slate-900">{item.word}</strong>
                        <span className="ml-2 text-xs text-slate-600">“{item.contextSentence}”</span>
                      </div>
                      <span className="font-mono-num text-xs font-bold text-[#006B76]">
                        {item.affix}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pilihan: {item.baskets.join(' | ')} · Jawaban:{' '}
                      <strong className="text-[#006B76]">{item.baskets[item.correctBasketIndex]}</strong> ·{' '}
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-xs font-extrabold tracking-wide text-[#006B76] uppercase">
                  Soal Penentu ({TIE_BREAKER_BANK.length})
                </h3>
                <div className="divide-y divide-slate-200 rounded-2xl border border-[#FCA326]/50 bg-[#FFF8EB]/50">
                  {TIE_BREAKER_BANK.map((q, idx) => (
                    <div key={q.id} className="space-y-1 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-slate-900">
                          <span className="mr-2 font-mono-num text-xs text-slate-400">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          {q.sentenceBefore}
                          <strong className="font-bold text-[#006B76] underline decoration-[#FCA326] decoration-2 underline-offset-2">
                            {q.targetWord}
                          </strong>
                          {q.sentenceAfter}
                        </span>
                        <span className="font-mono-num text-xs font-bold text-[#006B76]">
                          {q.affix}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Jawaban: <strong className="text-slate-900">{q.options[q.correctIndex]}</strong> ·{' '}
                        {q.oneLineExplanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
