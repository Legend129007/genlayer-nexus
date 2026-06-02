import { create } from "zustand";

export type LeaderEntry = {
  address: string;
  quiz: number;
  puzzle: number;
};

type State = {
  address: string | null;
  balance: string;
  connecting: boolean;
  leaderboard: LeaderEntry[];
  connect: () => Promise<void>;
  disconnect: () => void;
  addScore: (kind: "quiz" | "puzzle", points: number) => void;
};

const truncate = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
export const short = truncate;

const seed: LeaderEntry[] = [
  { address: "0x9f2c1a3b8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f80", quiz: 84, puzzle: 120 },
  { address: "0x12ab34cd56ef7890abcdef1234567890abcdef12", quiz: 60, puzzle: 95 },
  { address: "0xdeadbeefcafebabe0011223344556677889900aa", quiz: 45, puzzle: 70 },
  { address: "0xfeedface00112233445566778899aabbccddeeff", quiz: 30, puzzle: 40 },
];

async function tryGenLayerProvider(): Promise<string | null> {
  const w = globalThis as unknown as { genlayer?: any; ethereum?: any };
  const provider = w.genlayer ?? w.ethereum;
  if (!provider?.request) return null;
  try {
    const accounts: string[] = await provider.request({ method: "eth_requestAccounts" });
    return accounts?.[0] ?? null;
  } catch {
    return null;
  }
}

function mockAddress() {
  const hex = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

export const useApp = create<State>((set, get) => ({
  address: null,
  balance: "0",
  connecting: false,
  leaderboard: seed,
  connect: async () => {
    set({ connecting: true });
    try {
      const real = await tryGenLayerProvider();
      const addr = real ?? mockAddress();
      const bal = (Math.random() * 500 + 25).toFixed(2);
      set({ address: addr, balance: bal, connecting: false });
    } catch {
      set({ connecting: false });
    }
  },
  disconnect: () => set({ address: null, balance: "0" }),
  addScore: (kind, points) => {
    const addr = get().address;
    if (!addr) return;
    const lb = [...get().leaderboard];
    const idx = lb.findIndex((e) => e.address.toLowerCase() === addr.toLowerCase());
    if (idx === -1) {
      lb.push({ address: addr, quiz: kind === "quiz" ? points : 0, puzzle: kind === "puzzle" ? points : 0 });
    } else {
      lb[idx] = { ...lb[idx], [kind]: lb[idx][kind] + points };
    }
    set({ leaderboard: lb });
  },
}));

// Simulated GenLayer contract call
export async function submitScoreOnChain(kind: "quiz" | "puzzle", score: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800));
  const w = globalThis as unknown as { genlayer?: any; ethereum?: any };
  const provider = w.genlayer ?? w.ethereum;
  if (provider?.request) {
    try {
      // best-effort signature; harmless if rejected we fall through to mock hash
      await provider.request({
        method: "personal_sign",
        params: [`GenLayer Hub score submission: ${kind}=${score}`, (await provider.request({ method: "eth_accounts" }))?.[0]],
      });
    } catch { /* ignore */ }
  }
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}
