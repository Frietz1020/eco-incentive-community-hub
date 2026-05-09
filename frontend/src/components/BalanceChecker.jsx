import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Search, Leaf, Activity } from "lucide-react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined) return;
    const target = Number(value);
    const start = display;
    const duration = 600;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }

    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span>{display}</span>;
}

export default function BalanceChecker({ provider, watchedAddress, refreshKey, onTxStatus }) {
  const [address, setAddress] = useState(watchedAddress || "");
  const [balance, setBalance] = useState(null);
  const [actions, setActions] = useState(null);

  useEffect(() => {
    if (watchedAddress) setAddress(watchedAddress);
  }, [watchedAddress]);

  useEffect(() => {
    if (watchedAddress && refreshKey > 0) checkBalance(watchedAddress);
  }, [refreshKey]);

  async function handleSubmit(event) {
    event.preventDefault();
    await checkBalance(address);
  }

  async function checkBalance(addressToCheck) {
    if (!CONTRACT_ADDRESS) {
      onTxStatus({ type: "error", message: "Set VITE_ECOLEDGER_ADDRESS after deploying EcoLedger to Fuji." });
      return;
    }

    if (!ethers.isAddress(addressToCheck)) {
      onTxStatus({ type: "error", message: "Enter a valid wallet address to check." });
      return;
    }

    try {
      const contract = getReadContract(provider);
      const [nextBalance, nextActions] = await Promise.all([
        contract.getPoints(addressToCheck),
        contract.actionCount(addressToCheck),
      ]);
      setBalance(String(nextBalance));
      setActions(String(nextActions));
      onTxStatus({ type: "confirmed", message: "Balance loaded from EcoLedger." });
    } catch (error) {
      onTxStatus({ type: "error", message: error?.shortMessage || error?.message || "Could not read balance." });
    }
  }

  const tier =
    Number(balance || 0) >= 100
      ? { label: "Eco Champion", color: "text-accent" }
      : Number(balance || 0) >= 50
        ? { label: "Green Advocate", color: "text-primary" }
        : Number(balance || 0) > 0
          ? { label: "Community Contributor", color: "text-amber" }
          : { label: "No recorded impact yet", color: "text-muted" };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card p-5"
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-primary-dim">
            <Search size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Lookup</p>
            <h2 className="text-lg font-semibold text-ink-strong">Check GreenPoints</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">Search any Fuji wallet to see recorded community impact.</p>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Wallet Address</span>
        <input
          name="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="0x..."
          className="eco-input font-mono"
          required
        />
      </label>

      <button type="submit" className="eco-btn eco-btn-cyan w-full mt-4 cursor-pointer">
        <Search size={16} />
        Read Balance
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="stat-card">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Leaf size={14} className="text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">GreenPoints</p>
          </div>
          <p className="text-3xl font-bold text-accent">
            {balance !== null ? <AnimatedNumber value={balance} /> : "--"}
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Activity size={14} className="text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Actions</p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {actions !== null ? <AnimatedNumber value={actions} /> : "--"}
          </p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className={`text-sm font-semibold ${tier.color}`}>{tier.label}</span>
      </div>
    </motion.form>
  );
}
