import { SNOWTRACE_BASE_URL } from "../lib/constants";

export default function TxStatus({ status }) {
  if (!status?.message) return null;

  const tone =
    status.type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : status.type === "confirmed"
        ? "border-canopy/20 bg-canopy/10 text-ink"
        : "border-river/20 bg-river/10 text-ink";

  return (
    <div className={`rounded-lg border p-4 text-sm ${tone}`}>
      <p className="font-semibold">{status.message}</p>
      {status.hash && (
        <a
          href={`${SNOWTRACE_BASE_URL}/tx/${status.hash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block font-mono text-xs underline"
        >
          View transaction on Snowtrace
        </a>
      )}
    </div>
  );
}
