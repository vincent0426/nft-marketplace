import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import "bootstrap-icons/font/bootstrap-icons.css";
import Image from "next/image";
import { useRouter } from "next/router";

import NFTMarket from "../ethereum/nftMarket";

const CreateItem = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        name: "",
        price: "",
    });
    const [imageLoading, setImageLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const imageFile = useRef(null);

    const router = useRouter();

    useEffect(() => {}, [imageFile]);

    const onFileClick = async () => {
        imageFile.current.click();
    };

    // const onChange = (e) => {
    //     const file = e.target.files[0];
    //     onFileChange(file);
    // };

    const onChange = async (e) => {
        setImageLoading(true);
        /* upload image to IPFS */
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        setImageLoading(false);
    };

    const uploadToIPFS = async () => {
        setButtonLoading(true);
        const { name, price } = formInput;
        const data = JSON.stringify({
            name,
            price,
            imageUrl: fileUrl,
        });
        try {
            const added = await client.add(data, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            return url;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        setButtonLoading(false);
    };

    const createSale = async () => {
        let listingPrice = await NFTMarket.getListingPrice();
        listingPrice = listingPrice.toString();

        let price = ethers.utils.parseEther(formInput.price);
        price = price.toString();
        const url = uploadToIPFS();
        const transaction = await NFTMarket.createToken(url, price, {
            value: listingPrice,
        });
        await transaction.wait();

        router.push("/");
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();

        createSale();
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
                                        ref={imageFile}
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
                                        {imageLoading ? (
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
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>
                            <div className="mb-5">
                                <input
                                    id="price"
                                    required
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
                                {buttonLoading ? (
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

export default CreateItem;
