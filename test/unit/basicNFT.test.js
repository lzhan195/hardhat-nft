const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

!(developmentChains.includes(network.name))
    ? describe.skip
    : describe("Basic NFT Unit Tests", () => {
        let basicNFT, deployer

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["all"])
            basicNFT = await ethers.getContract("BasicNFT")
        })

        it("Allows users to mint an NFT, and update appropriately", async () => {
            const txResponse = await basicNFT.mintNFT()
            await txResponse.wait(1)
            const tokenURI = await basicNFT.tokenURI(0)
            const tokenCounter = await basicNFT.getTokenCounter()

            assert.equal(tokenCounter.toString(), "1")
            assert.equal(tokenURI, await basicNFT.TOKEN_URI())
        })
    })