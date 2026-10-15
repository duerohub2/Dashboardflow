"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { AccountCard } from "@/components/AccountCard";
import { AccountModal } from "@/components/AccountModal";
import { CreditModal } from "@/components/CreditModal";
import { LoginPage } from "@/components/LoginPage";
import { InfoIcon, InboxIcon, SearchIcon } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useAccounts } from "@/hooks/useAccounts";
import { KEYS, load, save } from "@/lib/storage";
import type { Account, PendingLaunch } from "@/lib/types";

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const {
    accounts,
    hydrated,
    add,
    update,
    remove,
    markUsed,
    applyCreditUpdate,
  } = useAccounts(user?.id ?? null);

  const [search, setSearch] = useState("");
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [creditAccount, setCreditAccount] = useState<Account | null>(null);
  const hiddenAtRef = useRef(0);

  const handleLaunch = useCallback(
    (id: string) => {
      const acc = accounts.find((a) => a.id === id);
      if (!acc) return;
      save(KEYS.pending, { id, since: Date.now() } as PendingLaunch);
      markUsed(id);
    },
    [accounts, markUsed]
  );

  useEffect(() => {
    if (!hydrated) return;

    const check = () => {
      if (document.visibilityState === "hidden") {
        hiddenAtRef.current = Date.now();
        return;
      }
      const pending = load<PendingLaunch>(KEYS.pending, null);
      if (!pending) return;
      const awayMs = Date.now() - (hiddenAtRef.current || pending.since);
      if (awayMs < 5000) return;
      const acc = accounts.find((a) => a.id === pending.id);
      if (!acc) {
        save(KEYS.pending, null);
        return;
      }
      setCreditAccount(acc);
      save(KEYS.pending, null);
    };

    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
    };
  }, [accounts, hydrated]);

  const handleSaveAccount = async (data: {
    name: string;
    url: string;
    limit: number;
  }) => {
    if (editingAccount) {
      await update(editingAccount.id, data);
    } else {
      await add({ ...data, resetHour: 0 });
    }
    setAccountModalOpen(false);
    setEditingAccount(null);
  };

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="relative z-10 max-w-lg mx-auto p-4 safe-top safe-bottom">
        <p className="text-center font-black uppercase mt-20">MEMUAT...</p>
      </main>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <main className="relative z-10 max-w-lg mx-auto p-4 safe-top safe-bottom">
      <Header
        total={accounts.length}
        onAdd={() => setAccountModalOpen(true)}
        onLogout={signOut}
      />

      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <SearchIcon size={16} />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="CARI AKUN..."
          className="brut-input w-full text-sm font-black uppercase"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {!hydrated && (
        <p className="text-center font-black uppercase text-sm my-8">
          MEMUAT AKUN...
        </p>
      )}

      <div className="space-y-4">
        {filtered.map((a) => (
          <AccountCard
            key={a.id}
            account={a}
            onLaunch={handleLaunch}
            onEdit={(id) => {
              setEditingAccount(accounts.find((x) => x.id === id) || null);
              setAccountModalOpen(true);
            }}
            onRemove={async (id) => {
              const acc = accounts.find((x) => x.id === id);
              if (acc && confirm(`Hapus akun "${acc.name}"?`)) await remove(id);
            }}
          />
        ))}
      </div>

      {hydrated && accounts.length === 0 && (
        <div
          className="p-8 text-center mt-4 flex flex-col items-center"
          style={{ background: "white", border: "3px dashed #0a0a0a" }}
        >
          <InboxIcon size={48} className="mb-3 opacity-40" />
          <p className="font-black uppercase text-sm">BELUM ADA AKUN</p>
          <p className="text-xs font-mono mt-1 opacity-60">
            TAP TOMBOL + UNTUK TAMBAH
          </p>
        </div>
      )}

      <div
        className="p-4 mt-5 text-xs leading-relaxed"
        style={{
          background: "#ffd60a",
          border: "3px solid #0a0a0a",
          boxShadow: "4px 4px 0 #0a0a0a",
        }}
      >
        <p className="font-black uppercase mb-2 text-sm flex items-center gap-1.5">
          <InfoIcon size={14} />
          <span>CARA PAKAI</span>
        </p>
        <p className="font-medium">1. Tap kartu akun, Flow kebuka di tab baru.</p>
        <p className="font-medium">2. Kerjain di Flow sampai kredit menipis.</p>
        <p className="font-medium">
          3. Balik ke tab ini, popup muncul, isi sisa kredit.
        </p>
        <p className="font-medium">4. Countdown & progress bar update otomatis.</p>
      </div>

      <AccountModal
        open={accountModalOpen}
        editing={editingAccount}
        onClose={() => {
          setAccountModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleSaveAccount}
      />

      <CreditModal
        account={creditAccount}
        onSkip={() => setCreditAccount(null)}
        onSave={async (id, credits, resetHour) => {
          await applyCreditUpdate(id, credits, resetHour);
          setCreditAccount(null);
        }}
      />
    </div>
  );
}
