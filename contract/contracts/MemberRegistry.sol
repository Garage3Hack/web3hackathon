// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MemberRegistry {
    struct Member {
        string name;
        string introduction;
        string[] skills;
        bool exists;
    }

    mapping(address => Member) private members;
    address[] private memberList;

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function addMember(string memory _name, string memory _introduction, string[] memory _skills) public {
        require(!members[msg.sender].exists, "Member already exists");
        members[msg.sender] = Member(_name, _introduction, _skills, true);
        memberList.push(msg.sender);
    }

    function updateIntroduction(string memory _introduction) public {
        require(members[msg.sender].exists, "Member does not exist");
        members[msg.sender].introduction = _introduction;
    }

    function addSkill(string memory _skill) public {
        require(members[msg.sender].exists, "Member does not exist");
        members[msg.sender].skills.push(_skill);
    }

    function updateSkill(uint256 _index, string memory _skill) public {
        require(members[msg.sender].exists, "Member does not exist");
        require(_index < members[msg.sender].skills.length, "Index out of bounds");
        members[msg.sender].skills[_index] = _skill;
    }

    function removeSkill(uint256 _index) public {
        require(members[msg.sender].exists, "Member does not exist");
        require(_index < members[msg.sender].skills.length, "Index out of bounds");
        for (uint256 i = _index; i < members[msg.sender].skills.length - 1; i++) {
            members[msg.sender].skills[i] = members[msg.sender].skills[i+1];
        }
        members[msg.sender].skills.pop();
    }

    function getMember(address _addr) public view returns (string memory, string memory, string[] memory) {
        return (members[_addr].name, members[_addr].introduction, members[_addr].skills);
    }

    function getAllMembers() public view returns (address[] memory) {
        return memberList;
    }

    function deleteMember(address _addr) public {
        require(members[_addr].exists, "Member does not exist");
        require(msg.sender == owner || msg.sender == _addr, "Only owner or member can delete the member");
        delete members[_addr];
        for (uint256 i = 0; i < memberList.length; i++) {
            if (memberList[i] == _addr) {
                memberList[i] = memberList[memberList.length - 1];
                memberList.pop();
                break;
            }
        }
    }
}