import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Image from "next/image";

import NFT from "../../ethereum/nft";
import NFTMarket from "../../ethereum/nftMarket";
import nftAddress from "../../artifacts/contracts/NFT.sol/nft-address.json";

const App = () => {
    const router = useRouter();
    const { id, itemId } = router.query;
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [owner, setOwner] = useState("");
    useEffect(() => {
        const getData = async () => {
            if (itemId) {
                const {
                    nftContract,
                    tokenId,
                    name,
                    description,
                    price,
                    owner,
                } = await NFTMarket.idToMarketItem(itemId);
                setTokenId(tokenId);
                setName(name);
                setDescription(description);
                setPrice(ethers.utils.formatEther(price.toString()));
                setOwner(owner);
                console.log(
                    nftContract,
                    tokenId.toString(),
                    name,
                    description,
                    price.toString()
                );
            }
        };

        getData();
    }, [itemId, id]);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const url = `https://ipfs.infura.io/ipfs/${id}`;
        console.log(url);
        const transaction = await NFT.createNFT(url);
        console.log(transaction);
        const tx = await transaction.wait();

        const event = tx.events[0];
        const value = event.args[2];
        const tokenId = value.toNumber();

        const listingPrice = await NFTMarket.getListingPrice();
        listingPrice = listingPrice.toString();

        transaction = await NFTMarket.listNFT(
            nftAddress.Address,
            tokenId,
            name,
            description,
            price,
            {
                value: listingPrice,
            }
        );
        tx = await transaction.wait();
        console.log(tx);
        router.push("/");
    };
    return (
        <div className="container">
            <div className="row" style={{ margin: "30px" }}>
                <div className="col"></div>
                <div className="col-6">
                    <div>
                        <h1>{owner}</h1>
                        <h3 style={{ fontWeight: "900" }}>Sell Item</h3>
                        <div className="mb-3" style={{ width: "50%" }}>
                            {id ? (
                                <Image
                                    src={`https://ipfs.infura.io/ipfs/${id.slice(
                                        0,
                                        -1
                                    )}`}
                                    alt="pic"
                                    width="100%"
                                    height="100%"
                                    layout="responsive"
                                    objectFit={"cover"}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                        <form onSubmit={onFormSubmit}>
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <div className="mb-3">
                                <input
                                    id="name"
                                    style={{ width: "100%" }}
                                    placeholder="Item Name"
                                    className="border rounded p-2"
                                    defaultValue={name}
                                    disabled
                                />
                            </div>
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <div className="mb-3">
                                <textarea
                                    style={{ width: "100%" }}
                                    id="description"
                                    placeholder="Item Description"
                                    className="border rounded p-2"
                                    defaultValue={description}
                                    disabled
                                />
                            </div>
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>
                            <div className="mb-5">
                                <input
                                    id="price"
                                    type="number"
                                    style={{ width: "100%" }}
                                    placeholder="Price in ETH"
                                    className="border rounded p-2"
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "90px",
                                    backgroundColor: "#9EB4D1",
                                    color: "white",
                                }}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    <span>Sell</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
};

export default App;
