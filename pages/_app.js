import "../styles/globals.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.css";

const MyApp = ({ Component, pageProps }) => {
    const [account, setAccount] = useState("");
    const router = useRouter();
    const onConnectClick = async () => {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        router.reload(window.location.pathname);
    };
    useEffect(() => {
        console.log(pageProps);
        typeof document !== undefined
            ? require("bootstrap/dist/js/bootstrap")
            : null;
        const getData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(account);

                window.ethereum.on("accountsChanged", (accounts) => {
                    setAccount(accounts[0]);
                    router.reload();
                });
            }
        };
        console.log(pageProps);
        getData();
    }, [pageProps, router]);
    pageProps = { ...pageProps, account };
    return (
        <div>
            <nav
                className="navbar navbar-expand-lg navbar-light sticky-top"
                style={{ backgroundColor: "#F6F8FF" }}>
                <div className="container ">
                    <Link href="/">
                        <a className="navbar-brand fw-bold fst-italic">
                            Marketplace
                        </a>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link href="/create">
                                    <a
                                        className={`fw-bolder nav-link ${
                                            router.pathname === "/create"
                                                ? "active"
                                                : ""
                                        }`}
                                        href="/create">
                                        Create
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/my">
                                    <a
                                        className={`fw-bolder nav-link ${
                                            router.pathname === "/my"
                                                ? "active"
                                                : ""
                                        }`}
                                        href="/my">
                                        My
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="text-dark fw-bold">
                        {account !== "" ? (
                            account
                        ) : (
                            <button
                                className="btn btn-secondary"
                                onClick={onConnectClick}>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <Component {...pageProps} />
        </div>
    );
};

export default MyApp;
