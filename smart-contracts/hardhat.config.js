require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

module.exports = {
  defaultNetwork:"sepolia",
  solidity: "0.8.18",
  networks:{
    mumbai:{
      url:process.env.POLYGON_RPC_URL,
      accounts:[process.env.PRIVATE_KEY]
    },
    sepolia:{
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.POLYSCAN_API_KEY
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  path:{
    artifacts:'./artifacts',
  },
};
