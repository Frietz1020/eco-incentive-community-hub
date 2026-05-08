export default function ConnectWallet({ account, onConnect }) {
  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-canopy">Wallet</p>
        <h2 className="text-xl font-semibold text-ink">MetaMask/Core connection</h2>
      </div>
      {account ? (
        <div className="rounded-md bg-field px-3 py-2 font-mono text-sm text-ink">
          {shortAddress}
        </div>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="rounded-md bg-canopy px-4 py-2 text-sm font-semibold text-white transition hover:bg-canopy/90"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
