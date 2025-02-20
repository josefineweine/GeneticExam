
🚀 How to Clone and Run This Project

📌 1. Prerequisites

Before you start, make sure you have:
✅ Node.js (16+ recommended) installed
✅ MetaMask installed in your browser
✅ A free Alchemy API Key 
✅ A free Sepolia testnet wallet with some test ETH (Get test ETH)

📌 2. Clone the Project

Open a terminal and run:

git clone[ https://github.com/your-username/your-repo.git](https://github.com/josefineweine/geneticexam.git)
cd geneticexam


📌 3. Install Dependencies

Run the following commands to install everything:

🟢 Backend (Smart Contracts)

cd geneticexam (this is the backend)
npm install

🔵 Frontend

cd ../frontend
npm install

📌 4. Set Up Environment Variables (.env)

Since .env files are not included in GitHub, you need to create them manually.

✅ Backend (backend/.env)

Create a .env file inside the backend/ folder and add:

API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY<br>
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY<br>
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY<br>

      •     Replace YOUR_ALCHEMY_API_KEY with your actual Alchemy API key.
      •     Replace YOUR_WALLET_PRIVATE_KEY with your MetaMask private key (Sepolia testnet).
      •     Replace YOUR_ETHERSCAN_API_KEY (optional, used for verifying contracts).

✅ Frontend (frontend/.env)

Create a .env file inside the frontend/ folder and add:

REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddress
REACT_APP_ALCHEMY_KEY=YOUR_ALCHEMY_API_KEY

      •     Replace 0xYourDeployedContractAddress with the smart contract’s address.
      •     Replace YOUR_ALCHEMY_API_KEY with your actual Alchemy API key.


      Sidenote: You can use my contract adress if you want: 0x2300DAaa57ec42a93AA5892619A59534d9021bf7

📌 5. Start the Project

🟢 If You Want to Deploy the Smart Contract

Only do this if you’re deploying a new instance of the contract:

cd backend
npx hardhat run scripts/deploy.js --network sepolia

Copy the contract address from the output and update the frontend .env file.

🔵 Start the Frontend

cd frontend
npm start  # If using React
npm run dev  # If using Vite

📌 6. Open the Application

Go to:

http://localhost:3000

✅ Connect your MetaMask wallet
✅ Test the app by registering donors, matching, and fetching data
✅ Check the console (F12) for logs

🎉 That’s It!

You’ve successfully cloned and set up the project! 🚀
If you run into issues, check:
      •     Your .env files are correctly set.
      •     Your MetaMask is connected to Sepolia.
      •     Your contract address is correct.
