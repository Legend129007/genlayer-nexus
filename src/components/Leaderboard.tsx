import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, short } from "@/lib/store";

export function Leaderboard() {
  const { leaderboard, address } = useApp();
  const ranked = [...leaderboard]
    .map((e) => ({ ...e, total: e.quiz + e.puzzle }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="card-cyber p-6 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5 text-[var(--neon-magenta)]">
          <Trophy className="size-5" />
          <h3 className="font-semibold tracking-wide">Global Leaderboard</h3>
        </div>
        <div className="grid grid-cols-12 text-[10px] font-mono text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Wallet</div>
          <div className="col-span-2 text-right">Quiz</div>
          <div className="col-span-2 text-right">Puzzle</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        <div className="divide-y divide-border/50">
          {ranked.map((e, i) => {
            const me = address && e.address.toLowerCase() === address.toLowerCase();
            return (
              <motion.div
                key={e.address}
                layout
                className={`grid grid-cols-12 py-3 text-sm items-center ${me ? "text-[var(--neon-cyan)]" : ""}`}
              >
                <div className="col-span-1 flex items-center">
                  {i === 0 ? <Medal className="size-4 text-[var(--neon-lime)]" /> :
                   i === 1 ? <Medal className="size-4 text-[var(--neon-cyan)]" /> :
                   i === 2 ? <Medal className="size-4 text-[var(--neon-magenta)]" /> :
                   <span className="font-mono text-muted-foreground">{i + 1}</span>}
                </div>
                <div className="col-span-5 font-mono text-xs">{short(e.address)}{me && <span className="ml-2 text-[10px] uppercase">you</span>}</div>
                <div className="col-span-2 text-right font-mono">{e.quiz}</div>
                <div className="col-span-2 text-right font-mono">{e.puzzle}</div>
                <div className="col-span-2 text-right font-mono font-bold text-gradient">{e.total}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
