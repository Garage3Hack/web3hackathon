// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract PjDAO {
    enum PjRole {
        PRODUCTMANAGER,
        PROJECTMANAGER,
        DEVELOPER,
        DESIGNER,
        MARKETER
    }

    struct Member {
        PjRole role;
    }

    mapping(address => Member) public members;

    address public owner;
    string public name;
    string public description;

    modifier onlyOwner() {
        require(msg.sender == owner, "PjDAO: Only owner can access.");
        _;
    }

    constructor(address _owner, string memory _name, string memory _description) {
        owner = _owner;
        name = _name;
        description = _description;
        members[_owner].role = PjRole.PRODUCTMANAGER;
    }

    function addMember(address _memberAddress, PjRole _role) public onlyOwner {
        require(members[_memberAddress].role == PjRole(0), "PjDAO: Member already exists");
        members[_memberAddress] = Member(_role);
    }

    function removeMember(address _memberAddress) public onlyOwner {
        require(members[_memberAddress].role != PjRole(0), "PjDAO: Member does not exist");
        delete members[_memberAddress];
    }
}