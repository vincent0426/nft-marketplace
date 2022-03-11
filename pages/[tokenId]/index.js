import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Image from "next/image";

import { ethers } from "ethers";
import axios from "axios";

import NFTMarket from "../../ethereum/nftMarket";
import nftMarketAddress from "../../artifacts/contracts/NFTMarket.sol/nftMarket-address.json";

const Nft = () => {
    const router = useRouter();
    const { tokenId } = router.query;
    const [account, setAccount] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [owner, setOwner] = useState("");
    const [seller, setSeller] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [equal, setEqual] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(account);

                window.ethereum.on("accountsChanged", (accounts) => {
                    setAccount(accounts[0]);
                });
            }

            if (tokenId) {
                let tokenURI = await NFTMarket.tokenURI(tokenId);
                const meta = await axios.get(tokenURI);
                const tokenData = await NFTMarket.getTokenData(tokenId);
                const { owner, seller } = tokenData;
                const { name, price, imageUrl } = meta.data;
                setName(name);
                setPrice(price);
                setSeller(seller);
                setOwner(owner);
                setImageUrl(imageUrl);
                setEqual(owner.toUpperCase() === account.toUpperCase());
            }
            setPageLoading(false);
        };

        getData();
    }, [tokenId, account]);
    const onBuyClick = async () => {
        console.log(price);
        const tx = await NFTMarket.createMarketSale(tokenId, {
            value: ethers.utils.parseEther(price),
        });
        await tx.wait();
        router.reload();
    };
    const onSellClick = async () => {
        router.push({
            pathname: `/${tokenId}/sell`,
        });
    };
    return (
        <div>
            {pageLoading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "100vh" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div
                    className="container"
                    style={{ width: "50%", marginTop: "100px" }}>
                    <div className="d-flex">
                        <div style={{ width: "50%" }}>
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
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
                        <div className="card border-0" style={{ width: "50%" }}>
                            <div className="card-body py-0">
                                <div className="d-flex float-end align-items-center">
                                    <Image
                                        src="/../public/img/eth.png"
                                        layout="fixed"
                                        width={40}
                                        height={30}
                                        alt=""
                                    />
                                    {price}
                                </div>
                                <div>
                                    <h3
                                        className="card-title"
                                        style={{ fontWeight: "900" }}>
                                        {name}
                                    </h3>
                                </div>
                                {seller.toUpperCase() ===
                                    account.toUpperCase() &&
                                owner === nftMarketAddress.Address ? (
                                    ""
                                ) : (
                                    <div className="mt-3">
                                        <button
                                            className="btn"
                                            onClick={
                                                equal ? onSellClick : onBuyClick
                                            }
                                            onMouseOut={(e) => {
                                                e.target.style.opacity = "1";
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transition =
                                                    "0.5s";
                                                e.target.style.opacity = "0.7";
                                            }}
                                            style={{
                                                backgroundColor: "#9EB4D1",
                                                width: "100%",
                                            }}>
                                            {equal ? "Sell" : "Buy"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nft;
