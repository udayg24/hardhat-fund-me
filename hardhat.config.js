require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6
        }
    },
    namedAccounts: {
        deployer: {
            default: 0
        }
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
}
