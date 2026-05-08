import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";

function shortAddress(address) {
  if (!address) return "--";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Leaderboard({ provider, refreshKey }) {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      if (!CONTRACT_ADDRESS) return;

      setLoading(true);
      try {
        const contract = getReadContract(provider);
        const latestBlock = await contract.runner.provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 5000);
        const awards = await contract.queryFilter(
          contract.filters.PointsAwarded(),
          fromBlock,
          "latest"
        );

        const totals = new Map();
        for (const event of awards) {
          totals.set(event.args.participant.toLowerCase(), {
            address: event.args.participant,
            total: Number(event.args.newTotal),
          });
        }

        const nextLeaders = Array.from(totals.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        if (cancelled) return;
        setLeaders(nextLeaders);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError?.shortMessage || "Could not load leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [provider, refreshKey]);

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-moss">Impact</p>
          <h2 className="text-xl font-semibold text-ink">Leaderboard</h2>
        </div>
        {loading && <span className="text-xs font-semibold text-ink/50">Loading</span>}
      </div>

      {leaders.length === 0 ? (
        <p className="rounded-md bg-field p-4 text-sm text-ink/70">
          No GreenPoints have been awarded yet.
        </p>
      ) : (
        <ol className="grid gap-2">
          {leaders.map((leader, index) => (
            <li
              key={leader.address}
              className="flex items-center justify-between gap-3 rounded-md bg-field px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-semibold text-canopy">
                  {index + 1}
                </span>
                <span className="font-mono text-sm text-ink">{shortAddress(leader.address)}</span>
              </div>
              <span className="text-sm font-semibold text-ink">{leader.total} GP</span>
            </li>
          ))}
        </ol>
      )}

      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
