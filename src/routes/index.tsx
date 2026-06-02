import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";
import { WalletButton } from "@/components/WalletButton";
import { Facts } from "@/components/Facts";
import { Quiz } from "@/components/Quiz";
import { Puzzle } from "@/components/Puzzle";
import { PortalLink } from "@/components/PortalLink";
import { Leaderboard } from "@/components/Leaderboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GenLayer Hub — Play, Learn & Earn on GenLayer" },
      { name: "description", content: "A gamified dApp for the GenLayer network. Take quizzes, solve puzzles, and submit your scores on-chain." },
      { property: "og:title", content: "GenLayer Hub" },
      { property: "og:description", content: "Play, learn and earn on the GenLayer network." },
    ],
  }),
  component: Hub,
});

function SectionCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="card-cyber p-6 relative overflow-hidden group"
    >
      <div className="absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, transparent, var(--neon-cyan), transparent)", maskImage: "linear-gradient(black, black)", filter: "blur(20px)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function Hub() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur-md bg-background/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="relative">
              <Hexagon className="size-8 text-[var(--neon-cyan)]" strokeWidth={1.5} />
              <Hexagon className="size-8 text-[var(--neon-magenta)] absolute inset-0 rotate-30 opacity-60" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GenLayer<span className="text-gradient"> Hub</span></h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Intelligent Contracts · Gamified</p>
            </div>
          </motion.div>
          <WalletButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--neon-cyan)] mb-3">
            <span className="size-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
            GenLayer Testnet · Online
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Play, learn and <span className="text-gradient">earn</span> on the intelligent chain.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Master GenLayer through trivia & puzzles, then commit your score to the network with a single signed transaction.
          </p>
        </motion.div>
      </section>

      {/* Main grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          <SectionCard delay={0.05}><Facts /></SectionCard>
          <SectionCard delay={0.1}><PortalLink /></SectionCard>
          <SectionCard delay={0.15}><Quiz /></SectionCard>
          <SectionCard delay={0.2}><Puzzle /></SectionCard>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <Leaderboard />
        </motion.div>
      </section>

      <footer className="border-t border-border/60 py-6 text-center text-xs font-mono text-muted-foreground">
        Built for the GenLayer ecosystem · Scores are signed and submitted to a simulated GenLayer contract.
      </footer>
    </div>
  );
}
