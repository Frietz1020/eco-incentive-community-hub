import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, ExternalLink, Loader, Image as ImageIcon } from "lucide-react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

function shortAddress(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "--";
}

export default function ActivityFeed({ provider, refreshKey }) {
  const [items, setItems] = useState([]);
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
        const [acts, aws] = await Promise.all([
          c.queryFilter(c.filters.ActionRecorded(), from, "latest"),
          c.queryFilter(c.filters.PointsAwarded(), from, "latest"),
        ]);
        const map = new Map(aws.map(e => [e.transactionHash, { amount: e.args.amount.toString(), newTotal: e.args.newTotal.toString() }]));
        const next = acts.map(e => {
          const a = map.get(e.transactionHash);
          return { txHash: e.transactionHash, block: e.blockNumber, participant: e.args.participant, actionType: e.args.actionType, proofUrl: e.args.proofUrl || "", ts: Number(e.args.timestamp), amount: a?.amount, newTotal: a?.newTotal };
        }).sort((a, b) => b.block - a.block).slice(0, 8);
        if (!cancelled) { setItems(next); setError(""); }
      } catch (err) { if (!cancelled) setError(err?.shortMessage || "Could not load events."); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [provider, refreshKey]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-accent-dim"><Scroll size={18} className="text-accent" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-accent">Ledger</p><h2 className="text-lg font-semibold text-ink-strong">Recent Activity</h2></div>
        </div>
        {loading && <Loader size={16} className="text-faint animate-spin" />}
      </div>
      {items.length === 0 && !loading ? (
        <div className="rounded-bio bg-surface-field border border-line p-6 text-center"><Scroll size={24} className="text-faint mx-auto mb-2" /><p className="text-sm text-muted">No recent actions found.</p></div>
      ) : (
        <div className="grid gap-3"><AnimatePresence>{items.map((it, i) => (
          <motion.a key={it.txHash + it.block} href={`${SNOWTRACE_BASE_URL}/tx/${it.txHash}`} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="block rounded-bio border border-line bg-white p-4 transition-all hover:border-accent/25 hover:shadow-card-hover group cursor-pointer">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="font-semibold text-ink-strong">{it.actionType}</p><ExternalLink size={12} className="text-faint opacity-0 group-hover:opacity-100 transition-opacity" /></div><p className="mt-1 font-mono text-xs text-muted">{shortAddress(it.participant)}</p></div>
              <div className="text-right shrink-0"><p className="text-sm font-bold text-accent">+{it.amount ?? "--"} GP</p><p className="mt-0.5 text-xs text-muted">Total {it.newTotal ?? "--"}</p></div>
            </div>
            {it.proofUrl && (<div className="mt-3"><div className="flex items-center gap-1.5 mb-1.5"><ImageIcon size={12} className="text-primary" /><span className="text-xs font-semibold text-primary">Proof</span></div><img src={it.proofUrl} alt="Proof" className="w-full h-28 object-cover rounded-bio border border-line" onError={e => { e.target.style.display = "none"; }} /></div>)}
            <p className="mt-2 text-xs text-faint">{new Date(it.ts * 1000).toLocaleString()}</p>
          </motion.a>
        ))}</AnimatePresence></div>
      )}
      {error && <p className="mt-3 text-xs text-danger rounded-bio bg-danger/5 px-3 py-2">{error}</p>}
    </motion.div>
  );
}
