const fs = require("fs");
const path = require("path");

const hre = require("hardhat");

const CONTRACT_NAME = "EcoLedger";

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const networkName = hre.network.name;

  if (!deployer) {
    console.error(
      `[${CONTRACT_NAME}] No deployer wallet found for this network.\n` +
        "For Fuji or Avalanche mainnet, add your wallet private key to `.env`:\n" +
        "  PRIVATE_KEY=0x...\n" +
        "Never commit `.env` or share your key."
    );
    process.exit(1);
  }

  console.log(`[${CONTRACT_NAME}] Deploying with account:`, deployer.address);
  console.log(
    `[${CONTRACT_NAME}] Account balance:`,
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );
  console.log(`[${CONTRACT_NAME}] Network:`, networkName);

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  ensureDirSync(deploymentsDir);

  const deployedFilePath = path.join(deploymentsDir, `${networkName}.json`);
  const { chainId } = await hre.ethers.provider.getNetwork();

  let deploymentsFile = null;
  if (fs.existsSync(deployedFilePath)) {
    deploymentsFile = JSON.parse(fs.readFileSync(deployedFilePath, "utf8"));
  }

  const result = deploymentsFile || {
    network: networkName,
    chainId: chainId != null ? chainId.toString() : undefined,
    deployedAt: new Date().toISOString(),
    contracts: {},
  };

  const ContractFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`[${CONTRACT_NAME}] Deployed to:`, address);

  result.contracts = result.contracts || {};
  result.contracts[CONTRACT_NAME] = { address, constructorArgs: [] };
  fs.writeFileSync(deployedFilePath, JSON.stringify(result, null, 2), "utf8");
  console.log(`[${CONTRACT_NAME}] Deployment saved to:`, deployedFilePath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`[${CONTRACT_NAME}] Deployment failed:`, error);
    process.exit(1);
  });
