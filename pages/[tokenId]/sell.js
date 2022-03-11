import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Image from "next/image";

import NFTMarket from "../../ethereum/nftMarket";

const App = () => {
    const router = useRouter();
    const { tokenId } = router.query;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const getData = async () => {
            if (tokenId) {
                let tokenURI = await NFTMarket.tokenURI(tokenId);
                const meta = await axios.get(tokenURI);
                const { name, price, imageUrl } = meta.data;
                setName(name);
                setPrice(price);
                setImageUrl(imageUrl);
            }
        };

        getData();
    }, [tokenId]);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log(price);
        const listingPrice = await NFTMarket.getListingPrice();
        await NFTMarket.resellToken(tokenId, price, {
            value: listingPrice,
        });
        // console.log(tx);
        // await tx.wait();
        router.push("/");
    };
    return (
        <div className="container">
            <div className="row" style={{ margin: "30px" }}>
                <div className="col"></div>
                <div className="col-6">
                    <div>
                        <h3 style={{ fontWeight: "900" }}>Sell Item</h3>
                        <div className="mb-3" style={{ width: "50%" }}>
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
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>
                            <i
                                className="bi bi-asterisk"
                                style={{
                                    color: "red",
                                    fontSize: "10px",
                                    position: "relative",
                                    left: 2,
                                    bottom: 5,
                                }}></i>
                            <div className="input-group mb-3">
                                <input
                                    id="price"
                                    type="number"
                                    defaultValue={0}
                                    className="form-control"
                                    required
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                />
                                <span className="input-group-text">ETH</span>
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
