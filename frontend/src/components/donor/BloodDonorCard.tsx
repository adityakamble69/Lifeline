import { Droplet, Download } from "lucide-react";

interface Props {
  name: string;
  bloodGroup: string;
  donorId: string;
  memberSince: string;
}

export function BloodDonorCard({
  name,
  bloodGroup,
  donorId,
  memberSince,
}: Props) {
  const qrData = encodeURIComponent(
    JSON.stringify({ id: donorId, name, blood: bloodGroup }),
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <Droplet className="h-4 w-4" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold">Lifeline</p>
            <p className="text-[9px] uppercase tracking-wider text-white/70">
              Blood Donor Network
            </p>
          </div>
        </div>
        <button
          suppressHydrationWarning
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-semibold hover:bg-white/25"
        >
          <Download className="h-3 w-3" aria-hidden />
          Download
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-navy">{name}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">
                  Blood Group
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 font-bold text-primary">
                  <Droplet className="h-3 w-3" aria-hidden />
                  {bloodGroup}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">
                  Donor ID
                </p>
                <p className="mt-0.5 font-mono text-[11px] font-semibold text-navy">
                  LF{donorId.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">
                  Member Since
                </p>
                <p className="mt-0.5 text-xs font-semibold text-navy">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="Donor QR code" width={100} height={100} />
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 text-center">
        <p className="font-['Brush_Script_MT',_cursive] text-base text-primary">
          Give Blood, Give Hope
        </p>
      </div>
    </div>
  );
}