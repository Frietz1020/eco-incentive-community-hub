import { Contract, JsonRpcProvider } from "ethers";
import { FUJI_RPC } from "./constants";

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_ECOLEDGER_ADDRESS || "0x63212500eA6F0eAc99Aa91d1A7b84F8460D91532";

export const ECOLEDGER_ABI = [
  "function recordAction(address participant, string actionType, uint256 pointsToAward) external",
  "function getPoints(address participant) external view returns (uint256)",
  "function transferAdmin(address newAdmin) external",
  "function admin() external view returns (address)",
  "function actionCount(address participant) external view returns (uint256)",
  "function totalActionsRecorded() external view returns (uint256)",
  "event ActionRecorded(address indexed participant, string actionType, uint256 timestamp)",
  "event PointsAwarded(address indexed participant, uint256 amount, uint256 newTotal)",
  "event AdminTransferred(address indexed oldAdmin, address indexed newAdmin)",
];

export function getContract(signer) {
  return new Contract(CONTRACT_ADDRESS, ECOLEDGER_ABI, signer);
}

export function getReadContract(provider) {
  const readProvider = provider || new JsonRpcProvider(FUJI_RPC);
  return new Contract(CONTRACT_ADDRESS, ECOLEDGER_ABI, readProvider);
}
