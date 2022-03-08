import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Image from "next/image";

import { ethers } from "ethers";
import NFTMarket from "../ethereum/nftMarket";
import nftAddress from "../artifacts/contracts/NFT.sol/nft-address.json";

const Nft = () => {
    const router = useRouter();
    const { id, itemId } = router.query;
    const [account, setAccount] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [owner, setOwner] = useState("");
    const [seller, setSeller] = useState("");
    const [equal, setEqual] = useState(true);
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
            if (itemId) {
                const item = await NFTMarket.idToMarketItem(itemId);

                const { name, description, seller, owner } = item;
                const price = ethers.utils.formatEther(item.price.toString());
                setName(name);
                setDescription(description);
                setPrice(price);
                setSeller(seller);
                setOwner(owner);
                setEqual(owner.toUpperCase() === account.toUpperCase());
            }
        };

        getData();
    }, [owner, seller, account, itemId]);

    const onBuyClick = async () => {
        await NFTMarket.buyNFT(nftAddress.Address, itemId, {
            value: ethers.utils.parseEther(price),
        });
        router.reload();
    };
    const onSellClick = async () => {
        router.push({
            pathname: `/${id}}/sell`,
            query: {
                itemId: itemId,
            },
        });
    };
    return (
        <div className="container" style={{ width: "50%", marginTop: "100px" }}>
            <div className="d-flex">
                <div style={{ width: "50%" }}>
                    <Image
                        src={`https://ipfs.infura.io/ipfs/${id}`}
                        alt="pic"
                        width="100%"
                        height="100%"
                        layout="responsive"
                        objectFit={"cover"}
                    />
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
                            {owner}
                            <br></br>
                            {seller}
                            <p className="card-text">{description}</p>
                        </div>
                        {seller.toUpperCase() === account.toUpperCase() &&
                        owner ===
                            "0x0000000000000000000000000000000000000000" ? (
                            ""
                        ) : (
                            <div className="mt-3">
                                <button
                                    className="btn"
                                    onClick={equal ? onSellClick : onBuyClick}
                                    onMouseOut={(e) => {
                                        e.target.style.opacity = "1";
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transition = "0.5s";
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
    );
};

export default Nft;
