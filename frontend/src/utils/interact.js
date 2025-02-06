require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../config/contract-abi.json"); // Correct path to your contract ABI
const contractAddress = "0x0b54FAD894c1EFC7B190cE92D122F5E93704D04B";  // Replace with your actual contract address

const contract = new web3.eth.Contract(contractABI, contractAddress);

export const loadCurrentMessage = async () => {
  try {
    const message = await contract.methods.message().call();
    return message;
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Connect to interact with the dApp.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
         
            You must install MetaMask to continue.
          
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Connected to MetaMask.",
        };
      } else {
        return {
          address: "",
          status: " Please connect your wallet using the button above.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          {" "}
            You must install MetaMask to interact with this dApp.
          
        </span>
      ),
    };
  }
};

// Function to register donor data on-chain
export const registerDonor = async (address, metadataCID) => {
  if (!window.ethereum || !address) {
    return {
      status: "💡 Connect your MetaMask wallet to register a donor.",
    };
  }

  if (!metadataCID.trim()) {
    return {
      status: "❌ Metadata CID cannot be empty.",
    };
  }

  // Set up transaction parameters for registering donor
  const transactionParameters = {
    to: contractAddress,
    from: address,
    data: contract.methods.registerDonor(metadataCID).encodeABI(),
  };

  // Sign the transaction using MetaMask
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          {" "}
         
            View the status of your transaction on Etherscan.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

// Fetch donor data from the contract (for displaying)
export const fetchDonors = async () => {
  try {
    const donorCount = await contract.methods.donorCount().call();
    const donors = [];
    
    for (let i = 0; i < donorCount; i++) {
      const donor = await contract.methods.donors(i).call(); // Assuming donors are stored in an array
      donors.push(donor);
    }

    return donors;
  } catch (error) {
    return `Error fetching donors: ${error.message}`;
  }
};
