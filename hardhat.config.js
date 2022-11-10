require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config({ path: ".env" })

const QUICKNODE_RPC_URL = `https://practical-ultra-aura.matic.discover.quiknode.pro/${process.env.QUICKNODE_RPC_APIKEY}/`

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: QUICKNODE_RPC_URL,
      },
    },
  },
}
