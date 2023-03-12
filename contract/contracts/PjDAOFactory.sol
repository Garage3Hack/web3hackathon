// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PjDAO.sol";
import "./MemberNFT.sol";
import "./TimelockController.sol";
import "./PjGovernor.sol";

contract PjDAOFactory {

    struct PjDAOInfo {
        address pjDAO;
        address creator;
        address timeLockController;
        address pjGovernor;
        string name;
        string description;
    }

    address public memberNftContractAddress;
    address public badgeNftContractAddress;
    PjDAOInfo[] public allPjDAOs;

    event PjDAOCreated(address pjDAO, address creator);

    constructor(address _memberNftContractAddress, address _badgeNftContractAddress) {
        memberNftContractAddress = _memberNftContractAddress;
        badgeNftContractAddress = _badgeNftContractAddress;
    }

    function createPjDAO(string memory name, string memory description) public {
        require(
            IERC721(memberNftContractAddress).balanceOf(msg.sender) > 0,
            "Must own NFT to create PjDAO"
        );

        address[] memory owners = new address[](1);
        owners[0] = msg.sender;
        TimelockController newTimelockController = new TimelockController(
            1, // sec
            owners,
            owners,
            msg.sender
        );

        PjGovernor newPjGovernor = new PjGovernor(IVotes(memberNftContractAddress), TimelockController(newTimelockController));

        PjDAO newPjDAO = new PjDAO(msg.sender, name, description, badgeNftContractAddress);
        
        allPjDAOs.push(
            PjDAOInfo({
                pjDAO: address(newPjDAO),
                creator: msg.sender,
                timeLockController: address(newTimelockController),
                pjGovernor: address(newPjGovernor),
                name: name,
                description: description
            })
        );
        emit PjDAOCreated(address(newPjDAO), msg.sender);
    }

    function getAllPjDAOs() public view returns (PjDAOInfo[] memory) {
        return allPjDAOs;
    }

}
