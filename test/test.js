/* test/sample-test.js */
describe("NFTMarket", function () {
    it("Should create and execute market sales", async function () {
        /* deploy the marketplace */
        const NFTMarket = await ethers.getContractFactory("NFTMarket");
        const nftMarket = await NFTMarket.deploy();
        await nftMarket.deployed();

        let listingPrice = await nftMarket.getListingPrice();
        listingPrice = listingPrice.toString();

        const auctionPrice = ethers.utils.parseUnits("1", "ether");

        /* create two tokens */
        await nftMarket.createToken(
            "https://www.mytokenlocation.com",
            auctionPrice,
            { value: listingPrice }
        );
        await nftMarket.createToken(
            "https://www.mytokenlocation2.com",
            auctionPrice,
            { value: listingPrice }
        );

        const [_, buyerAddress] = await ethers.getSigners();

        /* execute sale of token to another user */
        await nftMarket
            .connect(buyerAddress)
            .createMarketSale(1, { value: auctionPrice });

        /* resell a token */
        await nftMarket
            .connect(buyerAddress)
            .resellToken(1, auctionPrice, { value: listingPrice });

        /* query for and return the unsold items */
        items = await nftMarket.fetchMarketItems();
        items = await Promise.all(
            items.map(async (i) => {
                const tokenUri = await nftMarket.tokenURI(i.tokenId);
                let item = {
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    seller: i.seller,
                    owner: i.owner,
                    tokenUri,
                };
                return item;
            })
        );
        console.log("items: ", items);
    });
});
