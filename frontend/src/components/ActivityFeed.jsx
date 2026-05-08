import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, getReadContract } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

function shortAddress(address) {
  if (!address) return "--";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ActivityFeed({ provider, refreshKey }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      if (!CONTRACT_ADDRESS) return;

      setLoading(true);
      try {
        const contract = getReadContract(provider);
        const latestBlock = await contract.runner.provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 5000);
        const [actions, awards] = await Promise.all([
          contract.queryFilter(contract.filters.ActionRecorded(), fromBlock, "latest"),
          contract.queryFilter(contract.filters.PointsAwarded(), fromBlock, "latest"),
        ]);

        const awardsByTx = new Map(
          awards.map((event) => [
            event.transactionHash,
            {
              amount: event.args.amount.toString(),
              newTotal: event.args.newTotal.toString(),
            },
          ])
        );

        const nextItems = actions
          .map((event) => {
            const award = awardsByTx.get(event.transactionHash);
            return {
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              participant: event.args.participant,
              actionType: event.args.actionType,
              timestamp: Number(event.args.timestamp),
              amount: award?.amount,
              newTotal: award?.newTotal,
            };
          })
          .sort((a, b) => b.blockNumber - a.blockNumber)
          .slice(0, 6);

        if (cancelled) return;
        setItems(nextItems);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError?.shortMessage || "Could not load recent events.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [provider, refreshKey]);

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-canopy">Ledger</p>
          <h2 className="text-xl font-semibold text-ink">Recent on-chain activity</h2>
        </div>
        {loading && <span className="text-xs font-semibold text-ink/50">Loading</span>}
      </div>

      {items.length === 0 ? (
        <p className="rounded-md bg-field p-4 text-sm text-ink/70">
          No recent EcoLedger actions found yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <a
              key={`${item.transactionHash}-${item.blockNumber}`}
              href={`${SNOWTRACE_BASE_URL}/tx/${item.transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line p-3 transition hover:border-river/40 hover:bg-field"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{item.actionType}</p>
                  <p className="mt-1 font-mono text-xs text-ink/60">
                    {shortAddress(item.participant)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-canopy">
                    +{item.amount ?? "--"} GP
                  </p>
                  <p className="mt-1 text-xs text-ink/50">Total {item.newTotal ?? "--"}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-ink/50">
                {new Date(item.timestamp * 1000).toLocaleString()}
              </p>
            </a>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}
