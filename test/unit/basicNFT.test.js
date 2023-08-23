const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");
const { BaseContract } = require("ethers");

!(developmentChains.includes(network.name))
    ? describe.skip
    : describe("Basic NFT Unit Tests", () => {
        let basicNFT, deployer

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["basicnft"])
            basicNFT = await ethers.getContract("BasicNFT")
        })

        describe("Contructor", () => {
            it("Initializes the NFT Correctly", async () => {
                const name = await basicNFT.name()
                const symbol = await basicNFT.symbol()
                const tokenCounter = await basicNFT.getTokenCounter()
                assert.equal(name, "Dogie")
                assert.equal(symbol, "DOG")
                assert.equal(tokenCounter.toString(), "0")
            })

            describe("Mint NFT", () => {
                beforeEach(async () => {
                    const txResponse = await basicNFT.mintNFT()
                    await txResponse.wait(1)
                })
                it("Allows users to mint an NFT, and update appropriately", async () => {
                    const tokenURI = await basicNFT.tokenURI(0)
                    const tokenCounter = await basicNFT.getTokenCounter()

                    assert.equal(tokenCounter.toString(), "1")
                    assert.equal(tokenURI, await basicNFT.TOKEN_URI())
                })

                it("Show the correct balance and owner of an NFT", async () => {
                    const deployerAddress = deployer.address
                    const deployerBalance = await basicNFT.balanceOf(deployerAddress)
                    const owner = await basicNFT.ownerOf("0")

                    assert.equal(deployerBalance.toString(), "1")
                    assert.equal(owner, deployerAddress)
                })
            })
        })
    })   