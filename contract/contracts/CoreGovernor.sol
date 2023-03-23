// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract CoreGovernor is Governor, GovernorSettings, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    string[] proposalIdHistory;
    string[] proposalDescriptionHistory;

    // 2023/3/21ここから
    struct ProposalInfo {
        uint256 proposalId;
        string proposalDescription;
        address proposalDaoAddress;
        uint256 proposedBlockAt;
    }

    ProposalInfo[] public proposalInfoHistory;

    // ここまで

    constructor(IVotes _token, TimelockController _timelock)
        Governor("CoreGovernor")
        GovernorSettings(1 /* 1 block */, 300 /* 1h */, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, IGovernor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, GovernorCompatibilityBravo, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    // 2023/3/21
    // 削除予定
    // function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    //     public
    //     override(Governor, GovernorCompatibilityBravo, IGovernor)
    //     returns (uint256)
    // {
    //     uint256 proposalId = super.propose(targets, values, calldatas, description);
    //     proposalIdHistory.push(Strings.toString(proposalId));
    //     proposalDescriptionHistory.push(description);
    //     return proposalId;
    // }

    // 2023/3/21
    function proposeWithDaoInfo(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description, address daoAddress)
        public
        returns (uint256)
    {
        uint256 proposalId = propose(targets, values, calldatas, description);

        ProposalInfo memory newProposal = ProposalInfo({
            proposalId: proposalId,
            proposalDescription: description,
            proposalDaoAddress: daoAddress,
            proposedBlockAt: block.number
        });
        proposalInfoHistory.push(newProposal);

        return proposalId;
    }

    function getProposalInfoHistory() public view returns (ProposalInfo[] memory) {
        return proposalInfoHistory;
    }

    // 削除予定
    function addProposalIdAndDescription(string memory proposalId, string memory description) public {
        proposalIdHistory.push(proposalId);
        proposalDescriptionHistory.push(description);
    }

    // 削除予定
    function getProposalIdsAndDescriptions() public view returns (string[] memory, string[] memory) {
        return (proposalIdHistory, proposalDescriptionHistory);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, IERC165, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
