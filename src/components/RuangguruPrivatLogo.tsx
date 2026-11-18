export function RuangguruPrivatLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Wordmark gaya Ruangguru Privat */}
      <div className="flex flex-col leading-[0.88] font-extrabold tracking-tight text-[#0F7E89]">
        <span className={compact ? 'text-[13px]' : 'text-[16px]'}>ruang</span>
        <span className="flex items-end gap-0.5">
          <span className={compact ? 'text-[13px]' : 'text-[16px]'}>guru</span>
          <span className="mb-0.5 inline-block h-[2.5px] w-3 rounded-full bg-[#0F7E89]" />
        </span>
      </div>

      <span className="h-6 w-[1.5px] bg-slate-200" aria-hidden="true" />

      <div className="leading-tight">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-extrabold tracking-tight text-[#005F69] ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            ruangguru
          </span>
          <span
            className={`font-extrabold tracking-tight text-[#FCA326] ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            privat
          </span>
        </div>
        {!compact && (
          <div className="text-[11px] font-semibold text-slate-500">
            Rebut Kata PPU · Pembentukan Kata
          </div>
        )}
      </div>
    </div>
  );
}
