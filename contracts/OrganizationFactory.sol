// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Organization.sol";


contract OrganizationFactory { 
    address immutable _organizationImplementation;  // contract to clone
    address[] private _organizations;  // Deployed organizations

    constructor() {
        _letterImplementation = address(new Organization());
    }

    function createOrganization(string memory organizationName) external returns (address) {
        address cloned_address = Clones.clone(_organizationImplementation);
        Organization(cloned_address).initOrganization(organizationName, msg.sender);
        _letters.push(cloned_address);
        return cloned_address;
    }

    function getOrganizationAmount() public view returns (uint256) {
        return _organizations.length;
    }

    function getOrganizationAddress(uint256 idx) public view returns (address) {
        require(idx < _organizations.length, "getOrganizationAddress() --- Index out of range!");
        return _organizations[idx];
    } 
}
