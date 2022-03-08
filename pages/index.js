import { ethers } from "ethers";

import Gallery from "../components/Gallery";

import NFT from "../ethereum/nft";
import NFTMarket from "../ethereum/nftMarket";

const App = ({
    ids,
    names,
    descriptions,
    prices,
    imageUrls,
    cids,
    sellers,
}) => {
    return (
        <div>
            <Gallery
                title={"Gallery"}
                ids={ids}
                names={names}
                descriptions={descriptions}
                prices={prices}
                imageUrls={imageUrls}
                cids={cids}
                sellers={sellers}
            />
        </div>
    );
};

export async function getStaticProps() {
    const marketItems = await NFTMarket.fetchMarketItems();
    const ids = [];
    const names = [];
    const descriptions = [];
    const prices = [];
    let imageUrl;
    const imageUrls = [];
    let cid;
    const cids = [];
    const sellers = [];
    for (let marketItem of marketItems) {
        ids.push(marketItem.itemId.toString());
        names.push(marketItem.name);
        descriptions.push(marketItem.description);
        prices.push(ethers.utils.formatEther(marketItem.price.toString()));
        imageUrl = await NFT.tokenURI(marketItem.tokenId);
        imageUrls.push(imageUrl);
        cid = imageUrl.replace("https://ipfs.infura.io/ipfs/", "");
        cids.push(cid);
        sellers.push(marketItem.seller);
    }
    return {
        props: { ids, names, descriptions, prices, imageUrls, cids, sellers },
    };
}

export default App;
