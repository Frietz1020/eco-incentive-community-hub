# EcoLedger 🌱

**Team Lead:** Frietz Ranz Bayog  
**Co-Lead / Member:** June Vic M. Abello  

**EcoLedger** is an access-controlled sustainability action ledger built on the **Avalanche Fuji C-Chain**. It allows communities to record verified real-world eco-actions (like tree planting, river cleanups, and recycling) permanently on-chain, awarding non-transferable GreenPoints to participants.

---

## 🌟 Key Features

### 1. Participant Portal
- **Submit Check-Ins:** Participants can submit their attendance at eco-events using their wallet address.
- **Image Proofs:** Drag-and-drop file upload for action verification. Images are processed locally and securely attached to the submission.
- **Balance Tracking:** Participants can track their accumulated GreenPoints and environmental impact.

### 2. Admin Verification Console
- **Access Controlled:** Only the designated Admin wallet can approve or reject submissions, ensuring the integrity of the ledger.
- **One-Click Awarding:** Admins can verify proof images and award GreenPoints. Approved actions are written permanently to the Avalanche C-Chain.
- **Role Management:** The admin role can be transferred to a new wallet if community leadership changes.

### 3. Public Ledger & Transparency
- **Real-Time Activity Feed:** All verified actions are publicly auditable. The feed displays recent eco-actions, awarded points, and verifiable proof images.
- **Community Leaderboard:** A fully decentralized leaderboard ranking participants by their total GreenPoint contributions.

### 4. "Nature Distilled" Design System
- A premium, organic light-mode interface featuring glassmorphic components, high-contrast typography (`Orbitron` & `Exo 2`), and an interactive, animated blockchain background.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Vanilla CSS & Tailwind CSS (Custom "Nature Distilled" theme)
- **Web3 Integration:** `ethers.js` (v6) for wallet connections, contract reads, and writes.
- **Icons & Animation:** `lucide-react` & `framer-motion`

### Smart Contracts
- **Language:** Solidity `^0.8.20`
- **Development Environment:** Hardhat
- **Network:** Avalanche Fuji Testnet

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MetaMask or Core Wallet browser extension configured for the **Avalanche Fuji Testnet**.

### 1. Clone the Repository
```bash
git clone https://github.com/Frietz1020/eco-incentive-community-hub.git
cd eco-incentive-community-hub
```

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Alternatively, on Windows, you can use the provided batch script:
```cmd
start_frontend.bat
```

### 3. Smart Contract Setup (Optional)
The frontend is already configured to point to a live instance of `EcoLedger.sol` on the Fuji testnet. If you wish to deploy your own instance:

1. Add your wallet private key to a `.env` file in the project root:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```
2. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.js --network fuji
   ```
3. Copy the newly deployed contract address and update it in `frontend/src/lib/contract.js` or via the `VITE_ECOLEDGER_ADDRESS` environment variable.

---

## 📜 Smart Contract Architecture

The core `EcoLedger.sol` contract is designed for simplicity, security, and low gas consumption. 
- **State Variables:** Tracks `admin`, participant `points`, and `totalActionsRecorded`.
- **Core Function:** `recordAction` validates the admin signature and increments the participant's balance.
- **Events:** Emits `ActionRecorded` and `PointsAwarded` for real-time frontend indexing. 
- **Storage:** Proof images are passed as Base64 strings directly in the transaction calldata, ensuring permanent, decentralized proof availability without relying on centralized databases.

---

## 🌐 Network Information

**Avalanche Fuji Testnet**
- **RPC URL:** `https://api.avax-test.network/ext/bc/C/rpc`
- **Chain ID:** `43113`
- **Currency:** `AVAX`
- **Explorer:** [Snowtrace Testnet](https://testnet.snowscan.xyz/)
