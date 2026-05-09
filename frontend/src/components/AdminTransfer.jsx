import { ethers } from "ethers";
import { motion } from "framer-motion";
import { ArrowRightLeft, AlertTriangle } from "lucide-react";
import { CONTRACT_ADDRESS, getContract } from "../lib/contract";

export default function AdminTransfer({
  signer,
  disabled,
  disabledReason,
  onTxStatus,
  onAdminTransferred,
}) {
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newAdmin = String(formData.get("newAdmin") || "").trim();

    if (!CONTRACT_ADDRESS) {
      onTxStatus({
        type: "error",
        message: "Set VITE_ECOLEDGER_ADDRESS before transferring admin.",
      });
      return;
    }

    if (!ethers.isAddress(newAdmin)) {
      onTxStatus({ type: "error", message: "Enter a valid new admin address." });
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.transferAdmin(newAdmin);
      onTxStatus({ type: "pending", message: "Transferring EcoLedger admin...", hash: tx.hash });

      await tx.wait();
      onTxStatus({ type: "confirmed", message: "EcoLedger admin transferred.", hash: tx.hash });
      onAdminTransferred?.(newAdmin);
      form.reset();
    } catch (error) {
      onTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Admin transfer failed.",
      });
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-amber/10">
            <ArrowRightLeft size={18} className="text-amber" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber">Ownership</p>
            <h2 className="text-lg font-semibold text-ink-strong">Transfer Admin</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Transfer verifier control to a different team wallet. This action is irreversible.
        </p>

        {disabledReason && (
          <div className="mt-3 rounded-bio bg-amber/8 border border-amber/20 px-4 py-2.5 text-sm text-amber">
            {disabledReason}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 rounded-bio bg-danger/5 border border-danger/15 px-4 py-2.5">
        <AlertTriangle size={14} className="text-danger shrink-0" />
        <p className="text-xs text-danger">This cannot be undone. Double-check the address below.</p>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">New Admin Address</span>
        <input name="newAdmin" placeholder="0x..." className="eco-input font-mono" required />
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="eco-btn eco-btn-danger w-full mt-5 cursor-pointer"
      >
        <ArrowRightLeft size={16} />
        Transfer Admin
      </button>
    </motion.form>
  );
}
