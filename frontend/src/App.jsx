import { useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import ActivityFeed from "./components/ActivityFeed";
import AdminPanel from "./components/AdminPanel";
import AdminStatus from "./components/AdminStatus";
import AdminTransfer from "./components/AdminTransfer";
import BalanceChecker from "./components/BalanceChecker";
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

const REQUESTS_STORAGE_KEY = "ecoledger.verificationRequests";

function loadStoredRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

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
  const [verificationRequests, setVerificationRequests] = useState(loadStoredRequests);

  const isFuji = Number(chainId) === FUJI_CHAIN_ID;
  const isAdmin =
    Boolean(account && adminAddress) && account.toLowerCase() === adminAddress.toLowerCase();
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
    admin: {
      eyebrow: "Admin Console",
      title: "Verify and issue GreenPoints",
      summary: "Use this workspace when a community verifier is approving real-world eco-actions.",
    },
    participant: {
      eyebrow: "Participant Portal",
      title: "Check in and view impact",
      summary: "Submit event attendance for admin review, then track awarded GreenPoints on Fuji.",
    },
    public: {
      eyebrow: "Public Ledger",
      title: "Audit community progress",
      summary: "Review emitted events, leaderboard movement, and Snowtrace evidence.",
    },
  }[activeRole];

  async function connectWallet() {
    if (!window.ethereum) {
      setTxStatus({ type: "error", message: "Install MetaMask or Core wallet to continue." });
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const nextSigner = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();

      setProvider(browserProvider);
      setSigner(nextSigner);
      setAccount(accounts[0] || "");
      setWatchedAddress(accounts[0] || "");
      setChainId(Number(network.chainId));
      setTxStatus({ type: "confirmed", message: "Wallet connected." });
    } catch (error) {
      setTxStatus({
        type: "error",
        message: error?.shortMessage || error?.message || "Could not connect wallet.",
      });
    }
  }

  function saveRequests(nextRequests) {
    setVerificationRequests(nextRequests);
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(nextRequests));
  }

  function addVerificationRequest(request) {
    saveRequests([request, ...verificationRequests]);
  }

  function updateVerificationRequest(id, patch) {
    saveRequests(
      verificationRequests.map((request) =>
        request.id === id ? { ...request, ...patch } : request
      )
    );
  }

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleAccounts = (accounts) => {
      const nextAccount = accounts[0] || "";
      setAccount(nextAccount);
      setWatchedAddress(nextAccount);
      if (!nextAccount) setSigner(null);
    };

    const handleChain = (nextChainId) => {
      setChainId(parseInt(nextChainId, 16));
    };

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, []);

  return (
    <main className="min-h-screen bg-field">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-danger">
              Avalanche Fuji Sustainability Ledger
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">EcoLedger</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-moss">
              Trusted admins record verified community eco-actions on-chain and award
              non-transferable GreenPoints as permanent proof of contribution.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-field px-4 py-3 text-sm text-ink">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">Network: {networkLabel}</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-canopy">
                {roleLabel}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs">
              {CONTRACT_ADDRESS ? CONTRACT_ADDRESS : "EcoLedger address not set"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="grid gap-5 self-start">
          <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} isAdmin={isAdmin} />
          <ConnectWallet account={account} onConnect={connectWallet} />
          <NetworkGuard chainId={chainId} onNetworkChanged={setChainId} />
          <AdminStatus
            account={account}
            provider={readProvider}
            refreshKey={activityRefreshKey}
            onAdminChecked={setAdminAddress}
          />
          <TxStatus status={txStatus} />
        </aside>

        <div className="grid gap-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-canopy">
                  {roleMeta.eyebrow}
                </p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                  {roleMeta.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-moss">{roleMeta.summary}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-field px-3 py-2">
                  <p className="font-semibold text-moss">Role</p>
                  <p className="mt-1 font-semibold text-ink">{roleLabel}</p>
                </div>
                <div className="rounded-md bg-field px-3 py-2">
                  <p className="font-semibold text-moss">Network</p>
                  <p className="mt-1 font-semibold text-ink">{isFuji ? "Fuji" : "Check"}</p>
                </div>
                <div className="rounded-md bg-field px-3 py-2">
                  <p className="font-semibold text-moss">Contract</p>
                  <p className="mt-1 font-semibold text-ink">{CONTRACT_ADDRESS ? "Live" : "Missing"}</p>
                </div>
              </div>
            </div>
          </section>

          {activeRole === "admin" && (
            <section className="grid gap-5">
              <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-canopy">Required before submitting</p>
                    <h3 className="text-xl font-semibold text-ink">Admin wallet + Fuji network</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      canWrite ? "bg-canopy/15 text-canopy" : "bg-sun/15 text-amber-800"
                    }`}
                  >
                    {canWrite ? "Ready" : "Admin wallet required"}
                  </span>
                </div>
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <VerificationQueue
                  requests={verificationRequests}
                  signer={signer}
                  disabled={!canWrite}
                  disabledReason={disabledReason}
                  onTxStatus={setTxStatus}
                  onRequestUpdated={updateVerificationRequest}
                  onApproved={(participant) => {
                    setWatchedAddress(participant);
                    setBalanceRefreshKey((key) => key + 1);
                    setActivityRefreshKey((key) => key + 1);
                    setActiveRole("participant");
                  }}
                />
                <AdminPanel
                  signer={signer}
                  disabled={!canWrite}
                  disabledReason={disabledReason}
                  onTxStatus={setTxStatus}
                  onActionRecorded={(participant) => {
                    setWatchedAddress(participant);
                    setBalanceRefreshKey((key) => key + 1);
                    setActivityRefreshKey((key) => key + 1);
                    setActiveRole("participant");
                  }}
                />
                <AdminTransfer
                  signer={signer}
                  disabled={!canWrite}
                  disabledReason={disabledReason}
                  onTxStatus={setTxStatus}
                  onAdminTransferred={(newAdmin) => {
                    setAdminAddress(newAdmin);
                    setActivityRefreshKey((key) => key + 1);
                  }}
                />
              </div>
            </section>
          )}

          {activeRole === "participant" && (
            <section className="grid gap-5">
              <div className="grid gap-5 xl:grid-cols-2">
                <ParticipantCheckIn
                  account={account}
                  onSubmitRequest={(request) => {
                    addVerificationRequest(request);
                    setWatchedAddress(request.participant);
                  }}
                  onTxStatus={setTxStatus}
                />
                <BalanceChecker
                  provider={readProvider}
                  watchedAddress={watchedAddress}
                  refreshKey={balanceRefreshKey}
                  onTxStatus={setTxStatus}
                />
              </div>
              <DemoGuide />
            </section>
          )}

          {activeRole === "public" && (
            <section className="grid gap-5">
              <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <ActivityFeed provider={readProvider} refreshKey={activityRefreshKey} />
                <Leaderboard provider={readProvider} refreshKey={activityRefreshKey} />
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8">
        <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-moss shadow-sm">
          EcoLedger is an access-controlled registry on Avalanche C-Chain. A trusted
          admin records verified real-world eco-actions, and each action permanently
          increments a participant&apos;s GreenPoints balance. Every action emits
          ActionRecorded and PointsAwarded events for an auditable sustainability ledger.
        </div>
      </section>
    </main>
  );
}
