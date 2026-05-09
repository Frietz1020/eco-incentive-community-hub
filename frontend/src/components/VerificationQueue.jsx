import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, XSquare, ClipboardList, Image as ImageIcon } from "lucide-react";
import { CONTRACT_ADDRESS, getContract } from "../lib/contract";

function shortAddress(address) {
  if (!address) return "--";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function VerificationQueue({
  requests,
  signer,
  disabled,
  disabledReason,
  onTxStatus,
  onRequestUpdated,
  onApproved,
}) {
  const pendingRequests = requests.filter((request) => request.status === "pending");

  async function approveRequest(request) {
    if (!CONTRACT_ADDRESS) {
      onTxStatus({ type: "error", message: "EcoLedger contract address is not configured." });
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.recordAction(
        request.participant,
        request.actionType,
        BigInt(request.points),
        request.proofImage || ""
      );

      onTxStatus({
        type: "pending",
        message: `Approving ${request.eventName} on-chain...`,
        hash: tx.hash,
      });

      await tx.wait();
      onRequestUpdated(request.id, {
        status: "approved",
        approvedAt: new Date().toISOString(),
        txHash: tx.hash,
      });
      onTxStatus({
        type: "confirmed",
        message: "Verification approved and GreenPoints awarded.",
        hash: tx.hash,
      });
      onApproved?.(request.participant);
    } catch (error) {
      onTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Could not approve verification.",
      });
    }
  }

  function rejectRequest(request) {
    onRequestUpdated(request.id, {
      status: "rejected",
      rejectedAt: new Date().toISOString(),
    });
    onTxStatus({ type: "confirmed", message: "Verification request rejected." });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-primary-dim">
            <ClipboardList size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Verification Desk</p>
            <h2 className="text-lg font-semibold text-ink-strong">Pending Check-Ins</h2>
          </div>
        </div>
        <span className="eco-badge eco-badge-cyan">
          {pendingRequests.length} pending
        </span>
      </div>

      {disabledReason && (
        <div className="mb-4 rounded-bio bg-amber/8 border border-amber/20 px-4 py-2.5 text-sm text-amber">
          {disabledReason}
        </div>
      )}

      {pendingRequests.length === 0 ? (
        <div className="rounded-bio bg-surface-field border border-line p-6 text-center">
          <ClipboardList size={24} className="text-faint mx-auto mb-2" />
          <p className="text-sm text-muted">No participant check-ins are waiting for verification.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {pendingRequests.map((request, index) => (
              <motion.article
                key={request.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-bio border border-line bg-white p-4 hover:border-primary/20 hover:shadow-card transition-all cursor-pointer"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-ink-strong">{request.eventName}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {shortAddress(request.participant)} · {request.eventCode}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {request.proofNote || "No proof note provided."}
                    </p>

                    {/* Proof image preview */}
                    {request.proofImage && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ImageIcon size={12} className="text-primary" />
                          <span className="text-xs font-semibold text-primary">Proof Image</span>
                        </div>
                        <img
                          src={request.proofImage}
                          alt="Proof of action"
                          className="w-full max-w-xs h-32 object-cover rounded-bio border border-line"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-lg font-bold text-accent">+{request.points} GP</p>
                    <p className="mt-1 text-xs text-muted">{request.actionType}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => approveRequest(request)}
                    className="eco-btn eco-btn-primary text-sm py-2.5 cursor-pointer"
                  >
                    <CheckSquare size={15} />
                    Approve & Award
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectRequest(request)}
                    className="eco-btn eco-btn-secondary text-sm py-2.5 cursor-pointer"
                  >
                    <XSquare size={15} />
                    Reject
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
