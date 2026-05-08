import { FUJI_CHAIN_ID, FUJI_CHAIN_ID_HEX, FUJI_RPC } from "../lib/constants";

export default function NetworkGuard({ chainId, onNetworkChanged }) {
  const isFuji = Number(chainId) === FUJI_CHAIN_ID;

  async function switchToFuji() {
    if (!window.ethereum) return;

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: FUJI_CHAIN_ID_HEX,
          chainName: "Avalanche Fuji C-Chain",
          nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
          rpcUrls: [FUJI_RPC],
          blockExplorerUrls: ["https://testnet.snowscan.xyz/"],
        },
      ],
    });

    const nextChainId = await window.ethereum.request({ method: "eth_chainId" });
    onNetworkChanged?.(parseInt(nextChainId, 16));
  }

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        isFuji ? "border-canopy/20 bg-canopy/10" : "border-sun/40 bg-sun/10"
      }`}
    >
      <p className="text-sm font-semibold text-ink">Network</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/75">
          {isFuji
            ? "Connected to Avalanche Fuji C-Chain."
            : "Switch to Avalanche Fuji C-Chain to use EcoLedger."}
        </p>
        {!isFuji && (
          <button
            type="button"
            onClick={switchToFuji}
            className="rounded-md bg-river px-4 py-2 text-sm font-semibold text-white transition hover:bg-river/90"
          >
            Switch to Fuji
          </button>
        )}
      </div>
    </div>
  );
}
