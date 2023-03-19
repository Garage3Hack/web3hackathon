// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PjDAO.sol";
import "./MemberNFT.sol";
// import "./TimelockController.sol";
// import "./PjGovernor.sol";

contract PjDAOFactoryShrink {

    struct PjDAOInfo {
        address pjDAO;
        address creator;
        // address timeLockController;
        // address pjGovernor;
        string name;
        string description;
        string pjImageUri;
    }

    address public memberNftContractAddress;
    address public badgeNftContractAddress;
    PjDAOInfo[] public allPjDAOs;

    string[] private pjImageUris;


    event PjDAOCreated(address pjDAO, address creator);

    constructor(address _memberNftContractAddress, address _badgeNftContractAddress) {
        memberNftContractAddress = _memberNftContractAddress;
        badgeNftContractAddress = _badgeNftContractAddress;

        setPjImageUri("https://ipfs.io/ipfs/QmXCZ6hnDChsBVmCeo6SgzeZKAEiXomw2WUgNAXkN8Qz5P");
        setPjImageUri("https://ipfs.io/ipfs/QmXeXkUfgRBYczQWcbbGvKAuznWFuM1NUp6R9vKsBbM1vm");
        setPjImageUri("https://ipfs.io/ipfs/QmWqnfrFniZh7mKAxkVTzrm3yGuUR7TCop5jL2CB1CqAYN");
        setPjImageUri("https://ipfs.io/ipfs/QmVwbr9D4JyotQFYWc8KPxfuUS4WMwJeWDLLnxa6FzELEo");
        setPjImageUri("https://ipfs.io/ipfs/QmWew1h7zHr1qrLwQqdsopJy2GDi6FnwH8wFDatGWyeP95");
        setPjImageUri("https://ipfs.io/ipfs/QmNXGGEnVjtcuAc1UMjSmD8BYqb9NniGMzvb2F74Jnp261");
        setPjImageUri("https://ipfs.io/ipfs/Qmchu5DQe32UMcHgnEtzRJhB8qCsUxwU6yDiWnsLiRhphN");
        setPjImageUri("https://ipfs.io/ipfs/QmZjG4KfU47EAnpr6csqQUTYziLZ6WQYpuFbAMx6QaQ8ey");
        setPjImageUri("https://ipfs.io/ipfs/QmXoEVGGaLyKq8jgbJLLrRg7oYXZME64myuhYkiMsmPdFo");
        setPjImageUri("https://ipfs.io/ipfs/QmUk4Y4f1NBjwhUv5cgHjR4683e9rjDDuPT8uTBsPLq4gN");

    }

    function createPjDAO(string memory name, string memory description) public {
        require(
            IERC721(memberNftContractAddress).balanceOf(msg.sender) > 0,
            "Must own NFT to create PjDAO"
        );

        // address[] memory owners = new address[](1);
        // owners[0] = msg.sender;
        // TimelockController newTimelockController = new TimelockController(
        //     1, // sec
        //     owners,
        //     owners,
        //     msg.sender
        // );

        // PjGovernor newPjGovernor = new PjGovernor(IVotes(memberNftContractAddress), TimelockController(newTimelockController));

        string memory pjImageUri = getRandomPjImageUri();
        PjDAO newPjDAO = new PjDAO(msg.sender, name, description, badgeNftContractAddress, pjImageUri);
        
        allPjDAOs.push(
            PjDAOInfo({
                pjDAO: address(newPjDAO),
                creator: msg.sender,
                // timeLockController: address(newTimelockController),
                // pjGovernor: address(newPjGovernor),
                name: name,
                description: description,
                pjImageUri: pjImageUri
            })
        );
        emit PjDAOCreated(address(newPjDAO), msg.sender);
    }

    function getAllPjDAOs() public view returns (PjDAOInfo[] memory) {
        return allPjDAOs;
    }

    function setPjImageUri(string memory uri) public {
        pjImageUris.push(uri);
    }

    function removePjImageUri(uint256 index) public {
        require(index < pjImageUris.length, "Index out of bounds");
        for (uint256 i = index; i < pjImageUris.length - 1; i++) {
            pjImageUris[i] = pjImageUris[i + 1];
        }
        pjImageUris.pop();
    }

    function getRandomPjImageUri() public view returns (string memory) {
        require(pjImageUris.length > 0, "No image available");
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % pjImageUris.length;
        return pjImageUris[randomIndex];
    }

    function getPjImageUris() public view returns (string[] memory) {
        return pjImageUris;
    }

}
