// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MembershipToken is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint16 public MAX_MEMBERS = 420;
    uint64 public PRICE = 420 * 10**14;

    constructor() ERC721("DAO Membership", "DAO") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmcrzebfnkihRuarHfEWj8u99C3r794czr4amvsi1w8Lrv?filename=NFTMintPass-v5-Final%20(1).gif";
    }

    function tokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function safeMint(address to) public onlyOwner {
        require(
            _tokenIdCounter.current() < MAX_MEMBERS,
            "Maximum number of members reached"
        );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function mint(address to) public payable returns (uint256) {
        require(msg.value == PRICE, "Minting price is incorrect");
        require(
            _tokenIdCounter.current() < MAX_MEMBERS,
            "Maximum number of members reached"
        );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
