import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useApp, submitScoreOnChain } from "@/lib/store";

const QUESTIONS = [
  { q: "What language are GenLayer smart contracts written in?", a: ["Solidity", "Rust", "Python", "Move"], c: 2 },
  { q: "What makes GenLayer contracts 'intelligent'?", a: ["Faster gas", "Native LLM calls", "Sharding", "ZK proofs"], c: 1 },
  { q: "GenLayer consensus is best described as...", a: ["Proof of Work", "Optimistic Democracy", "DPoS", "PBFT"], c: 1 },
  { q: "Which is a unique GenLayer capability?", a: ["NFT minting", "On-chain web access", "Token swaps", "Wallet recovery"], c: 1 },
  { q: "Why does GenLayer scale with AI progress?", a: ["More validators", "Smaller blocks", "Better LLMs improve contracts", "Lower fees"], c: 2 },
];

export function Quiz() {
  const { address, addScore } = useApp();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { setI(0); setPicked(null); setScore(0); setDone(false); setSubmitted(false); };

  const pick = (idx: number) => {
    if (picked !== null) return;
    if (!address) { toast.error("Connect your wallet to play", { description: "You need a GenLayer wallet to earn points." }); return; }
    setPicked(idx);
    const correct = idx === QUESTIONS[i].c;
    if (correct) setScore((s) => s + 20);
    setTimeout(() => {
      if (i + 1 >= QUESTIONS.length) setDone(true);
      else { setI(i + 1); setPicked(null); }
    }, 700);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const hash = await submitScoreOnChain("quiz", score);
      addScore("quiz", score);
      setSubmitted(true);
      toast.success("Score submitted on-chain", { description: `Tx: ${hash.slice(0, 10)}...${hash.slice(-6)}` });
    } catch {
      toast.error("Transaction failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[var(--neon-cyan)]">
          <Brain className="size-5" />
          <h3 className="font-semibold tracking-wide">GenLayer Quiz</h3>
        </div>
        {!done && <div className="text-xs font-mono text-muted-foreground">Q{i + 1}/{QUESTIONS.length} · {score} pts</div>}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-medium mb-4 min-h-[3rem]">{QUESTIONS[i].q}</p>
            <div className="grid gap-2">
              {QUESTIONS[i].a.map((opt, idx) => {
                const isCorrect = picked !== null && idx === QUESTIONS[i].c;
                const isWrong = picked === idx && idx !== QUESTIONS[i].c;
                return (
                  <button
                    key={idx}
                    onClick={() => pick(idx)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-all
                      ${isCorrect ? "border-[var(--neon-lime)] bg-[var(--neon-lime)]/10" :
                        isWrong ? "border-destructive bg-destructive/10" :
                        "border-border hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/5"}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                    {isCorrect && <Check className="inline ml-2 size-4 text-[var(--neon-lime)]" />}
                    {isWrong && <X className="inline ml-2 size-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <Trophy className="size-12 text-[var(--neon-lime)] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gradient">{score} pts</div>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Round complete</p>
            {!submitted ? (
              <button onClick={submit} disabled={submitting} className="btn-neon px-5 py-2.5 text-sm inline-flex items-center gap-2">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> Submitting...</> : "Submit Score to Blockchain"}
              </button>
            ) : (
              <button onClick={reset} className="btn-neon px-5 py-2.5 text-sm">Play Again</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
