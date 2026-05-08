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
      onTxStatus({
        type: "error",
        message: "EcoLedger contract address is not configured.",
      });
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.recordAction(
        request.participant,
        request.actionType,
        BigInt(request.points)
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
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-canopy">Verification desk</p>
          <h2 className="text-xl font-semibold text-ink">Pending participant check-ins</h2>
          <p className="mt-2 text-sm leading-6 text-moss">
            Review off-chain event attendance, then approve it into an on-chain
            GreenPoints award.
          </p>
        </div>
        <span className="rounded-full bg-field px-3 py-1 text-xs font-semibold text-moss">
          {pendingRequests.length} pending
        </span>
      </div>

      {disabledReason && (
        <p className="mb-4 rounded-md bg-sun/10 px-3 py-2 text-sm text-amber-800">
          {disabledReason}
        </p>
      )}

      {pendingRequests.length === 0 ? (
        <p className="rounded-md bg-field p-4 text-sm text-moss">
          No participant check-ins are waiting for verification.
        </p>
      ) : (
        <div className="grid gap-3">
          {pendingRequests.map((request) => (
            <article key={request.id} className="rounded-md border border-line p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-ink">{request.eventName}</p>
                  <p className="mt-1 font-mono text-xs text-moss">
                    {shortAddress(request.participant)} · {request.eventCode}
                  </p>
                  <p className="mt-2 text-sm text-moss">
                    {request.proofNote || "No proof note provided."}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm font-semibold text-canopy">+{request.points} GP</p>
                  <p className="mt-1 text-xs text-moss">{request.actionType}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => approveRequest(request)}
                  className="rounded-md bg-canopy px-3 py-2 text-sm font-semibold text-white transition hover:bg-canopy/90 disabled:cursor-not-allowed disabled:bg-moss/40"
                >
                  Approve and Award
                </button>
                <button
                  type="button"
                  onClick={() => rejectRequest(request)}
                  className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-field"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
