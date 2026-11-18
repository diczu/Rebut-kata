import { useState } from 'react';
import { BookOpen, Play, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { GroupConfigInput, RoundMode } from '../types/game';
import { QuestionBankModal } from './QuestionBankModal';
import { RuangguruPrivatLogo } from './RuangguruPrivatLogo';

interface SetupScreenProps {
  initialGroupCount: 3 | 4 | 5;
  initialGroupConfigs: GroupConfigInput[];
  initialRoundMode: RoundMode;
  isMuted: boolean;
  hasActiveSession: boolean;
  onResumeSession: () => void;
  onToggleMute: () => void;
  onStartGame: (
    groupCount: 3 | 4 | 5,
    groupConfigs: GroupConfigInput[],
    roundMode: RoundMode
  ) => void;
}

const MODE_OPTIONS: { value: RoundMode; label: string; desc: string }[] = [
  { value: 'ALL', label: 'Mainkan Semua (Ronde 1–3)', desc: 'Alur lengkap hingga Juara Umum' },
  { value: '1', label: 'Ronde 1: Hakim Kata', desc: '5 soal per kelompok bergiliran' },
  { value: '2', label: 'Ronde 2: Rebut Makna', desc: '5 soal berurutan per kelompok + rebutan' },
  { value: '3', label: 'Ronde 3: Babak Final', desc: '5 soal makna imbuhan beragam' },
];

export function SetupScreen({
  initialGroupCount,
  initialGroupConfigs,
  initialRoundMode,
  isMuted,
  hasActiveSession,
  onResumeSession,
  onToggleMute,
  onStartGame,
}: SetupScreenProps) {
  const [groupCount, setGroupCount] = useState<3 | 4 | 5>(initialGroupCount);
  const [groupConfigs, setGroupConfigs] = useState<GroupConfigInput[]>(initialGroupConfigs);
  const [roundMode, setRoundMode] = useState<RoundMode>(initialRoundMode);
  const [showBankModal, setShowBankModal] = useState(false);

  const handleGroupChange = (
    idx: number,
    field: 'name' | 'membersText',
    value: string
  ) => {
    setGroupConfigs((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const activeGroups = groupConfigs.slice(0, groupCount);

  return (
    <div className="flex min-h-screen flex-col bg-[#F2FAFB] text-[#1E2428]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
          <RuangguruPrivatLogo />

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowBankModal(true)}
              className="flex min-h-[42px] items-center gap-2 rounded-xl border border-[#2BB3C0]/50 bg-[#E4F7F9] px-3.5 py-2 text-sm font-bold text-[#005F69] hover:bg-[#d3f2f5] whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4" />
              <span>Bank Soal</span>
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              title={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
              aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5 text-[#0F7E89]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-7">
        {/* Hero strip gaya Ruangguru Privat */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#006B76] to-[#2BB3C0] px-7 py-6 text-white shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#FFE0B5] uppercase">
              UTBK-SNBT · Pengetahuan & Pemahaman Umum
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Rebut Kata PPU — Kuis 3 Ronde
            </h1>
          </div>

          {hasActiveSession && (
            <button
              type="button"
              onClick={onResumeSession}
              className="flex min-h-[46px] shrink-0 items-center gap-2 rounded-xl bg-[#FCA326] px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-sm hover:bg-[#ffb245] whitespace-nowrap"
            >
              <RotateCw className="h-4 w-4" />
              <span>Lanjutkan Kuis Berjalan</span>
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6">
            {/* Jumlah Kelompok & Pilihan Ronde */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-[#FFE0B5]" />
                  <h2 className="text-sm font-extrabold text-[#005F69] uppercase">
                    Jumlah Kelompok
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {([3, 4, 5] as const).map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGroupCount(count)}
                      className={`min-h-[48px] rounded-xl border-2 font-mono-num text-lg font-extrabold transition-colors ${
                        groupCount === count
                          ? 'border-[#006B76] bg-[#006B76] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#2BB3C0]'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded bg-[#FFE0B5]" />
                  <h2 className="text-sm font-extrabold text-[#005F69] uppercase">
                    Pilihan Ronde
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRoundMode(opt.value)}
                      className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                        roundMode === opt.value
                          ? 'border-[#006B76] bg-[#E4F7F9] text-[#004D56]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-extrabold sm:text-sm">{opt.label}</div>
                      <div className="text-[11px] font-medium text-slate-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nama Kelompok & Anggota */}
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded bg-[#FFE0B5]" />
                <h2 className="text-sm font-extrabold text-[#005F69] uppercase">
                  Nama Kelompok & Anggota (Opsional)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeGroups.map((g, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="bg-[#006B76] px-3.5 py-1.5 text-xs font-bold text-white">
                      Kelompok {idx + 1}
                    </div>
                    <div className="p-3">
                      <input
                        type="text"
                        value={g.name}
                        onChange={(e) => handleGroupChange(idx, 'name', e.target.value)}
                        placeholder={`Kelompok ${idx + 1}`}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 focus:border-[#006B76] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={g.membersText}
                        onChange={(e) => handleGroupChange(idx, 'membersText', e.target.value)}
                        placeholder="Anggota: Budi, Sari, ... (opsional)"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#006B76] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Mulai */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onStartGame(groupCount, groupConfigs, roundMode)}
                className="flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#006B76] px-8 py-4 text-xl font-extrabold text-white shadow-md transition-transform hover:scale-[1.01] hover:bg-[#005761] active:scale-[0.99]"
              >
                <Play className="h-6 w-6 fill-current text-[#FCA326]" />
                <span>Mulai Kuis Baru</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Ruangguru Privat */}
      <footer className="bg-[#FCA326] px-6 py-2.5 text-center text-xs font-bold text-white">
        Ruangguru Privat Goes to School · Pembentukan Kata PPU Kelas 12
      </footer>

      <QuestionBankModal open={showBankModal} onClose={() => setShowBankModal(false)} />
    </div>
  );
}
