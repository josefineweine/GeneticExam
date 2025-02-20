


import { ethers } from "ethers";
import contractABI from "./contract-abi.json";

export const CONTRACT_ABI = contractABI;
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

// Function to connect to the contract
export const getContract = async () => {
    try {
        if (!window.ethereum) {
            console.error("MetaMask is not installed!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        console.log("Connected to contract:", contract);
        return contract;
    } catch (error) {
        console.error("Error connecting to contract:", error);
    }
};