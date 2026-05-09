import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { ClipboardCheck, Leaf, Trash2, Recycle, Clock } from "lucide-react";
import { CONTRACT_ADDRESS, getContract } from "../lib/contract";
import ImageProofInput from "./ImageProofInput";

const ACTION_TYPES = ["Tree Planting", "Waste Cleanup", "Recycling Drive", "Volunteer Hours"];
const PRESETS = [
  { label: "Tree +25", actionType: "Tree Planting", points: "25", icon: Leaf },
  { label: "Cleanup +15", actionType: "Waste Cleanup", points: "15", icon: Trash2 },
  { label: "Recycle +10", actionType: "Recycling Drive", points: "10", icon: Recycle },
];

export default function AdminPanel({
  signer,
  disabled,
  disabledReason,
  onTxStatus,
  onActionRecorded,
}) {
  const [proofImage, setProofImage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const participant = String(form.get("participant") || "").trim();
    const actionType = String(form.get("actionType") || "");
    const points = String(form.get("points") || "").trim();

    if (!CONTRACT_ADDRESS) {
      onTxStatus({
        type: "error",
        message: "Set VITE_ECOLEDGER_ADDRESS after deploying EcoLedger to Fuji.",
      });
      return;
    }

    if (!ethers.isAddress(participant)) {
      onTxStatus({ type: "error", message: "Enter a valid participant wallet address." });
      return;
    }

    if (!points || Number(points) <= 0) {
      onTxStatus({ type: "error", message: "Points must be greater than 0." });
      return;
    }

    try {
      const pointsToAward = BigInt(points);
      const contract = getContract(signer);
      // Pass proof image data URL (or empty string) as the proofUrl on-chain
      const tx = await contract.recordAction(participant, actionType, pointsToAward, proofImage);
      onTxStatus({ type: "pending", message: "Recording eco-action on Fuji...", hash: tx.hash });

      await tx.wait();
      onTxStatus({ type: "confirmed", message: "Eco-action recorded successfully!", hash: tx.hash });
      onActionRecorded?.(participant);
      event.currentTarget.reset();
      setProofImage("");
    } catch (error) {
      onTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Transaction failed.",
      });
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5"
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-accent-dim">
            <ClipboardCheck size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Direct Record</p>
            <h2 className="text-lg font-semibold text-ink-strong">Record Verified Action</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Enter the participant wallet, choose the activity, attach proof image, then submit.
        </p>
        {disabledReason && (
          <div className="mt-3 rounded-bio bg-amber/8 border border-amber/20 px-4 py-2.5 text-sm text-amber">
            {disabledReason}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Participant Address</span>
          <input name="participant" placeholder="0x..." className="eco-input font-mono" required />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Action Type</span>
          <select name="actionType" className="eco-select" defaultValue={ACTION_TYPES[0]}>
            {ACTION_TYPES.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">GreenPoints</span>
          <input name="points" type="number" min="1" step="1" placeholder="25" className="eco-input" required />
        </label>

        <ImageProofInput value={proofImage} onChange={setProofImage} label="Proof Image" />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Quick Presets</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={(event) => {
                    const form = event.currentTarget.form;
                    form.elements.actionType.value = preset.actionType;
                    form.elements.points.value = preset.points;
                  }}
                  className="eco-btn eco-btn-secondary text-xs py-2 px-2 cursor-pointer"
                >
                  <Icon size={14} />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="eco-btn eco-btn-primary w-full mt-5 cursor-pointer"
      >
        <ClipboardCheck size={16} />
        Record Action
      </button>
    </motion.form>
  );
}
