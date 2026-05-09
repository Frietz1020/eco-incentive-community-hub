import { useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Zap } from "lucide-react";
import ActivityFeed from "./components/ActivityFeed";
import AdminPanel from "./components/AdminPanel";
import AdminStatus from "./components/AdminStatus";
import AdminTransfer from "./components/AdminTransfer";
import BalanceChecker from "./components/BalanceChecker";
import BlockchainBackground from "./components/BlockchainBackground";
import ConnectWallet from "./components/ConnectWallet";
import DemoGuide from "./components/DemoGuide";
import Leaderboard from "./components/Leaderboard";
import NetworkGuard from "./components/NetworkGuard";
import ParticipantCheckIn from "./components/ParticipantCheckIn";
import RoleTabs from "./components/RoleTabs";
import TxStatus from "./components/TxStatus";
import VerificationQueue from "./components/VerificationQueue";
import { CONTRACT_ADDRESS } from "./lib/contract";
import { FUJI_CHAIN_ID } from "./lib/constants";

const REQUESTS_KEY = "ecoledger.verificationRequests";
function loadStored() { try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); } catch { return []; } }

const pv = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

export default function App() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(0);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [watchedAddress, setWatchedAddress] = useState("");
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);
  const [adminAddress, setAdminAddress] = useState("");
  const [activeRole, setActiveRole] = useState("participant");
  const [verificationRequests, setVerificationRequests] = useState(loadStored);

  const isFuji = Number(chainId) === FUJI_CHAIN_ID;
  const isAdmin = Boolean(account && adminAddress) && account.toLowerCase() === adminAddress.toLowerCase();
  const canWrite = Boolean(account && signer && isFuji && CONTRACT_ADDRESS && isAdmin);
  const readProvider = isFuji ? provider : null;

  const disabledReason = useMemo(() => {
    if (!CONTRACT_ADDRESS) return "EcoLedger contract address is not configured.";
    if (!account) return "Connect MetaMask or Core wallet first.";
    if (!isFuji) return "Switch to Avalanche Fuji before recording actions.";
    if (!isAdmin) return "Connected wallet is not the EcoLedger admin.";
    return "";
  }, [account, isAdmin, isFuji]);

  const networkLabel = useMemo(() => {
    if (!chainId) return "Not connected";
    return isFuji ? "Fuji C-Chain" : `Chain ${chainId}`;
  }, [chainId, isFuji]);

  const roleLabel = isAdmin ? "Admin" : account ? "Participant" : "Viewer";
  const roleMeta = {
    admin: { eyebrow: "Admin Console", title: "Verify & Issue GreenPoints", summary: "Approve real-world eco-actions and record them permanently on Avalanche." },
    participant: { eyebrow: "Participant Portal", title: "Track Your Impact", summary: "Submit event attendance with proof photos for admin review, then track your GreenPoints." },
    public: { eyebrow: "Public Ledger", title: "Audit Community Progress", summary: "Browse emitted events, leaderboard rankings, and Snowtrace evidence." },
  }[activeRole];

  async function connectWallet() {
    if (!window.ethereum) { setTxStatus({ type: "error", message: "Install MetaMask or Core wallet to continue." }); return; }
    try {
      const bp = new BrowserProvider(window.ethereum);
      const accs = await bp.send("eth_requestAccounts", []);
      const s = await bp.getSigner();
      const n = await bp.getNetwork();
      setProvider(bp); setSigner(s); setAccount(accs[0] || ""); setWatchedAddress(accs[0] || ""); setChainId(Number(n.chainId));
      setTxStatus({ type: "confirmed", message: "Wallet connected successfully." });
    } catch (err) { setTxStatus({ type: "error", message: err?.shortMessage || err?.message || "Could not connect wallet." }); }
  }

  function saveRequests(nr) { setVerificationRequests(nr); localStorage.setItem(REQUESTS_KEY, JSON.stringify(nr)); }
  function addVerificationRequest(r) { saveRequests([r, ...verificationRequests]); }
  function updateVerificationRequest(id, patch) { saveRequests(verificationRequests.map(r => r.id === id ? { ...r, ...patch } : r)); }

  useEffect(() => {
    if (!window.ethereum) return;
    const ha = (accs) => { const a = accs[0] || ""; setAccount(a); setWatchedAddress(a); if (!a) setSigner(null); };
    const hc = (c) => setChainId(parseInt(c, 16));
    window.ethereum.on("accountsChanged", ha); window.ethereum.on("chainChanged", hc);
    return () => { window.ethereum.removeListener("accountsChanged", ha); window.ethereum.removeListener("chainChanged", hc); };
  }, []);

  return (
    <main className="min-h-screen relative">
      <BlockchainBackground />

      {/* Header */}
      <header className="border-b border-line bg-surface-overlay backdrop-blur-md sticky top-0 z-50 relative">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="grid h-11 w-11 place-items-center rounded-bio-lg bg-accent-dim shadow-glow-green">
              <Leaf size={22} className="text-accent" />
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-bold text-ink-strong tracking-tight">EcoLedger</h1>
              <p className="text-xs text-muted font-sans">Avalanche Fuji Sustainability Ledger</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="glass-card px-3 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${isFuji ? "bg-accent animate-pulse-slow" : chainId ? "bg-amber" : "bg-faint"}`} />
                <span className="text-xs font-semibold text-ink-strong">{networkLabel}</span>
              </div>
              <div className="w-px h-4 bg-line" />
              <span className="eco-badge eco-badge-green text-xs">{roleLabel}</span>
            </div>
            {CONTRACT_ADDRESS && (
              <div className="glass-card px-3 py-2">
                <p className="font-mono text-xs text-muted">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[320px_1fr] relative z-10">
        <aside className="grid gap-4 self-start">
          <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} isAdmin={isAdmin} />
          <ConnectWallet account={account} onConnect={connectWallet} />
          <NetworkGuard chainId={chainId} onNetworkChanged={setChainId} />
          <AdminStatus account={account} provider={readProvider} refreshKey={activityRefreshKey} onAdminChecked={setAdminAddress} />
          <TxStatus status={txStatus} />
        </aside>

        <div className="grid gap-5">
          <motion.section key={activeRole + "-h"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{roleMeta.eyebrow}</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink-strong tracking-tight">{roleMeta.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{roleMeta.summary}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="stat-card"><p className="text-xs font-semibold text-muted mb-1">Role</p><p className="text-sm font-bold text-ink-strong">{roleLabel}</p></div>
                <div className="stat-card"><p className="text-xs font-semibold text-muted mb-1">Network</p><p className="text-sm font-bold text-ink-strong">{isFuji ? "Fuji" : "Check"}</p></div>
                <div className="stat-card"><p className="text-xs font-semibold text-muted mb-1">Contract</p><div className="flex items-center justify-center gap-1"><Zap size={12} className={CONTRACT_ADDRESS ? "text-accent" : "text-danger"} /><p className="text-sm font-bold text-ink-strong">{CONTRACT_ADDRESS ? "Live" : "Missing"}</p></div></div>
              </div>
            </div>
          </motion.section>

          <AnimatePresence mode="wait">
            {activeRole === "admin" && (
              <motion.section key="admin" variants={pv} initial="initial" animate="animate" exit="exit" className="grid gap-5">
                <div className="glass-card p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-xs font-semibold text-accent uppercase tracking-wider">Prerequisites</p><h3 className="text-base font-semibold text-ink-strong">Admin wallet + Fuji network required</h3></div>
                    <span className={`eco-badge ${canWrite ? "eco-badge-green" : "eco-badge-amber"}`}>{canWrite ? "✓ Ready" : "Setup needed"}</span>
                  </div>
                </div>
                <div className="grid gap-5 xl:grid-cols-2">
                  <VerificationQueue requests={verificationRequests} signer={signer} disabled={!canWrite} disabledReason={disabledReason} onTxStatus={setTxStatus} onRequestUpdated={updateVerificationRequest} onApproved={(p) => { setWatchedAddress(p); setBalanceRefreshKey(k => k + 1); setActivityRefreshKey(k => k + 1); setActiveRole("public"); }} />
                  <AdminPanel signer={signer} disabled={!canWrite} disabledReason={disabledReason} onTxStatus={setTxStatus} onActionRecorded={(p) => { setWatchedAddress(p); setBalanceRefreshKey(k => k + 1); setActivityRefreshKey(k => k + 1); setActiveRole("public"); }} />
                  <AdminTransfer signer={signer} disabled={!canWrite} disabledReason={disabledReason} onTxStatus={setTxStatus} onAdminTransferred={(na) => { setAdminAddress(na); setActivityRefreshKey(k => k + 1); }} />
                </div>
              </motion.section>
            )}
            {activeRole === "participant" && (
              <motion.section key="participant" variants={pv} initial="initial" animate="animate" exit="exit" className="grid gap-5">
                <div className="grid gap-5 xl:grid-cols-2">
                  <ParticipantCheckIn account={account} onSubmitRequest={(r) => { addVerificationRequest(r); setWatchedAddress(r.participant); }} onTxStatus={setTxStatus} />
                  <BalanceChecker provider={readProvider} watchedAddress={watchedAddress} refreshKey={balanceRefreshKey} onTxStatus={setTxStatus} />
                </div>
                <DemoGuide />
              </motion.section>
            )}
            {activeRole === "public" && (
              <motion.section key="public" variants={pv} initial="initial" animate="animate" exit="exit" className="grid gap-5">
                <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                  <ActivityFeed provider={readProvider} refreshKey={activityRefreshKey} />
                  <Leaderboard provider={readProvider} refreshKey={activityRefreshKey} />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 pb-8 relative z-10">
        <div className="glass-card p-5 text-sm leading-relaxed text-muted">
          <div className="flex items-center gap-2 mb-2"><Leaf size={14} className="text-accent" /><span className="font-semibold text-ink-strong text-xs uppercase tracking-wider">About EcoLedger</span></div>
          EcoLedger is an access-controlled registry on Avalanche C-Chain. A trusted admin records verified real-world eco-actions with proof images, and each action permanently increments a participant&apos;s GreenPoints balance.
        </div>
      </footer>
    </main>
  );
}
