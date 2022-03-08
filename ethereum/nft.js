import { ethers } from "ethers";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import nftAddress from "../artifacts/contracts/NFT.sol/nft-address.json";

let nftContract;

if (typeof window !== "undefined") {
    // browser code
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    nftContract = new ethers.Contract(nftAddress.Address, NFT.abi, signer);
} else {
    const provider = new ethers.providers.JsonRpcProvider();
    nftContract = new ethers.Contract(nftAddress.Address, NFT.abi, provider);
}

export default nftContract;
