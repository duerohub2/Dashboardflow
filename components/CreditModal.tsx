"use client";

import { useEffect, useState } from "react";
import type { Account } from "@/lib/types";
import { FilmIcon } from "./Icons";

type Props = {
  account: Account | null;
  onSave: (id: string, credits: number, resetHour: number) => void;
  onSkip: () => void;
};

export function CreditModal({ account, onSave, onSkip }: Props) {
  const [credits, setCredits] = useState(0);
  const [resetHour, setResetHour] = useState(0);

  useEffect(() => {
    if (!account) return;
    setCredits(account.credits);
    setResetHour(account.resetHour);
  }, [account]);

  if (!account) return null;

  return (
    <div className="fixed inset-0 modal-bg z-[60] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md p-5 slide-up"
        style={{
          background: "#00d4ff",
          border: "3px solid #0a0a0a",
          boxShadow: "8px 8px 0 #0a0a0a",
        }}
      >
        <div className="text-center mb-5 flex flex-col items-center">
          <FilmIcon size={36} className="mb-1" />
          <h3 className="font-black uppercase text-xl">UPDATE KREDIT</h3>
          <p className="text-xs font-mono font-bold mt-1 opacity-70">
            {account.name}
          </p>
        </div>

        <label className="block mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
            SISA KREDIT SEKARANG
          </span>
          <input
            autoFocus
            type="number"
            inputMode="numeric"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="brut-input w-full text-2xl font-black text-center"
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
            JAM RESET (0-23)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={23}
            value={resetHour}
            onChange={(e) => setResetHour(Number(e.target.value))}
            className="brut-input w-full text-2xl font-black text-center"
          />
          <p className="text-[10px] font-mono mt-1 opacity-70">
            Jam berapa kredit balik? Contoh: 0 = tengah malam.
          </p>
        </label>

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="brut-btn flex-1 py-3 text-sm"
            style={{ background: "white" }}
          >
            SKIP
          </button>
          <button
            onClick={() => onSave(account.id, credits, resetHour)}
            className="brut-btn flex-1 py-3 text-sm"
            style={{ background: "#00e676" }}
          >
            SIMPAN
          </button>
        </div>
      </div>
    </div>
  );
}
