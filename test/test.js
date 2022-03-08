const { expect } = require("chai");
const { ethers } = require("hardhat");

let market;
let marketContractAddress;
let listingPrice;
let nft;
let nftContractAddress;

let owner, buyer;

before(async () => {
    [owner, buyer] = await ethers.getSigners();

    listingPrice = ethers.utils.parseEther("1");
    const Market = await ethers.getContractFactory("NFTMarket");
    market = await Market.deploy(listingPrice);
    await market.deployed();
    marketContractAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(marketContractAddress);
    await nft.deployed();
    nftContractAddress = nft.address;
});

describe("NFTMarket", () => {
    it("Should get listingPrice", async () => {
        listingPrice = await market.getListingPrice();
        expect(listingPrice).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should be reverted since price < 0", async () => {
        await expect(
            market.listNFT(nftContractAddress, 0, "vincent", "testing", 0)
        ).to.be.revertedWith("Selling price must be at least 1 wei");
    });

    it("Should be reverted since not sending listing price", async () => {
        await nft.createNFT("Test");

        await expect(
            market.listNFT(nftContractAddress, 0, "vincent", "testing", 1, {
                value: listingPrice.sub(1),
            })
        ).to.be.revertedWith("Must have enough listing price");
    });

    it("Should list NFT", async () => {
        await expect(
            market.listNFT(
                nftContractAddress,
                0,
                "vincent",
                "testing",
                ethers.utils.parseEther("1"),
                {
                    value: listingPrice,
                }
            )
        ).to.emit(market, "MarketItemCreated");

        listItem = await market.idToMarketItem(0);
        expect(listItem.price).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should not transfer NFT since money isn't enough", async () => {
        await expect(
            market.connect(buyer).buyNFT(nftContractAddress, 0, {
                value: ethers.utils.parseEther("1").sub(1),
            })
        ).to.be.revertedWith("Plz have enough money!");
    });

    it("Should transfer NFT", async () => {
        await market.connect(buyer).buyNFT(nftContractAddress, 0, {
            value: ethers.utils.parseEther("1"),
        });

        transferItem = await market.idToMarketItem(0);
        expect(transferItem.owner).to.equal(buyer.address);
    });
});
