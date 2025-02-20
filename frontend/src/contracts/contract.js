import contractABI from "./contract-abi.json";

// ✅ Ensure correct ABI structure
export const CONTRACT_ABI = contractABI.abi || contractABI; // Support both structures
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
