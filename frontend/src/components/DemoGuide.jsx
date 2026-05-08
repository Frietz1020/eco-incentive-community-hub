import { CONTRACT_ADDRESS } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

const STEPS = [
  "Connect MetaMask or Core wallet",
  "Switch to Avalanche Fuji C-Chain",
  "Check participant balance",
  "Record a verified eco-action",
  "Open the transaction or contract on Snowtrace",
];

export default function DemoGuide() {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-semibold text-canopy">Presenter flow</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Demo checklist</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <div key={step} className="rounded-md bg-field p-3">
                <p className="text-xs font-semibold uppercase text-canopy">Step {index + 1}</p>
                <p className="mt-1 text-sm text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-line p-4">
          <p className="text-sm font-semibold text-ink">Verification</p>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Add SNOWTRACE_API_KEY to .env, then run Hardhat verify for the deployed
            Fuji address.
          </p>
          {CONTRACT_ADDRESS && (
            <a
              href={`${SNOWTRACE_BASE_URL}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-river underline"
            >
              Contract page
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
