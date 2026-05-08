import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

export default function AdminStatus({ account, provider, refreshKey, onAdminChecked }) {
  const [admin, setAdmin] = useState("");
  const [totalActions, setTotalActions] = useState(null);
  const [error, setError] = useState("");

  const isAdmin =
    Boolean(account && admin) && account.toLowerCase() === admin.toLowerCase();

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      if (!CONTRACT_ADDRESS) return;

      try {
        const contract = getReadContract(provider);
        const [nextAdmin, nextTotalActions] = await Promise.all([
          contract.admin(),
          contract.totalActionsRecorded(),
        ]);

        if (cancelled) return;
        setAdmin(nextAdmin);
        setTotalActions(String(nextTotalActions));
        setError("");
        onAdminChecked?.(nextAdmin);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError?.shortMessage || "Could not load EcoLedger status.");
      }
    }

    loadAdmin();

    return () => {
      cancelled = true;
    };
  }, [provider, refreshKey, onAdminChecked]);

  return (
    <div className="rounded-lg border border-line bg-white p-4 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
        <p className="font-semibold text-ink">Contract status</p>
          <p className="mt-1 text-ink/70">
            {isAdmin ? "Connected wallet is admin." : "Connect the admin wallet to record actions."}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isAdmin ? "bg-canopy/15 text-canopy" : "bg-sun/15 text-amber-800"
          }`}
        >
          {isAdmin ? "Admin" : "Read-only"}
        </span>
      </div>

      <dl className="mt-4 grid gap-3">
        <div>
          <dt className="text-xs font-semibold uppercase text-ink/50">Admin</dt>
          <dd className="mt-1 break-all font-mono text-xs text-ink">{admin || "--"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-ink/50">Actions recorded</dt>
          <dd className="mt-1 text-2xl font-semibold text-ink">{totalActions ?? "--"}</dd>
        </div>
      </dl>

      {CONTRACT_ADDRESS && (
        <a
          href={`${SNOWTRACE_BASE_URL}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-xs font-semibold text-river underline"
        >
          View contract on Snowtrace
        </a>
      )}

      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
