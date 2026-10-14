"use client";

import { useEffect, useState } from "react";
import type { Account } from "@/lib/types";
import { CloseIcon } from "./Icons";

type Props = {
  open: boolean;
  editing: Account | null;
  onClose: () => void;
  onSave: (data: { name: string; url: string; limit: number }) => void;
};

export function AccountModal({ open, editing, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setUrl(editing.url);
      setLimit(editing.limit);
    } else {
      setName("");
      setUrl("");
      setLimit(50);
    }
  }, [open, editing]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return alert("Nama wajib diisi");
    if (!url.trim()) return alert("URL wajib diisi");
    if (!/^https?:\/\//i.test(url.trim()))
      return alert("URL harus http:// atau https://");
    onSave({ name: name.trim(), url: url.trim(), limit: Number(limit) || 50 });
  };

  return (
    <div
      className="fixed inset-0 modal-bg z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg p-5 pb-8 sm:pb-5 slide-up safe-bottom"
        style={{
          background: "#ffd60a",
          border: "3px solid #0a0a0a",
          boxShadow: "8px 8px 0 #0a0a0a",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black uppercase text-xl">
            {editing ? "EDIT AKUN" : "TAMBAH AKUN"}
          </h3>
          <button
            onClick={onClose}
            className="brut-tap w-8 h-8 flex items-center justify-center"
            style={{
              background: "#ff3d3d",
              color: "white",
              border: "2px solid #0a0a0a",
              boxShadow: "2px 2px 0 #0a0a0a",
            }}
            aria-label="Tutup"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <Field label="NAMA AKUN">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Akun Kerja"
            className="brut-input w-full"
          />
        </Field>

        <Field label="URL GOOGLE FLOW">
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            rows={3}
            placeholder="https://labs.google/fx/tools/flow?authuser=0"
            className="brut-input w-full resize-none font-mono text-xs"
          />
        </Field>

        <Field label="LIMIT KREDIT / HARI">
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="brut-input w-full"
          />
        </Field>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="brut-btn flex-1 py-3 text-sm"
            style={{ background: "white" }}
          >
            BATAL
          </button>
          <button
            onClick={handleSave}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-3">
      <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
