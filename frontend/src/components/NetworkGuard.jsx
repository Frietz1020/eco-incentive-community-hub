import { motion } from "framer-motion";
import { Globe, ArrowRightLeft, CheckCircle } from "lucide-react";
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
    <div className={`glass-card p-4 transition-all duration-300 ${
      isFuji ? "border-accent/30" : "border-amber/30"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`grid h-9 w-9 place-items-center rounded-bio ${
          isFuji ? "bg-accent-dim" : "bg-amber/10"
        }`}>
          <Globe size={18} className={isFuji ? "text-accent" : "text-amber"} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Network</p>
          <p className="text-sm font-semibold text-ink-strong">
            {isFuji ? "Avalanche Fuji" : chainId ? `Chain ${chainId}` : "Not connected"}
          </p>
        </div>
        {isFuji ? (
          <span className="eco-badge eco-badge-green">
            <CheckCircle size={12} /> Connected
          </span>
        ) : (
          <span className="eco-badge eco-badge-amber">Wrong Network</span>
        )}
      </div>

      {!isFuji && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <button
            type="button"
            onClick={switchToFuji}
            className="eco-btn eco-btn-cyan w-full mt-1 cursor-pointer"
          >
            <ArrowRightLeft size={16} />
            Switch to Fuji
          </button>
        </motion.div>
      )}
    </div>
  );
}
