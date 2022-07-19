//https://eth-mainnet.g.alchemy.com/v2/3CKrV12zZd9IWntte2ngmMWULYMikmR8

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/3CKrV12zZd9IWntte2ngmMWULYMikmR8',
      accounts: ['cc57cb68f522eb3a7eb62bd84f9627b505bab75a91c81eccffaa70240e3084c7']
    }
  }
}