import { ExternalLink, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

export function PortalLink() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-[var(--neon-cyan)]">
        <Globe2 className="size-5" />
        <h3 className="font-semibold tracking-wide">GenLayer Portal</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Visit the official GenLayer portal for docs, the testnet faucet, and the latest network updates.
      </p>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href="https://genlayer.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto btn-neon px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
      >
        Open Portal <ExternalLink className="size-4" />
      </motion.a>
    </div>
  );
}
