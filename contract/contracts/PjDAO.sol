// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BadgeNFT.sol";

contract PjDAO {
    enum PjRole {
        PRODUCTMANAGER,
        PROJECTMANAGER,
        DEVELOPER,
        DESIGNER,
        MARKETER
    }

    struct ActivityInfo {
        uint256 joinedOrlastMintedBlockAt;
    }

    struct Member {
        PjRole role;
        ActivityInfo info;
    }

    mapping(address => Member) public members;

    address public owner;
    address public badgeNftContractAddress;
    string public name;
    string public description;

    uint256 public constant MINT_PERIOD = 300; // 期間 300 ブロック*12 = 3600sec
    uint256 public constant MINT_AMOUNT = 1; // 発行数 1 枚

    event MemberAdded(address indexed memberAddress, PjRole role);
    event MemberRemoved(address indexed memberAddress);
    event NFTMinted(address indexed owner, address indexed memberAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "PjDAO: Only owner can access.");
        _;
    }

    constructor(address _owner, string memory _name, string memory _description, address _badgeNftContractAddress) {
        owner = _owner;
        name = _name;
        description = _description;
        members[_owner].role = PjRole.PRODUCTMANAGER;
        badgeNftContractAddress = _badgeNftContractAddress;
    }

    function addMember(address _memberAddress, PjRole _role) public onlyOwner {
        require(members[_memberAddress].role == PjRole(0), "PjDAO: Member already exists");
        members[_memberAddress] = Member(_role, ActivityInfo(block.number));

        emit MemberAdded(_memberAddress, _role);
    }

    function removeMember(address _memberAddress) public onlyOwner {
        require(members[_memberAddress].role != PjRole(0), "PjDAO: Member does not exist");
        delete members[_memberAddress];

        emit MemberRemoved(_memberAddress);
    }


    function mintNftByNftOwner(address _targetAddress) public {
        ActivityInfo storage info = members[_targetAddress].info;
        require(block.number - info.joinedOrlastMintedBlockAt >= MINT_PERIOD, "The target member has not been enrolled for the specified period");

        // NFTの発行処理
        BadgeNFT nftContract = BadgeNFT(badgeNftContractAddress);
        nftContract.safeMint(_targetAddress, "token_uri");
        info.joinedOrlastMintedBlockAt = block.number;

        emit NFTMinted(msg.sender, _targetAddress);

    }
}