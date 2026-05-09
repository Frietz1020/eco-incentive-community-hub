import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

export default function AdminStatus({ account, provider, refreshKey, onAdminChecked }) {
  const [admin, setAdmin] = useState("");
  const [totalActions, setTotalActions] = useState(null);
  const [error, setError] = useState("");

  const isAdmin =
    Boolean(account && admin) && account.toLowerCase() === admin.toLowerCase();

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      if (!CONTRACT_ADDRESS) return;

      try {
        const contract = getReadContract(provider);
        const [nextAdmin, nextTotalActions] = await Promise.all([
          contract.admin(),
          contract.totalActionsRecorded(),
        ]);

        if (cancelled) return;
        setAdmin(nextAdmin);
        setTotalActions(String(nextTotalActions));
        setError("");
        onAdminChecked?.(nextAdmin);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError?.shortMessage || "Could not load EcoLedger status.");
      }
    }

    loadAdmin();

    return () => {
      cancelled = true;
    };
  }, [provider, refreshKey, onAdminChecked]);

  const shortAdmin = admin ? `${admin.slice(0, 6)}...${admin.slice(-4)}` : "--";

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 place-items-center rounded-bio ${
            isAdmin ? "bg-accent-dim" : "bg-amber/10"
          }`}>
            <Shield size={18} className={isAdmin ? "text-accent" : "text-amber"} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Contract</p>
            <p className="text-sm font-semibold text-ink-strong">Status</p>
          </div>
        </div>
        <span className={`eco-badge ${isAdmin ? "eco-badge-green" : "eco-badge-amber"}`}>
          {isAdmin ? "Admin" : "Read-only"}
        </span>
      </div>

      <div className="grid gap-3">
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Admin</p>
          <p className="font-mono text-xs text-ink-strong" title={admin}>{shortAdmin}</p>
        </div>

        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Actions Recorded</p>
          <motion.p
            key={totalActions}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-primary"
          >
            {totalActions ?? "--"}
          </motion.p>
        </div>
      </div>

      {CONTRACT_ADDRESS && (
        <a
          href={`${SNOWTRACE_BASE_URL}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
        >
          <ExternalLink size={12} />
          View on Snowtrace
        </a>
      )}

      {error && (
        <p className="mt-3 text-xs text-danger rounded-bio bg-danger/5 px-3 py-2">{error}</p>
      )}
    </div>
  );
}
