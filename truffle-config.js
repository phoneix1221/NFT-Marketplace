require('babel-register');
require('babel-polyfill');
const HDWalletProvider=require('@truffle/hdwallet-provider')

const mnemonic=['0x62e6f314b0f6c587b905c9989df09b0323f99c0fef87ca2f51d982be26f1a591']

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    bsctestnet: {
      provider:
        ()=> new HDWalletProvider(mnemonic, "https://data-seed-prebsc-1-s1.binance.org:8545/")
      ,
      network_id: '97',
      skipDryRun:true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.6.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
