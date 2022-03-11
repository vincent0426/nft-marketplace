import React, { useState, useEffect } from "react";

import Gallery from "../components/Gallery";

import NFTMarket from "../ethereum/nftMarket";
import axios from "axios";

const My = ({ account }) => {
    const [uris, setUris] = useState([]);
    const [tokenIds, setTokenIds] = useState([]);
    const [names, setNames] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const marketItems = await NFTMarket.fetchMyNFTs();

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
    }, [account]);

    return (
        <div>
            <Gallery
                title={"My Gallery"}
                uris={uris}
                tokenIds={tokenIds}
                names={names}
                sellers={sellers}
                owners={owners}
                prices={prices}
            />
        </div>
    );
};

export default My;
