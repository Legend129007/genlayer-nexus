import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle as PuzzleIcon, Loader2, Trophy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useApp, submitScoreOnChain } from "@/lib/store";

const WORDS = ["CONSENSUS", "VALIDATOR", "INTELLIGENT", "GENLAYER", "CONTRACT"];

function scramble(w: string) {
  const a = w.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const s = a.join("");
  return s === w ? scramble(w) : s;
}

export function Puzzle() {
  const { address, addScore } = useApp();
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const scrambled = useMemo(() => scramble(word), [word]);
  const [guess, setGuess] = useState("");
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [won]);

  const seconds = Math.floor((now - start) / 1000);

  const submit = () => {
    if (!address) { toast.error("Connect your wallet to play"); return; }
    if (guess.toUpperCase() === word) {
      const pts = Math.max(20, 200 - seconds * 2);
      setScore(pts);
      setWon(true);
    } else {
      toast.error("Not quite — try again");
    }
  };

  const reset = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w); setGuess(""); setWon(false); setSubmitted(false); setScore(0);
  };

  const sendChain = async () => {
    setSubmitting(true);
    try {
      const hash = await submitScoreOnChain("puzzle", score);
      addScore("puzzle", score);
      setSubmitted(true);
      toast.success("Score submitted on-chain", { description: `Tx: ${hash.slice(0, 10)}...${hash.slice(-6)}` });
    } catch { toast.error("Transaction failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[var(--neon-cyan)]">
          <PuzzleIcon className="size-5" />
          <h3 className="font-semibold tracking-wide">GenLayer Puzzles</h3>
        </div>
        <div className="text-xs font-mono text-muted-foreground">Word Scramble · {seconds}s</div>
      </div>

      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-xs text-muted-foreground mb-2">Unscramble the GenLayer term:</p>
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {scrambled.split("").map((c, idx) => (
                <div key={idx} className="size-10 grid place-items-center rounded-md border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 font-mono text-lg font-bold text-[var(--neon-cyan)]">
                  {c}
                </div>
              ))}
            </div>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Your answer..."
              className="w-full bg-input/50 border border-border rounded-md px-3 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:border-[var(--neon-cyan)] mb-3"
            />
            <div className="flex gap-2">
              <button onClick={submit} className="btn-neon px-4 py-2 text-sm flex-1">Check</button>
              <button onClick={reset} className="card-cyber px-3 py-2 text-sm" aria-label="New word">
                <RefreshCw className="size-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="won" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <Trophy className="size-12 text-[var(--neon-lime)] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gradient">{score} pts</div>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Solved in {seconds}s</p>
            {!submitted ? (
              <button onClick={sendChain} disabled={submitting} className="btn-neon px-5 py-2.5 text-sm inline-flex items-center gap-2">
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
