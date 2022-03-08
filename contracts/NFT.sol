//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketContractAddress;

    constructor(address marketplaceContractAddress)
        ERC721("Metaverse Tokens", "METT")
    {
        marketContractAddress = marketplaceContractAddress;
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        console.log(newTokenId);
        _tokenIds.increment();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        setApprovalForAll(marketContractAddress, true);

        return newTokenId;
    }
}
