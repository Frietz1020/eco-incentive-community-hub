import { ethers } from "ethers";
import { CONTRACT_ADDRESS, getContract } from "../lib/contract";

const ACTION_TYPES = ["Tree Planting", "Waste Cleanup", "Recycling Drive", "Volunteer Hours"];
const PRESETS = [
  { label: "Tree +25", actionType: "Tree Planting", points: "25" },
  { label: "Cleanup +15", actionType: "Waste Cleanup", points: "15" },
  { label: "Recycle +10", actionType: "Recycling Drive", points: "10" },
];

export default function AdminPanel({
  signer,
  disabled,
  disabledReason,
  onTxStatus,
  onActionRecorded,
}) {
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

    try {
      const pointsToAward = BigInt(points);
      const contract = getContract(signer);
      const tx = await contract.recordAction(participant, actionType, pointsToAward);
      onTxStatus({ type: "pending", message: "Recording eco-action on Fuji...", hash: tx.hash });

      await tx.wait();
      onTxStatus({ type: "confirmed", message: "Eco-action recorded.", hash: tx.hash });
      onActionRecorded?.(participant);
      event.currentTarget.reset();
    } catch (error) {
      onTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Transaction failed.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-canopy">Step 1</p>
        <h2 className="text-xl font-semibold text-ink">Record verified eco-action</h2>
        <p className="mt-2 text-sm leading-6 text-moss">
          Enter the participant wallet, choose the verified activity, then submit the
          on-chain transaction.
        </p>
        {disabledReason && (
          <p className="mt-3 rounded-md bg-sun/10 px-3 py-2 text-sm text-amber-800">
            {disabledReason}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Participant address
          <input
            name="participant"
            placeholder="0x..."
            className="rounded-md border border-line px-3 py-2 font-mono text-sm outline-none focus:border-canopy"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Action type
          <select
            name="actionType"
            className="rounded-md border border-line px-3 py-2 outline-none focus:border-canopy"
            defaultValue={ACTION_TYPES[0]}
          >
            {ACTION_TYPES.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          GreenPoints
          <input
            name="points"
            type="number"
            min="1"
            step="1"
            placeholder="25"
            className="rounded-md border border-line px-3 py-2 outline-none focus:border-canopy"
            required
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Demo presets</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={(event) => {
                  const form = event.currentTarget.form;
                  form.elements.actionType.value = preset.actionType;
                  form.elements.points.value = preset.points;
                }}
                className="rounded-md border border-canopy/25 px-2 py-2 text-xs font-semibold text-canopy transition hover:bg-canopy/10"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-5 w-full rounded-md bg-canopy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-canopy/90 disabled:cursor-not-allowed disabled:bg-moss/40"
      >
        Record Action
      </button>
    </form>
  );
}
