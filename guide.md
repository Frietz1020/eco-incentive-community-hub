# Deploy & test guide

Step-by-step: environment setup, deploy **one contract at a time**, verify on Fuji, and test your contracts.

---

## 1. Prerequisites

- **Node.js** (LTS recommended)
- **pnpm**: `npm install -g pnpm`
- **Git** (to clone the repo)

From the repo root:

```bash
pnpm install
cp .env.example .env
pnpm run compile
pnpm run test
```

---

## 2. Keys & addresses (quick reference)

| What | What it is | When you use it |
|------|------------|-----------------|
| **Private key** | Secret (`PRIVATE_KEY` in `.env` or inline for one command) | Deploy, pay gas, sign transactions. **Never share.** |
| **Wallet address** | Your account on-chain (`0x` + 40 hex chars) | **Fuji faucet** sends test AVAX here — must match the wallet for your `PRIVATE_KEY`. |
| **Contract address** | Where the deployed contract lives (`0x` + 40 hex chars) | **Interact** with the contract (`getContractAt`, explorer). **Not** your private key. |

`PRIVATE_KEY` must be **exactly 64 hex characters** (32 bytes), with or without `0x`. Placeholders like `your_private_key_here` will fail.

---

## 3. Environment (`.env`)

Create `.env` next to `hardhat.config.js`. Minimum:

```bash
PRIVATE_KEY=0xYOUR_64_HEX_CHARS
```

Optional:

- `SNOWTRACE_API_KEY` — for contract verification on Snowtrace/SnowScan  
- `AVALANCHE_FUJI_RPC_URL` / `AVALANCHE_MAINNET_RPC_URL` — RPC overrides  

Aliases also supported: `FUJI_PRIVATE_KEY`, `DEPLOYER_PRIVATE_KEY`.

**Safe way to save a key in the terminal** (hidden paste):

```bash
read -s PK
printf 'PRIVATE_KEY=%s\n' "$PK" > .env
chmod 600 .env
unset PK
```

---

## 4. Deploy — one contract per run

Set **`CONTRACT_NAME`** to the Solidity contract name (not the file name). Then run one deploy command.

### 4.1 Local (in-memory, no real AVAX)

```bash
export CONTRACT_NAME=Intro
pnpm exec hardhat run scripts/deploy.js --network hardhat
```

Addresses are saved in **`deployments/hardhat.json`**. The chain resets each run.

### 4.2 Local (persistent — good for manual testing)

**Terminal A — node:**

```bash
pnpm exec hardhat node
```

**Terminal B — deploy:**

```bash
export CONTRACT_NAME=Intro
pnpm exec hardhat run scripts/deploy.js --network localhost
```

Use **`deployments/localhost.json`** for the contract address.

### 4.3 Avalanche Fuji (testnet)

