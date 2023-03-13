// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BadgeNFT.sol";

contract PjDAO {
    enum PjRole {
        None,
        PRODUCTMANAGER,
        PROJECTMANAGER,
        DEVELOPER,
        DESIGNER,
        MARKETER
    }

    enum IssueStatus {
        ToDo,
        InProgress,
        Done,
        Pending
    }

    struct ActivityInfo {
        uint256 joinedOrlastMintedBlockAt;
    }

    struct Member {
        PjRole role;
        ActivityInfo info;
    }

    struct Issue {
        uint256 id;
        string title;
        string description;
        address creator;
        IssueStatus status;
        uint256 createdBlockAt;
        uint256 closedBlockAt;
        mapping(address => uint256) likeCounts;
    }

    mapping(address => Member) public members;

    address public owner;
    address public badgeNftContractAddress;
    string public name;
    string public description;

    uint256 public constant MINT_PERIOD = 300; // 期間 300 ブロック*12 = 3600sec
    uint256 public constant MINT_AMOUNT = 1; // 発行数 1 枚
    uint256 public constant RECENT_ISSUE_PERIOD = 300; // 期間 300 ブロック*12 = 3600sec

    mapping(uint256 => Issue) public issues;
    uint256 public issueId = 0; // max issue count

    event MemberAdded(address indexed memberAddress, PjRole role);
    event MemberRemoved(address indexed memberAddress);
    event NFTMinted(address indexed owner, address indexed memberAddress);
    event IssueAdded(uint256 indexed issueId, string title, string description, address indexed creator, IssueStatus status, uint256 createdBlockAt);
    event IssueLiked(uint256 indexed issueId, address indexed memberAddress, uint256 indexed likeCount);
    event IssueStatusChanged(uint256 indexed id, IssueStatus status, uint256 doneBlock);

    modifier onlyOwner() {
        require(msg.sender == owner, "PjDAO: Only owner can access.");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender].role != PjRole.None, "Only members can execute this function.");
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
        require(members[_memberAddress].role == PjRole.None, "PjDAO: Member already exists");
        members[_memberAddress] = Member(_role, ActivityInfo(block.number));

        emit MemberAdded(_memberAddress, _role);
    }

    function removeMember(address _memberAddress) public onlyOwner {
        require(members[_memberAddress].role != PjRole.None, "PjDAO: Member does not exist");
        delete members[_memberAddress];

        emit MemberRemoved(_memberAddress);
    }


    function mintNft(address _targetAddress) public {
        ActivityInfo storage info = members[_targetAddress].info;
        require(block.number - info.joinedOrlastMintedBlockAt >= MINT_PERIOD, "The target member has not been enrolled for the specified period");

        // NFTの発行処理
        BadgeNFT nftContract = BadgeNFT(badgeNftContractAddress);
        nftContract.safeMint(_targetAddress, "token_uri");
        info.joinedOrlastMintedBlockAt = block.number;

        emit NFTMinted(msg.sender, _targetAddress);
    }

    function addIssue(string memory _title, string memory _description, address _creator) public onlyMember returns (uint256) {
        issueId++;
        // issues[issueId] = Issue(issueId, _title, _description, _creator, IssueStatus.ToDo, block.number, 0);
        issues[issueId].id = issueId;
        issues[issueId].title = _title;
        issues[issueId].description = _description;
        issues[issueId].creator = _creator;
        issues[issueId].status = IssueStatus.ToDo;
        issues[issueId].createdBlockAt = block.number;
        issues[issueId].closedBlockAt = 0;
        issues[issueId].likeCounts[_creator] = 0;

        emit IssueAdded(issueId, _title, _description, _creator, IssueStatus.ToDo, block.number);

        return issueId;
    }

    function addLike(uint256 _issueId, address _liker) public onlyMember returns (uint256) {
        require(issues[_issueId].id == _issueId, "Issue does not exist");

        issues[_issueId].likeCounts[_liker]++;

        emit IssueLiked(_issueId, _liker, issues[_issueId].likeCounts[_liker]);

        return issues[_issueId].likeCounts[_liker];
    }

    function changeIssueStatus(uint256 _issueId, IssueStatus _status) public onlyMember {
        require(issues[_issueId].id == _issueId, "Issue does not exist");
        require(_status == IssueStatus.ToDo || _status == IssueStatus.InProgress || _status == IssueStatus.Done || _status == IssueStatus.Pending, "Invalid status");

        issues[_issueId].status = _status;

        if (_status == IssueStatus.Done) {
            issues[_issueId].closedBlockAt = block.number;
        }

        emit IssueStatusChanged(_issueId, _status, block.number);
    }

    function getIssueList() public view returns (string[] memory, string[] memory) {
        uint256 issueCount = issueId;
        string[] memory titles = new string[](issueCount);
        string[] memory statuses = new string[](issueCount);

        for (uint256 i = 0; i < issueCount; i++) {
            titles[i] = issues[i].title;
            statuses[i] = statusToString(issues[i].status);
        }

        return (titles, statuses);
    }

    function statusToString(IssueStatus _status) internal pure returns (string memory) {
        if (_status == IssueStatus.ToDo) {
            return "ToDo";
        } else if (_status == IssueStatus.InProgress) {
            return "InProgress";
        } else if (_status == IssueStatus.Done) {
            return "Done";
        } else if (_status == IssueStatus.Pending) {
            return "Pending";
        } else {
            revert("Invalid issue status");
        }
    }

    function getIssueInfo(uint256 _id) public view returns (string memory, string memory, address, IssueStatus, uint256, uint256) {
        require(_id <= issueId, "Invalid issue ID");

        Issue storage issue = issues[_id];

        return (issue.title, issue.description, issue.creator, issue.status, issue.createdBlockAt, issue.closedBlockAt);
    }

    function getLikeCountWithinBlock(address _memberAddress, uint256 _blockCount) public view returns (uint256) {
        uint256 issueCount = issueId;
        uint256 likeCount = 0;

        for (uint256 i = 0; i < issueCount; i++) {
            if (issues[i].status == IssueStatus.Done && block.number - issues[i].closedBlockAt <= _blockCount) {
                likeCount += issues[i].likeCounts[_memberAddress];
            }
        }

        return likeCount;
    }

    function issueCount() public view returns (uint256) {
        return issueId;
    }
}