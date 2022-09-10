const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function() {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function() {
        //deploy our fundme contract
        //using hardhat-deploy
        // const accounts = await ethers.getSigners()
        // const accountZero = account(0)
        // const { deployer } = await getNamedAccounts()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function() {
        it("sets aggregator addresses correctly", async function() {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function() {
        it("fails if you dont send enough eth", async function() {
            await expect(fundMe.fund()).to.be.revertedWith("didnt send enough")
        })
        it("updates the amount funded ds", async function() {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds funder to array of funders", async function() {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })

    describe("withdraw", async function() {
        beforeEach(async function() {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw eth from a single funder", async () => {
            // Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
