import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const Gallery = ({
    title,
    ids,
    names,
    descriptions,
    prices,
    imageUrls,
    cids,
    sellers,
}) => {
    const [account, setAccount] = useState("");
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
        };

        getData();
    }, [ids]);

    const router = useRouter();
    const renderedNFT = (i) => {
        return (
            <div key={i} className="col-4 mb-4">
                <div
                    className="card"
                    style={{ height: "350px", cursor: "pointer" }}
                    onClick={() => {
                        router.push({
                            pathname: `/${cids[i]}`,
                            query: {
                                itemId: ids[i],
                            },
                        });
                    }}
                    onMouseOut={(e) => {
                        const targetParent =
                            e.target.parentElement.parentElement;
                        targetParent.style.transform = "scale(1.0)";
                        targetParent.style.opacity = "1";
                    }}
                    onMouseOver={(e) => {
                        const targetParent =
                            e.target.parentElement.parentElement;
                        targetParent.style.transform = "scale(1.05)";
                        targetParent.style.transition = "0.5s";
                        targetParent.style.opacity = "0.7";
                    }}>
                    {sellers[i] &&
                    account.toUpperCase() === sellers[i].toUpperCase() ? (
                        <div
                            className="btn border-bottom border-end"
                            style={{
                                backgroundColor: "white",
                                position: "absolute",
                                zIndex: 1,
                            }}>
                            Mine
                        </div>
                    ) : (
                        ""
                    )}
                    {imageUrls[0] ? (
                        <Image
                            src={`${imageUrls[i]}`}
                            width="100%"
                            height="100%"
                            layout="responsive"
                            objectFit={"cover"}
                            className="card-img-top"
                            alt="..."
                        />
                    ) : (
                        ""
                    )}

                    <div className="card-body border-top">
                        <h5 className="card-title">{names[i]}</h5>
                        <div className="d-flex float-end align-items-center">
                            <Image
                                src="/../public/img/eth.png"
                                layout="fixed"
                                width={40}
                                height={30}
                                alt=""
                            />
                            {prices[i]}
                        </div>
                        <p className="card-text">{descriptions[i]}</p>
                    </div>
                </div>
            </div>
        );
    };
    const renderedNFTs = () => {
        const nfts = [];
        for (let i = 0; i < ids.length; i++) {
            nfts.push(renderedNFT(i));
        }
        return nfts;
    };
    return (
        <div className="container" style={{ width: "60%" }}>
            <h1 className="text-center my-4" style={{ fontWeight: "900" }}>
                {title}
            </h1>

            {ids[0] ? (
                <div className="row justify-content-start">
                    {renderedNFTs()}
                </div>
            ) : (
                <div>No items</div>
            )}
        </div>
    );
};

export default Gallery;
