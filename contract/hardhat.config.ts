import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config()


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: 500000,
    },
    localhost: {
      allowUnlimitedContractSize: true,
      gas: 500000,
    }, 
    //shibuya: {
    //  // url:"https://evm.shibuya.astar.network",
    //  url:"https://shibuya.public.blastapi.io",
    //  chainId:81,
    //  accounts: [process.env.PRIVATE_KEY],
    //  allowUnlimitedContractSize: true
    //}
  },
};

export default config;