1. Fund your **wallet address** with test AVAX: [Fuji faucet](https://faucet.avax.network/).

2. **Using `.env`:**

```bash
export CONTRACT_NAME=Intro
pnpm run deploy:fuji
```

3. **One line, no `.env` file** (key only for this command; replace `0x...` with your real key):

```bash
cd /path/to/learning-solidity
CONTRACT_NAME=Intro PRIVATE_KEY=0xYOUR_KEY_HERE pnpm run deploy:fuji
```

4. **AvalancheGreeter** (needs a greeting):

```bash
export CONTRACT_NAME=AvalancheGreeter
export GREETING="Hello, Avalanche!"
pnpm run deploy:fuji
```

**Output:** `deployments/fuji.json` lists each deployed contract name and address.

### 4.4 Avalanche mainnet (C-Chain)

Same pattern; **uses real AVAX** — double-check network and account.

```bash
export CONTRACT_NAME=Intro
pnpm run deploy:mainnet
```

---

## 5. Contract names (`CONTRACT_NAME`)

### 5.1 Learning folder (`learning/`)

Lesson contracts live on disk under **`learning/<lesson-folder>/`**. Each folder has one main `.sol` file. The Solidity **`contract` name** (what you pass as `CONTRACT_NAME`) is usually the same as the filename without `.sol`.

Hardhat compiles these together because **`contracts/AllContracts.sol`** imports every lesson file (plus starter contracts). After you **edit** a lesson, run:

```bash
pnpm run compile
```

**Deploy any lesson** — same commands as in **§4 Deploy** above; only `CONTRACT_NAME` changes.

Example (Fuji):

```bash
export CONTRACT_NAME=Intro
pnpm run deploy:fuji
```

Example (local Hardhat):

```bash
export CONTRACT_NAME=Mapping
pnpm exec hardhat run scripts/deploy.js --network hardhat
```

| Folder (under `learning/`) | Source file | `CONTRACT_NAME` |
|----------------------------|---------------|-----------------|
| `1-Intro/` | `Intro.sol` | `Intro` |
| `2-State-Variables/` | `StateVariables.sol` | `StateVariables` |
| `3-Local-Variables/` | `LocalVariables.sol` | `LocalVariables` |
| `4-Function/` | `Functions.sol` | `Functions` |
| `5-Constructor/` | `Constructor.sol` | `Constructor` |
| `6-Data-Types/` | `DataTypes.sol` | `DataTypes` |
| `7-Array/` | `Array.sol` | `Array` |
| `8-Loops/` | `Loops.sol` | `Loops` |
| `9-Conditionals/` | `Conditionals.sol` | `Conditionals` |
| `10-Struct/` | `Struct.sol` | `Struct` |
| `11-Mapping/` | `Mapping.sol` | `Mapping` |
| `12-Storage-Locations/` | `StorageLocations.sol` | `StorageLocations` |
| `13-Global-Variables/` | `GlobalVariables.sol` | `GlobalVariables` |
| `14-Contract-Balance/` | `ContractBalance.sol` | `ContractBalance` |
| `15-Visibility/` | `Visibility.sol` | `Visibility` |

**Interact after deploy:** use the **contract address** from `deployments/<network>.json` and the same `CONTRACT_NAME` in `getContractAt("ContractName", "0x...")` — see **§7.2 Hardhat console** below.

### 5.2 Starter contracts (`contracts/`)

These live in **`contracts/`** (not under `learning/`):

| File | `CONTRACT_NAME` |
|------|-----------------|
| `SimpleStorage.sol` | `SimpleStorage` |
| `AvalancheGreeter.sol` | `AvalancheGreeter` |

---

## 6. Verify on the explorer (optional)

After deploy, you can publish source code on Snowtrace (needs `SNOWTRACE_API_KEY` in `.env`).

**Using deployments file:**

```bash
export CONTRACT_NAME=Intro
pnpm run verify:fuji
```

**Without deployments file** (e.g. you only have the address), for contracts with **no constructor args**:

```bash
export CONTRACT_NAME=Intro
export CONTRACT_ADDRESS=0xYourDeployedAddress
pnpm run verify:fuji
```

**AvalancheGreeter** (constructor arg):

```bash
export CONTRACT_ADDRESS=0x...
export CONTRACT_NAME=AvalancheGreeter
pnpm run verify:fuji
```

(Uses `GREETING` from `.env` or default.)

---

## 7. Test your contracts

### 7.1 Unit tests (automated)

Runs all tests:

```bash
pnpm run test
```

**Intro only** (do not use `pnpm run test -- --grep` with pnpm — it can break):

```bash
pnpm run test:intro
# or
pnpm exec hardhat test --grep Intro
```

Tests in this repo:

- `test/Intro.test.js`
- `test/SimpleStorage.test.js`
- `test/AvalancheGreeter.test.js`

Unit tests **deploy fresh contracts**; they do not use addresses from `deployments/`.

### 7.2 Hardhat console (Fuji / localhost)

1. You need a **valid `PRIVATE_KEY`** in `.env` so Hardhat has a signer (Fuji).
2. Use the **contract address** from `deployments/fuji.json` (or `localhost.json`) — **not** a placeholder like `0xYOUR_ADDRESS`.

```bash
pnpm exec hardhat console --network fuji
```

```js
const addr = "0x..."; // paste from deployments/fuji.json
const c = await ethers.getContractAt("StateVariables", addr);
await c.count();
```

List function names:

```js
c.interface.fragments
  .filter((f) => f.type === "function")
  .map((f) => f.name);
```

### 7.3 Remix / block explorer

- **Remix:** connect MetaMask to Fuji, use contract address + ABI from `artifacts/`.
- **Explorer:** after verification, use **Read / Write contract** on [SnowScan testnet](https://testnet.snowscan.xyz/) (Fuji).

---

## 8. Interact with deployed contracts (Hardhat console)

This section shows **detailed steps** first, then **per-contract** commands.

---

### 8.1 Step-by-step (every contract)

Follow these in order. Use **Fuji** as the example; for **local Hardhat** use `--network hardhat` and `deployments/hardhat.json`; for **`localhost`** use `--network localhost` and `deployments/localhost.json`.

| Step | What to do |
|------|------------|
| **1** | **Deploy** the contract (if you haven’t already), e.g. `export CONTRACT_NAME=Intro` then `pnpm run deploy:fuji` (see **§4**). |
| **2** | Find the **contract address** — **not** your wallet. From the deploy log: **`ContractName deployed to: 0x...`**, or open **`deployments/fuji.json`** (or the matching network file) and copy **`contracts.<ContractName>.address`**. |
| **3** | Confirm you are **not** using the line **Deploying with account: 0x...** — that is your **wallet**; **wrong** for `getContractAt`. |
| **4** | Open the **Hardhat console** (JavaScript REPL), **not** the normal shell: `pnpm exec hardhat console --network fuji`. Wait until you see the **`>`** prompt. You cannot run `const` in **zsh** (`command not found`). |
| **5** | Fix **`PRIVATE_KEY`** in **`.env`** (64 hex chars) if you see warnings, or run: `PRIVATE_KEY=0x... pnpm exec hardhat console --network fuji`. |
| **6** | Set the address **once** per session: `const addr = "0x..."` — **exactly** `0x` + 40 hex characters, **no** dot or extra character at the end. |
| **7** | Attach: `const c = await ethers.getContractAt("ContractName", addr)` — **`ContractName`** must match the Solidity contract (e.g. `Intro`, `LocalVariables`). |
| **8** | Call functions: `await c.someFunction(...)`. Use **`0n` / `123n`** for bigint args (ethers v6). |
| **9** | If you see **`Identifier 'addr' has already been declared`**, exit the console (**Ctrl+D** or `.exit`) and start again, **or** use new names: `const introAddr = "0x..."`, `const intro = await ethers.getContractAt("Intro", introAddr)`. |

**Minimal template (copy after `>`):**

```js
const addr = "0xPASTE_CONTRACT_ADDRESS_FROM_deployments_fuji.json";
const c = await ethers.getContractAt("ContractName", addr);
```

Then use the **per-contract** commands below (replace `ContractName` / calls as needed).

---

### 8.2 Learning contracts (`learning/`)

For each lesson: deploy with **`CONTRACT_NAME`** = **Contract name** column, then use **`address`** from `deployments/<network>.json` for that contract key.

---

#### `Intro` — `learning/1-Intro/Intro.sol`

| | |
|--|--|
| **Deploy** | `export CONTRACT_NAME=Intro` → `pnpm run deploy:fuji` (or **§4** local commands) |
| **Address in JSON** | `contracts.Intro.address` |
| **Interact** | |

```js
const addr = "0x..."; // contracts.Intro.address
const c = await ethers.getContractAt("Intro", addr);
await c.helloWorld();
await c.sayHello();
```

---

#### `StateVariables` — `learning/2-State-Variables/StateVariables.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=StateVariables` |
| **Address** | `contracts.StateVariables.address` |

```js
const c = await ethers.getContractAt("StateVariables", addr);
await c.count();
await c.owner();
await c.paused();
```

---

#### `LocalVariables` — `learning/3-Local-Variables/LocalVariables.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=LocalVariables` (not `Local-Variables`) |
| **Address** | `contracts.LocalVariables.address` |

```js
const c = await ethers.getContractAt("LocalVariables", addr);
await c.add(3n, 7n);
await c.getBlockInfo();
```

---

#### `Functions` — `learning/4-Function/Functions.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Functions` |
| **Address** | `contracts.Functions.address` |

```js
const c = await ethers.getContractAt("Functions", addr);
await c.get();
await c.set(42n);
await c.add(10n, 20n);
await c.value();
```

---

#### `Constructor` — `learning/5-Constructor/Constructor.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Constructor` |
| **Address** | `contracts.Constructor.address` |

```js
const c = await ethers.getContractAt("Constructor", addr);
await c.owner();
await c.createdAt();
```

---

#### `DataTypes` — `learning/6-Data-Types/DataTypes.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=DataTypes` |
| **Address** | `contracts.DataTypes.address` |

```js
const c = await ethers.getContractAt("DataTypes", addr);
await c.flag();
await c.small();
await c.big();
await c.signed();
await c.addr();
await c.data();
await c.text();
```

---

#### `Array` — `learning/7-Array/Array.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Array` |
| **Address** | `contracts.Array.address` |

```js
const c = await ethers.getContractAt("Array", addr);
await c.getLength();
await c.push(100n);
await c.setFixed(0n, 5n);
await c.fixedArray(0n);
await c.dynamicArray(0n);
```

---

#### `Loops` — `learning/8-Loops/Loops.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Loops` |
| **Address** | `contracts.Loops.address` |

```js
const c = await ethers.getContractAt("Loops", addr);
await c.addNumbers([1n, 2n, 3n]);
await c.sum();
await c.numbers(0n);
```

---

#### `Conditionals` — `learning/9-Conditionals/Conditionals.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Conditionals` |
| **Address** | `contracts.Conditionals.address` |

```js
const c = await ethers.getContractAt("Conditionals", addr);
await c.check(5n);
await c.onlyPositive(1n);
await c.min(3n, 7n);
```

---

#### `Struct` — `learning/10-Struct/Struct.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Struct` |
| **Address** | `contracts.Struct.address` |

```js
const c = await ethers.getContractAt("Struct", addr);
await c.add("Alice", 25n);
await c.people(0n);
await c.get(0n);
```

---

#### `Mapping` — `learning/11-Mapping/Mapping.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Mapping` |
| **Address** | `contracts.Mapping.address` |
| **Note** | `deposit` requires **AVAX** (payable); use a signer with Fuji balance on the contract’s network. |

```js
const c = await ethers.getContractAt("Mapping", addr);
const [signer] = await ethers.getSigners();
await c.connect(signer).deposit({ value: ethers.parseEther("0.01") });
await c.getBalance();
await c.balances(signer.address);
await c.hasDeposited(signer.address);
```

---

#### `StorageLocations` — `learning/12-Storage-Locations/StorageLocations.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=StorageLocations` |
| **Address** | `contracts.StorageLocations.address` |

```js
const c = await ethers.getContractAt("StorageLocations", addr);
await c.set("hello");
await c.getCopy();
await c.concat("foo", "bar");
await c.stored();
```

---

#### `GlobalVariables` — `learning/13-Global-Variables/GlobalVariables.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=GlobalVariables` |
| **Address** | `contracts.GlobalVariables.address` |
| **Note** | `getGlobals` is **payable** — pass `{ value: 0n }` or a small wei amount. |

```js
const c = await ethers.getContractAt("GlobalVariables", addr);
const [signer] = await ethers.getSigners();
await c.connect(signer).getGlobals({ value: 0n });
await c.connect(signer).getGlobals({ value: 1n });
```

---

#### `ContractBalance` — `learning/14-Contract-Balance/ContractBalance.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=ContractBalance` |
| **Address** | `contracts.ContractBalance.address` |
| **Note** | Send AVAX via `deposit` or to the contract address (`receive`). |

```js
const c = await ethers.getContractAt("ContractBalance", addr);
const [signer] = await ethers.getSigners();
await c.connect(signer).deposit({ value: ethers.parseEther("0.01") });
await c.getBalance();
```

---

#### `Visibility` — `learning/15-Visibility/Visibility.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=Visibility` |
| **Address** | `contracts.Visibility.address` |

```js
const c = await ethers.getContractAt("Visibility", addr);
await c.publicVar();
await c.setPrivate(7n);
await c.getPrivate();
await c.setInternal(8n);
await c.externalFn(5n);
```

---

### 8.3 Starter contracts (`contracts/`)

#### `SimpleStorage` — `contracts/SimpleStorage.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=SimpleStorage` |
| **Address** | `contracts.SimpleStorage.address` |

```js
const c = await ethers.getContractAt("SimpleStorage", addr);
await c.get();
await c.set(123n);
```

---

#### `AvalancheGreeter` — `contracts/AvalancheGreeter.sol`

| | |
|--|--|
| **Deploy** | `CONTRACT_NAME=AvalancheGreeter` (+ `GREETING` if needed) |
| **Address** | `contracts.AvalancheGreeter.address` |
| **Note** | Only **owner** (deployer) can `setGreeting`. |

```js
const c = await ethers.getContractAt("AvalancheGreeter", addr);
await c.greeting();
await c.owner();
await c.getGreeting();
await c.setGreeting("Hi from console");
```

---

### 8.4 Console setup (one line)

```bash
cd /path/to/learning-solidity
pnpm exec hardhat console --network fuji
```

---

### Tips

- **`0n` / `123n`:** use `BigInt` literals in the Node console (ethers v6).
- **`parseEther`:** `ethers.parseEther("0.01")` for AVAX amounts.
- **List all functions:**  
  `c.interface.fragments.filter((f) => f.type === "function").map((f) => f.name)`
- Use **`--network localhost`** and addresses from `deployments/localhost.json` if you run a local node.

### Common console mistakes (`addr`, `c`, `PRIVATE_KEY`)

**`ReferenceError: addr is not defined`**  
`addr` in the examples is a **placeholder**. You must define it with your **real deployed contract address** (from `deployments/fuji.json` under `contracts.<ContractName>.address`, or from the deploy log: `Intro deployed to: 0x...`).

```js
const addr = "0xYourRealContractAddressHere";
const c = await ethers.getContractAt("Intro", addr);
await c.helloWorld();
await c.sayHello();
```

**`TypeError: Cannot read properties of undefined (reading 'helloWorld')`**  
Usually means `c` was never created — e.g. the previous line failed because `addr` was missing or wrong. Fix `addr`, run `getContractAt` again, then call functions on `c`.

**`[hardhat] PRIVATE_KEY is invalid or too short` when opening the console**  
Your `.env` `PRIVATE_KEY` is missing, a placeholder, or not 64 hex characters. Fix `.env`, **or** pass a valid key for that session only:

```bash
PRIVATE_KEY=0xYOUR_64_HEX_KEY pnpm exec hardhat console --network fuji
```

View/pure calls may work in some cases without a funded signer, but you should still use a **valid** key for Fuji so Hardhat’s accounts match your expectations.

**Quick checklist**

1. Get the address from **`deployments/fuji.json`** (or the network you used) for that contract name.  
2. `const addr = "0x..."` — paste that full address.  
3. `const c = await ethers.getContractAt("ContractName", addr)` — `ContractName` must match Solidity (e.g. `Intro`, `LocalVariables`).  
4. Then `await c.someFunction()`.

---

## 9. Troubleshooting

| Issue | What to do |
|-------|------------|
| `No deployer wallet` | Set a valid **`PRIVATE_KEY`** in `.env` (64 hex chars), or use the inline `PRIVATE_KEY=...` one-liner for deploy. |
| `HH8` / private key too short | Key must be **64 hex characters** (not a placeholder). |
| `Missing deployments/fuji.json` | Run **deploy** to Fuji first, or use `CONTRACT_ADDRESS` + `CONTRACT_NAME` for verify. |
| `resolveName` / `getContractAt` fails | Use a **real** contract address (42 chars starting with `0x`), not `0xYOUR_ADDRESS` from docs. |
| Wrong `CONTRACT_NAME` | Must match the Solidity **contract** name (`Intro`, not `1-Intro`). Use **`LocalVariables`**, not `Local-Variables`. |
| `addr is not defined` (console) | Set `const addr = "0x..."` first using the address from **`deployments/fuji.json`** (see **§8 — Common console mistakes**). |
| `Cannot read properties of undefined (reading '…')` on `c` | `getContractAt` failed — fix `addr` and contract name, then define `c` again. |
| Env vars not applied to deploy | Put **`CONTRACT_NAME=... PRIVATE_KEY=... pnpm run deploy:fuji`** on **one line** (no newline before `pnpm`). Typo: **`CONTRACT_NAME`**, not `ONTRACT_NAME`. |

---

For workshop setup (fork, PRs, exercises), see the main **[README.md](./README.md)**.
