import { motion } from "framer-motion";
import { Wallet, CheckCircle } from "lucide-react";

export default function ConnectWallet({ account, onConnect }) {
  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="grid h-9 w-9 place-items-center rounded-bio bg-primary-dim">
          <Wallet size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Wallet</p>
          <h2 className="text-sm font-semibold text-ink-strong">Connection</h2>
        </div>
      </div>

      {account ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-bio bg-accent-dim px-4 py-3"
        >
          <CheckCircle size={14} className="text-accent shrink-0" />
          <span className="font-mono text-sm text-accent-dark font-semibold">{shortAddress}</span>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="eco-btn eco-btn-cyan w-full cursor-pointer"
        >
          <Wallet size={16} />
          Connect Wallet
        </button>
      )}
    </div>
  );
}
