// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Organization is ERC721Upgradeable, OwnableUpgradeable, AccessControlUpgradeable {
    using Counters for Counters.Counter;

    Counters.Counter private _diplomaIds;
    string private _organizationName;
    uint private constant MAX_NAME_LENGTH = 0xFF;
    bool private _open;

    mapping(uint256 => string) private _diplomaURIs;  // Each diploma is NFT

    bytes32 private constant READER_ROLE = keccak256("READER_ROLE");  // AccessControl role

    event OrganizationCreated(address owner, string organizationName);
    event DiplomaMinted(address owner, string organizationName, uint256 diplomaId);

    function initOrganization(string memory organizationName, address _owner)
        public
        initializer
    {
        __ERC721_init("Organization", "ORG");
        __Ownable_init();

        require(bytes(organizationName).length <= MAX_NAME_LENGTH, "Organization name's too long!");
        _organizationName = organizationName;

        _grantRole(DEFAULT_ADMIN_ROLE, _owner);  // Internal function to set admin
        grantRole(READER_ROLE, _owner);
        transferOwnership(_owner);  // Because of init (it's not a constructor)

        emit OrganizationCreated(_owner, organizationName);
    }

    modifier onlyReader() {
        if (!_open) {
            require(hasRole(READER_ROLE, msg.sender), "Restricted to <READER> role only!");
        }
        _;
    }

    function isReader(address account) public view returns (bool) {
        if (_open) {
            return true;
        }
        return hasRole(READER_ROLE, account);
    }

    function addReader(address account) public virtual onlyOwner {
        grantRole(READER_ROLE, account);
    }

    function removeReader(address account) public virtual onlyOwner {
        revokeRole(READER_ROLE, account);
    }

    function open() public virtual onlyOwner {
        _open = true;
    }

    function close() public virtual onlyOwner {
        _open = false;
    }

    // ---------------------------
    // View functions ------------
    // ---------------------------

    function getOrganizationName() public view onlyReader returns (string memory) {
        return _organizationName;
    }

    function getDiploma(uint256 idx) public view onlyReader returns (string memory) {
        require((idx <= _diplomaIds.current()), "Index out of range!");
        return _diplomaURIs[idx];
    }

    function getDiplomaAmount() public view onlyReader returns (uint256) {
        return _diplomaIds.current();
    }

    function isOpen() public view returns (bool) {
        return _open;
    }

    // Imposed by OpenZeppelin...
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlUpgradeable, ERC721Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IAccessControlUpgradeable).interfaceId ||
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // ---------------------------
    // Mint functions ------------
    // ---------------------------

    function mintDiploma(address recipient, string memory diplomaURI) public onlyOwner returns (uint256) {
        require(bytes(diplomaURI).length > 0, "Cannot mint empty diploma!");

        _diplomaIds.increment();
        uint256 newDiplomaId = _diplomaIds.current();

        _mint(recipient, newDiplomaId);
        _diplomaURIs[newDiplomaId] = diplomaURI;
        // _setTokenURI(newDiplomaId, diplomaURI);

        emit DiplomaMinted(recipient, _organizationName, newDiplomaId);

        return newDiplomaId;
    }

    // Guarantees that after NFT (Diploma) is transferred, new Owner belongs to <READER> role
    function transferFrom(address from, address to, uint256 tokenId)
        public
        virtual
        override
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);    
        _grantRole(READER_ROLE, to);
    }

    // Guarantees that after NFT (Diploma) is transferred, new Owner belongs to <READER> role
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)
        public
        virtual
        override
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _safeTransfer(from, to, tokenId, _data);
        _grantRole(READER_ROLE, to);
    }
}
