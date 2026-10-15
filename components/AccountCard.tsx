"use client";

import type { Account } from "@/lib/types";
import { shortenUrl, statusOf, timeAgo, timeUntilReset } from "@/lib/utils";
import { ArrowRightIcon, ClockIcon, CloseIcon, PencilIcon } from "./Icons";

type Props = {
  account: Account;
  onLaunch: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
};

const STATUS_BG: Record<string, string> = {
  Aman: "#00e676",
  Sedang: "#ffd60a",
  Menipis: "#ff9500",
  Habis: "#e0e0e0",
};

export function AccountCard({ account, onLaunch, onEdit, onRemove }: Props) {
  const status = statusOf(account);
  const pct = Math.min((account.credits / account.limit) * 100, 100);
  const reset = timeUntilReset(account.resetHour);
  const bgColor = STATUS_BG[status.label] || "#ffffff";

  return (
    <div className="brut p-4" style={{ background: bgColor }}>
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0 flex-1">
          <p className="font-black uppercase text-base truncate leading-tight">
            {account.name}
          </p>
          <p className="text-[10px] font-mono opacity-60 mt-0.5 truncate">
            {shortenUrl(account.url)}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(account.id)}
            className="brut-tap w-7 h-7 flex items-center justify-center"
            style={{
              background: "#00d4ff",
              border: "2px solid #0a0a0a",
              boxShadow: "2px 2px 0 #0a0a0a",
            }}
            aria-label="Edit"
          >
            <PencilIcon size={12} />
          </button>
          <button
            onClick={() => onRemove(account.id)}
            className="brut-tap w-7 h-7 flex items-center justify-center"
            style={{
              background: "#ff3d3d",
              color: "white",
              border: "2px solid #0a0a0a",
              boxShadow: "2px 2px 0 #0a0a0a",
            }}
            aria-label="Hapus"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span
          className="tag"
          style={{
            background: "#0a0a0a",
            color: status.label === "Aman" ? "#00e676" : "white",
          }}
        >
          {status.label}
        </span>
        <span className="font-mono font-black text-xl leading-none">
          {account.credits}
          <span className="opacity-40">/{account.limit}</span>
        </span>
      </div>

      <div
        className="w-full h-5 mb-3 relative overflow-hidden"
        style={{ border: "3px solid #0a0a0a", background: "white" }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#0a0a0a" }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono font-bold uppercase mb-3 opacity-70">
        <span className="flex items-center gap-1">
          <ClockIcon size={10} /> RESET {reset.text}
        </span>
        <span>{account.lastUsed ? timeAgo(account.lastUsed) : "BELUM"}</span>
      </div>

      <a
        href={`x-safari-${account.url}`}
        onClick={() => onLaunch(account.id)}
        className="brut-btn w-full py-3 text-sm flex items-center justify-center gap-2"
        style={{ background: "#b794f6" }}
      >
        <span>BUKA FLOW</span>
        <ArrowRightIcon size={14} />
      </a>
    </div>
  );
}
