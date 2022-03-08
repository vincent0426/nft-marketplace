import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import "bootstrap-icons/font/bootstrap-icons.css";
import Image from "next/image";
import { useRouter } from "next/router";

import NFT from "../ethereum/nft";
import NFTMarket from "../ethereum/nftMarket";
import nftAddress from "../artifacts/contracts/NFT.sol/nft-address.json";

const CreateTransfer = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        name: "",
        description: "",
        price: "",
    });
    const [loading, setLoading] = useState(false);
    const inputFile = useRef(null);

    const router = useRouter();

    useEffect(() => {}, [inputFile]);

    const onFileClick = async () => {
        // const tx = await nftMarket.fetchMarketItems();
        // const item = tx[0];
        // const tokenURI = await nft.tokenURI(item.tokenId);
        // console.log(item);
        // console.log(tokenURI);
        inputFile.current.click();
    };

    const onChange = (e) => {
        const file = e.target.files[0];
        onFileChange(file);
    };

    const onFileChange = async (file) => {
        setLoading(true);
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        setLoading(false);
    };

    const createSale = async (url) => {
        const transaction = await NFT.createNFT(url);
        const tx = await transaction.wait();
        const event = tx.events[0];
        const value = event.args[2];
        const tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price, "ether");
        const listingPrice = await NFTMarket.getListingPrice();
        listingPrice = listingPrice.toString();

        transaction = await NFTMarket.listNFT(
            nftAddress.Address,
            tokenId,
            formInput.name,
            formInput.description,
            price,
            {
                value: listingPrice,
            }
        );
        tx = await transaction.wait();
        console.log(tx);
        router.push("/");
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();

        createSale(fileUrl);
    };

    return (
        <div className="container">
            <div className="row" style={{ margin: "30px" }}>
                <div className="col"></div>
                <div className="col-6">
                    <div>
                        <h3 style={{ fontWeight: "900" }}>Create New Item</h3>
                        <form onSubmit={onFormSubmit}>
                            <div className="mb-3">
                                <div className="my-3">
                                    <input
                                        style={{ display: "none" }}
                                        ref={inputFile}
                                        onChange={onChange}
                                        type="file"
                                        accept="image/*"
                                    />
                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            width: "300px",
                                            height: "250px",
                                        }}>
                                        {loading ? (
                                            <div className="">
                                                <div
                                                    className="spinner-grow"
                                                    role="status"></div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: "300px",
                                                    height: "250px",
                                                    cursor: "pointer",
                                                }}>
                                                {fileUrl ? (
                                                    <div
                                                        onClick={onFileClick}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            position:
                                                                "relative",
                                                        }}>
                                                        <Image
                                                            className="border"
                                                            layout="fill"
                                                            objectFit={"cover"}
                                                            src={fileUrl}
                                                            alt=""
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={onFileClick}
                                                        className="border d-flex justify-content-center align-items-center text-secondary"
                                                        style={{
                                                            width: "300px",
                                                            height: "250px",
                                                            cursor: "pointer",
                                                        }}>
                                                        <i
                                                            className="bi bi-upload"
                                                            style={{
                                                                fontSize: "4em",
                                                            }}></i>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={onFileClick}
                                    style={{
                                        backgroundColor: "#9EB4D1",
                                        color: "white",
                                    }}>
                                    Select Image
                                </button>
                            </div>
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <div className="mb-3">
                                <input
                                    id="name"
                                    style={{ width: "100%" }}
                                    placeholder="Item Name"
                                    className="border rounded p-2"
                                    onChange={(e) =>
                                        updateFormInput({
                                            ...formInput,
                                            name: e.target.value,
                                        })
                                    }
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
                                    onChange={(e) =>
                                        updateFormInput({
                                            ...formInput,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>
                            <div className="mb-5">
                                <input
                                    id="price"
                                    style={{ width: "100%" }}
                                    placeholder="Price in ETH"
                                    className="border rounded p-2"
                                    onChange={(e) =>
                                        updateFormInput({
                                            ...formInput,
                                            price: e.target.value,
                                        })
                                    }
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
                                    <span>Create</span>
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

export default CreateTransfer;
