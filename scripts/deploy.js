async function main() {
    const [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    console.log("Account balance:", (await owner.getBalance()).toString());

    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();

    console.log("NFTMarket address:", nftMarket.address);

    saveFrontendFiles(nftMarket);
}

function saveFrontendFiles(nftMarket) {
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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
