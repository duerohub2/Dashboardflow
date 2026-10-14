"use client";

import { useState } from "react";
import { BoltIcon } from "./Icons";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!email.trim() || !password.trim()) return setErr("Isi semua field");
    if (password.length < 6) return setErr("Password minimal 6 karakter");
    setBusy(true);
    setErr("");
    try {
      if (mode === "login") await signIn(email.trim(), password);
      else await signUp(email.trim(), password);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative z-10 max-w-lg mx-auto p-4 safe-top safe-bottom">
      <div className="flex justify-center mb-6 mt-8">
        <h1 className="text-3xl font-black uppercase flex items-center gap-2">
          <BoltIcon size={28} />
          <span>
            FLOW<span style={{ color: "#b794f6" }}>HUB</span>
          </span>
        </h1>
      </div>

      <div
        className="p-5"
        style={{
          background: "#ffd60a",
          border: "3px solid #0a0a0a",
          boxShadow: "8px 8px 0 #0a0a0a",
        }}
      >
        <h2 className="font-black uppercase text-xl mb-4 text-center">
          {mode === "login" ? "MASUK" : "DAFTAR"}
        </h2>

        <label className="block mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
            EMAIL
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="brut-input w-full"
            placeholder="nama@email.com"
          />
        </label>

        <label className="block mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
            PASSWORD
          </span>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="brut-input w-full"
            placeholder="min 6 karakter"
          />
        </label>

        {err && (
          <p
            className="text-xs font-mono font-bold p-2 mb-3"
            style={{
              background: "#ff3d3d",
              color: "white",
              border: "2px solid #0a0a0a",
            }}
          >
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="brut-btn w-full py-3 text-sm mb-3"
          style={{ background: busy ? "#888" : "#00e676" }}
        >
          {busy ? "..." : mode === "login" ? "MASUK" : "DAFTAR"}
        </button>

        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setErr("");
          }}
          className="w-full text-xs font-black uppercase underline text-center"
        >
          {mode === "login"
            ? "Belum punya akun? Daftar"
            : "Sudah punya akun? Masuk"}
        </button>
      </div>
    </main>
  );
}
