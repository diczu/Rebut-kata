import { Minus, Pause, Play, Plus, SkipForward, Undo2, Volume2, VolumeX, X } from 'lucide-react';
import { Group } from '../types/game';

interface TeacherPanelModalProps {
  open: boolean;
  isPaused: boolean;
  isMuted: boolean;
  canUndo: boolean;
  groups: Group[];
  onClose: () => void;
  onSkip: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onUndo: () => void;
  onAdjustScore: (groupId: string, delta: number) => void;
}

export function TeacherPanelModal({
  open,
  isPaused,
  isMuted,
  canUndo,
  groups,
  onClose,
  onSkip,
  onTogglePause,
  onToggleMute,
  onUndo,
  onAdjustScore,
}: TeacherPanelModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-panel-title"
    >
      <div className="w-full max-w-lg rounded-3xl border border-teal-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 id="teacher-panel-title" className="text-lg font-extrabold text-slate-900">
              Panel Kontrol Guru
            </h2>
            <p className="text-xs text-slate-500">Tekan tombol H untuk menutup atau membuka</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Tutup panel guru"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onSkip();
              onClose();
            }}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            <SkipForward className="h-4 w-4 text-teal-700" />
            <span>Lewati Soal</span>
          </button>

          <button
            type="button"
            onClick={onTogglePause}
            className={`flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${
              isPaused
                ? 'border-yellow-400 bg-yellow-400 text-slate-900'
                : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
            }`}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4 text-teal-700" />}
            <span>{isPaused ? 'Lanjutkan' : 'Jeda Waktu'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUndo();
              onClose();
            }}
            disabled={!canUndo}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-40"
          >
            <Undo2 className="h-4 w-4 text-teal-700" />
            <span>Urungkan Terakhir</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-600" /> : <Volume2 className="h-4 w-4 text-teal-700" />}
            <span>{isMuted ? 'Suara Bisu' : 'Suara Aktif'}</span>
          </button>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2.5 text-sm font-bold text-slate-800">
            Koreksi Skor Manual (⭐)
          </p>
          <div className="space-y-2">
            {groups.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2"
              >
                <div className="min-w-0">
                  <span className="truncate font-bold text-slate-900">{g.name}</span>
                  <span className="ml-2 font-mono-num text-sm font-extrabold text-amber-600">
                    {g.totalScore} ⭐
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdjustScore(g.id, -5)}
                    className="flex h-9 items-center gap-0.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 font-mono-num text-xs font-extrabold text-rose-700 hover:bg-rose-100"
                  >
                    <Minus className="h-3.5 w-3.5" />5
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustScore(g.id, 5)}
                    className="flex h-9 items-center gap-0.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 font-mono-num text-xs font-extrabold text-teal-800 hover:bg-teal-100"
                  >
                    <Plus className="h-3.5 w-3.5" />5
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
