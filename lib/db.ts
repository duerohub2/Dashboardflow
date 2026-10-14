import { supabase } from "./supabase";
import type { Account } from "./types";

type Row = {
  id: string;
  name: string;
  url: string;
  credit_limit: number;
  credits: number;
  reset_hour: number;
  credit_date: string;
  last_used: string | null;
  created_at: string;
};

function toAccount(r: Row): Account {
  return {
    id: r.id,
    name: r.name,
    url: r.url,
    limit: r.credit_limit,
    credits: r.credits,
    resetHour: r.reset_hour,
    creditDate: r.credit_date,
    lastUsed: r.last_used ? new Date(r.last_used).getTime() : null,
    createdAt: new Date(r.created_at).getTime(),
  };
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("flow_accounts")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(toAccount);
}

export async function insertAccount(
  acc: Omit<Account, "id" | "createdAt">
): Promise<Account> {
  const { data, error } = await supabase
    .from("flow_accounts")
    .insert({
      name: acc.name,
      url: acc.url,
      credit_limit: acc.limit,
      credits: acc.credits,
      reset_hour: acc.resetHour,
      credit_date: acc.creditDate,
      last_used: acc.lastUsed ? new Date(acc.lastUsed).toISOString() : null,
    })
    .select()
    .single();
  if (error) throw error;
  return toAccount(data as Row);
}

export async function updateAccountDb(
  id: string,
  patch: Partial<Account>
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.url !== undefined) row.url = patch.url;
  if (patch.limit !== undefined) row.credit_limit = patch.limit;
  if (patch.credits !== undefined) row.credits = patch.credits;
  if (patch.resetHour !== undefined) row.reset_hour = patch.resetHour;
  if (patch.creditDate !== undefined) row.credit_date = patch.creditDate;
  if (patch.lastUsed !== undefined)
    row.last_used = patch.lastUsed
      ? new Date(patch.lastUsed).toISOString()
      : null;

  const { error } = await supabase
    .from("flow_accounts")
    .update(row)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAccountDb(id: string): Promise<void> {
  const { error } = await supabase.from("flow_accounts").delete().eq("id", id);
  if (error) throw error;
}
