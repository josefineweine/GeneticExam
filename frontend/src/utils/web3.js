import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/DonorRegistry';

// Replace with your Alchemy API URL
const ALCHEMY_URL = 'https://eth-sepolia.g.alchemy.com/v2/kkpuSY8k-FdrItSL4otQX1ZEht2tUh7p';  
const web3 = createAlchemyWeb3(ALCHEMY_URL);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export { web3, contract };

