const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.ROPSTEN_MNEMONIC;
const accessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 9545,
      gas: 6000000,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${accessToken}`);
      },
      network_id: 3,
      gas: 4700000,
      gasPrice: 21000000000,
    },
    rinkeby: {
      provider() {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${accessToken}`);
      },
      network_id: 4,
      gas: 5700000,
      gasPrice: 10000000000,
    },
    live: {
      network_id: 1,
    }
  }
};

