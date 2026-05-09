import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Loader, Medal } from "lucide-react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";

function shortAddress(addr) { return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "--"; }

const RANK = [
  { bg: "bg-amber/10", text: "text-amber", ring: "ring-amber/30" },
  { bg: "bg-gray-300/15", text: "text-gray-400", ring: "ring-gray-300/20" },
  { bg: "bg-amber-700/10", text: "text-amber-600", ring: "ring-amber-700/20" },
];

export default function Leaderboard({ provider, refreshKey }) {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!CONTRACT_ADDRESS) return;
      setLoading(true);
      try {
        const c = getReadContract(provider);
        const latest = await c.runner.provider.getBlockNumber();
        const from = Math.max(0, latest - 2000);
        const aws = await c.queryFilter(c.filters.PointsAwarded(), from, "latest");
        const totals = new Map();
        for (const e of aws) totals.set(e.args.participant.toLowerCase(), { address: e.args.participant, total: Number(e.args.newTotal) });
        const next = Array.from(totals.values()).sort((a, b) => b.total - a.total).slice(0, 5);
        if (!cancelled) { setLeaders(next); setError(""); }
      } catch (err) { if (!cancelled) setError(err?.shortMessage || "Could not load leaderboard."); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [provider, refreshKey]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-amber/10"><Trophy size={18} className="text-amber" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-amber">Impact</p><h2 className="text-lg font-semibold text-ink-strong">Leaderboard</h2></div>
        </div>
        {loading && <Loader size={16} className="text-faint animate-spin" />}
      </div>
      {leaders.length === 0 && !loading ? (
        <div className="rounded-bio bg-surface-field border border-line p-6 text-center"><Trophy size={24} className="text-faint mx-auto mb-2" /><p className="text-sm text-muted">No GreenPoints awarded yet.</p></div>
      ) : (
        <ol className="grid gap-2"><AnimatePresence>{leaders.map((l, i) => {
          const r = RANK[i] || { bg: "bg-surface-field", text: "text-muted", ring: "ring-line" };
          return (
            <motion.li key={l.address} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center justify-between gap-3 rounded-bio border border-line bg-white px-4 py-3 hover:border-amber/20 hover:shadow-card transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-full ring-2 ${r.bg} ${r.ring}`}>
                  {i < 3 ? <Medal size={16} className={r.text} /> : <span className="text-sm font-bold text-muted">{i + 1}</span>}
                </span>
                <span className="font-mono text-sm text-ink-strong">{shortAddress(l.address)}</span>
              </div>
              <span className="text-sm font-bold text-accent">{l.total} GP</span>
            </motion.li>
          );
        })}</AnimatePresence></ol>
      )}
      {error && <p className="mt-3 text-xs text-danger rounded-bio bg-danger/5 px-3 py-2">{error}</p>}
    </motion.div>
  );
}
