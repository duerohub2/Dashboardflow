"use client";

import { BoltIcon, LogOutIcon, PlusIcon } from "./Icons";

export function Header({
  total,
  onAdd,
  onLogout,
}: {
  total: number;
  onAdd: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-5 mt-2">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight leading-none flex items-center gap-2">
          <BoltIcon size={28} />
          <span>
            FLOW<span style={{ color: "#b794f6" }}>HUB</span>
          </span>
        </h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="tag" style={{ background: "#00d4ff" }}>
            {total} AKUN
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onLogout}
          className="brut-btn w-12 h-12 flex items-center justify-center"
          style={{ background: "white" }}
          aria-label="Keluar"
        >
          <LogOutIcon size={20} />
        </button>
        <button
          onClick={onAdd}
          className="brut-btn w-12 h-12 flex items-center justify-center"
          style={{ background: "#ffd60a" }}
          aria-label="Tambah akun"
        >
          <PlusIcon size={22} />
        </button>
      </div>
    </div>
  );
}
