// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract DAOMembership is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    uint16 public MAX_MEMBERS;
    uint64 public PRICE;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    event Rug(uint256 amount);

    function initialize() public initializer {
        __ERC721_init("DAO Membership", "DAO");
        __ERC721Enumerable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        MAX_MEMBERS = 420;
        PRICE = 420 * 10**14;
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmcrzebfnkihRuarHfEWj8u99C3r794czr4amvsi1w8Lrv?filename=NFTMintPass-v5-Final%20(1).gif";
    }

    function safeMint(address to) public onlyOwner {
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

    function rug() external {
        uint256 balance = address(this).balance;
        address payable to = payable(owner());
        to.transfer(address(this).balance);
        emit Rug(balance);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
