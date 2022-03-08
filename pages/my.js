import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import Gallery from "../components/Gallery";

import NFT from "../ethereum/nft";
import NFTMarket from "../ethereum/nftMarket";

const My = ({ account }) => {
    const [ids, setIds] = useState([]);
    const [names, setNames] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [prices, setPrices] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [cids, setCids] = useState([]);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        const getData = async () => {
            let imageUrl;
            let cid;
            let tempIds = [],
                tempNames = [],
                tempDescriptions = [],
                tempPrices = [],
                tempImageUrls = [],
                tempCids = [],
                tempSellers = [];
            const marketItems = await NFTMarket.fetchMyItems();
            for (let marketItem of marketItems) {
                tempIds.push(marketItem.itemId.toString());
                tempNames.push(marketItem.name);
                tempDescriptions.push(marketItem.description);
                tempPrices.push(
                    ethers.utils.formatEther(marketItem.price.toString())
                );
                imageUrl = await NFT.tokenURI(marketItem.tokenId);
                tempImageUrls.push(imageUrl);
                cid = imageUrl.replace("https://ipfs.infura.io/ipfs/", "");
                tempCids.push(cid);
                tempSellers.push(marketItem.seller);
            }
            setIds(tempIds);
            setNames(tempNames);
            setDescriptions(tempDescriptions);
            setPrices(tempPrices);
            setImageUrls(tempImageUrls);
            setCids(tempCids);
            setSellers(tempSellers);
        };

        getData();
    }, [account]);

    return (
        <div>
            <Gallery
                title="Gallery"
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

export default My;
