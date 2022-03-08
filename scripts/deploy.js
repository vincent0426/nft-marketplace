async function main() {
    const [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();
    const listingPrice = "0.025";
    console.log("Deploying contracts with the account:", owner.address);

    console.log("Account balance:", (await owner.getBalance()).toString());

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy(
        ethers.utils.parseEther(listingPrice)
    );
    await nftMarket.deployed();

    console.log("Market address:", nftMarket.address);

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(nftMarket.address);
    await nft.deployed();

    console.log("NFT address:", nft.address);

    saveFrontendFiles(nftMarket, nft);
}

function saveFrontendFiles(nftMarket, nft) {
    const fs = require("fs");
    const nftMarketAddress =
        __dirname + "/../artifacts/contracts/NFTMarket.sol";

    if (!fs.existsSync(nftMarketAddress)) {
        fs.mkdirSync(nftMarketAddress);
    }

    fs.writeFileSync(
        nftMarketAddress + "/nftMarket-address.json",
        JSON.stringify({ Address: nftMarket.address }, undefined, 2)
    );

    const nftAddress = __dirname + "/../artifacts/contracts/NFT.sol";

    if (!fs.existsSync(nftAddress)) {
        fs.mkdirSync(nftAddress);
    }

    fs.writeFileSync(
        nftAddress + "/nft-address.json",
        JSON.stringify({ Address: nft.address }, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
