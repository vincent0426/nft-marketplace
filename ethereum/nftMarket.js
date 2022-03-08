import { ethers } from "ethers";

import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import nftMarketAddress from "../artifacts/contracts/NFTMarket.sol/nftMarket-address.json";

let nftMarketContract;

if (typeof window !== "undefined") {
    // browser code
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    nftMarketContract = new ethers.Contract(
        nftMarketAddress.Address,
        NFTMarket.abi,
        signer
    );
} else {
    const provider = new ethers.providers.JsonRpcProvider();
    nftMarketContract = new ethers.Contract(
        nftMarketAddress.Address,
        NFTMarket.abi,
        provider
    );
}

export default nftMarketContract;
