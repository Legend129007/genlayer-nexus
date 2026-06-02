import { motion } from "framer-motion";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp, short } from "@/lib/store";

export function WalletButton() {
  const { address, balance, connect, disconnect, connecting } = useApp();

  if (!address) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={async () => {
          await connect();
          toast.success("Wallet connected", { description: "Welcome to GenLayer Hub." });
        }}
        disabled={connecting}
        className="btn-neon px-5 py-2.5 flex items-center gap-2 text-sm"
      >
        {connecting ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
        {connecting ? "Connecting..." : "Connect Wallet"}
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="card-cyber px-4 py-2 flex items-center gap-3">
        <div className="size-2 rounded-full bg-[var(--neon-lime)] shadow-[0_0_10px_var(--neon-lime)]" />
        <div className="text-xs leading-tight">
          <div className="font-mono text-foreground">{short(address)}</div>
          <div className="text-muted-foreground">{balance} GEN</div>
        </div>
      </div>
      <button
        onClick={() => { disconnect(); toast("Wallet disconnected"); }}
        className="card-cyber p-2.5 hover:text-accent transition"
        aria-label="Disconnect"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
