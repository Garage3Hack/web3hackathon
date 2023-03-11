// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PjDAO.sol";
import "./MemberNFT.sol";

contract PjDAOFactory {
    address public nftContractAddress;
    address[] public allPjDAOs;

    event PjDAOCreated(address pjDAO, address creator);

    constructor(address _nftContractAddress) {
        nftContractAddress = _nftContractAddress;
    }

    function createPjDAO(string memory name, string memory description) public {
        require(IERC721(nftContractAddress).balanceOf(msg.sender) > 0, "Must own NFT to create PjDAO");
        PjDAO newPjDAO = new PjDAO(msg.sender, name, description);
        allPjDAOs.push(address(newPjDAO));
        emit PjDAOCreated(address(newPjDAO), msg.sender);
    }

    function getAllPjDAOs() public view returns (address[] memory) {
        return allPjDAOs;
    }

    // TODO:PJ GovernorをPjDAO毎に作成する
}