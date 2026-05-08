import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";

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
      onTxStatus({
        type: "error",
        message: "Set VITE_ECOLEDGER_ADDRESS after deploying EcoLedger to Fuji.",
      });
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
      onTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Could not read balance.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-river">Lookup</p>
        <h2 className="text-xl font-semibold text-ink">Check GreenPoints</h2>
        <p className="mt-2 text-sm leading-6 text-moss">
          Search any Fuji wallet address to see recorded community contribution.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Wallet address
        <input
          name="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="0x..."
          className="rounded-md border border-line px-3 py-2 font-mono text-sm outline-none focus:border-river"
          required
        />
      </label>

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-river px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-river/90"
      >
        Read Balance
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-field p-4">
          <p className="text-xs font-semibold uppercase text-ink/60">GreenPoints</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{balance ?? "--"}</p>
        </div>
        <div className="rounded-md bg-field p-4">
          <p className="text-xs font-semibold uppercase text-ink/60">Actions</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{actions ?? "--"}</p>
        </div>
      </div>

      <p className="mt-3 rounded-md bg-white text-sm text-moss">
        {Number(balance || 0) > 0 ? "Community Contributor" : "No recorded impact yet"}
      </p>
    </form>
  );
}
