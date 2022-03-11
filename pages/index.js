import Gallery from "../components/Gallery";
import axios from "axios";

import NFTMarket from "../ethereum/nftMarket";
import { useState, useEffect } from "react";

const App = () => {
    const [uris, setUris] = useState([]);
    const [tokenIds, setTokenIds] = useState([]);
    const [names, setNames] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const marketItems = await NFTMarket.fetchMarketItems();

            const uris = [];
            const tokenIds = [];
            const names = [];
            const sellers = [];
            const owners = [];
            const prices = [];
            let tokenURI;
            for (const marketItem of marketItems) {
                tokenURI = await NFTMarket.tokenURI(marketItem.tokenId);
                tokenIds.push(marketItem.tokenId.toString());
                const meta = await axios.get(tokenURI);
                const { name, price, imageUrl } = meta.data;
                uris.push(imageUrl);
                names.push(name);
                prices.push(price);
                sellers.push(marketItem.seller);
                owners.push(marketItem.owner);
            }
            setUris(uris);
            setTokenIds(tokenIds);
            setNames(names);
            setSellers(sellers);
            setOwners(owners);
            setPrices(prices);
        };
        getData();
    }, []);
    return (
        <div>
            {uris[0] ? (
                <Gallery
                    title={"Marketplace"}
                    uris={uris}
                    tokenIds={tokenIds}
                    names={names}
                    sellers={sellers}
                    owners={owners}
                    prices={prices}
                />
            ) : (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "100vh" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
