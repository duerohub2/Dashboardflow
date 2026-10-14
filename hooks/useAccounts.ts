"use client";

import { useCallback, useEffect, useState } from "react";
import type { Account } from "@/lib/types";
import {
  deleteAccountDb,
  fetchAccounts,
  insertAccount,
  updateAccountDb,
} from "@/lib/db";
import { needsReset, todayKey } from "@/lib/utils";

export function useAccounts(userId: string | null) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!userId) {
      setAccounts([]);
      setHydrated(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchAccounts();
        if (cancelled) return;
        const normalized = await Promise.all(
          rows.map(async (a) => {
            if (needsReset(a)) {
              const next = { ...a, credits: a.limit, creditDate: todayKey() };
              await updateAccountDb(a.id, {
                credits: next.credits,
                creditDate: next.creditDate,
              });
              return next;
            }
            return a;
          })
        );
        setAccounts(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const add = useCallback(
    async (data: {
      name: string;
      url: string;
      limit: number;
      resetHour: number;
    }) => {
      const created = await insertAccount({
        ...data,
        credits: data.limit,
        creditDate: todayKey(),
        lastUsed: null,
      });
      setAccounts((prev) => [...prev, created]);
    },
    []
  );

  const update = useCallback(async (id: string, patch: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
    await updateAccountDb(id, patch);
  }, []);

  const remove = useCallback(async (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    await deleteAccountDb(id);
  }, []);

  const markUsed = useCallback(async (id: string) => {
    const ts = Date.now();
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastUsed: ts } : a))
    );
    await updateAccountDb(id, { lastUsed: ts });
  }, []);

  const applyCreditUpdate = useCallback(
    async (id: string, credits: number, resetHour: number) => {
      const patch = {
        credits: Math.max(0, credits),
        resetHour,
        creditDate: todayKey(),
      };
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
      );
      await updateAccountDb(id, patch);
    },
    []
  );

  return {
    accounts,
    hydrated,
    add,
    update,
    remove,
    markUsed,
    applyCreditUpdate,
  };
}
