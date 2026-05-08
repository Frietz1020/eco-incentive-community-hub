import { ethers } from "ethers";
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
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-river">Step 2</p>
        <h2 className="text-xl font-semibold text-ink">Transfer admin</h2>
        <p className="mt-2 text-sm leading-6 text-moss">
          Move verifier control to a different team wallet after deployment or handoff.
        </p>
        {disabledReason && (
          <p className="mt-3 rounded-md bg-sun/10 px-3 py-2 text-sm text-amber-800">
            {disabledReason}
          </p>
        )}
      </div>

      <label className="grid gap-2 text-sm font-medium text-ink">
        New admin address
        <input
          name="newAdmin"
          placeholder="0x..."
          className="rounded-md border border-line px-3 py-2 font-mono text-sm outline-none focus:border-river"
          required
        />
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="mt-4 w-full rounded-md bg-river px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-river/90 disabled:cursor-not-allowed disabled:bg-moss/40"
      >
        Transfer Admin
      </button>
    </form>
  );
}
