import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const FACTS = [
  { t: "Intelligent Smart Contracts", d: "GenLayer contracts can call LLMs natively, enabling AI-powered logic that processes natural language on-chain." },
  { t: "Optimistic Democracy", d: "Consensus is reached by validators running LLMs and voting on the most coherent outcome, securing non-deterministic computation." },
  { t: "Web Access On-Chain", d: "Contracts can fetch and reason about web data, bringing real-world context directly into blockchain execution." },
  { t: "Python-Native", d: "GenLayer contracts are written in Python, drastically lowering the barrier to Web3 development." },
  { t: "Scales With AI", d: "As LLMs improve, GenLayer contracts get smarter automatically — no protocol upgrade needed." },
];

export function Facts() {
  const [i, setI] = useState(0);
  const f = FACTS[i];
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[var(--neon-cyan)]">
        <Sparkles className="size-5" />
        <h3 className="font-semibold tracking-wide">Did You Know?</h3>
      </div>
      <div className="min-h-[180px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-xs font-mono text-muted-foreground mb-2">FACT {String(i + 1).padStart(2, "0")} / {String(FACTS.length).padStart(2, "0")}</div>
            <h4 className="text-2xl font-bold text-gradient mb-3">{f.t}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setI((p) => (p + 1) % FACTS.length)}
        className="mt-6 btn-neon px-4 py-2 text-sm inline-flex items-center gap-2"
      >
        Next Fact <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
