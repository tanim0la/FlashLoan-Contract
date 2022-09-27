const { expect } = require("chai")
const { ethers } = require("hardhat")
const hre = require("hardhat")

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config")

describe("Deploy a flash loan", () => {
  it("Should take a flashloan and be able to return it", async () => {
    const FlashLoan = await ethers.getContractFactory("FlashLoanExample")

    const flashloan = await FlashLoan.deploy(POOL_ADDRESS_PROVIDER)
    await flashloan.deployed()

    const token = await ethers.getContractAt("IERC20", DAI)
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000")

    // Impersonate the DAI_WHALE account to be able to send transactions from that account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    })

    const signer = await ethers.getSigner(DAI_WHALE)

    // Sends our contract 2000 DAI from the DAI_WHALE
    await token.connect(signer).transfer(flashloan.address, BALANCE_AMOUNT_DAI)

    // Borrow 10000 DAI in a Flash Loan with no upfront collateral
    await flashloan.createFlashLoan(DAI, 10000).then((tx) => tx.wait())

    // Check the balance of DAI in the Flash Loan contract afterwards
    const remainingBalance = await token.balanceOf(flashloan.address)

    // We must have less than 2000 DAI now, since the premium was paid from our contract's balance
    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true
    // console.log(ethers.utils.formatEther(remainingBalance))
  })
})
