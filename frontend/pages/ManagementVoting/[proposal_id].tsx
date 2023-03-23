import useDebounce from "@/common/useDebounce";
import {
  useMemberRegistry,
  usePjDao,
  usePjDaoAddMember,
  usePjDaoGetAllMembers,
  usePjDaoGetIssueList,
  usePreparePjDaoAddMember,
  useCoreGovernorGetVotes,
  useCoreGovernorProposalSnapshot,
  useCoreGovernorProposals,
  useCoreGovernorCastVote,
  usePrepareCoreGovernorCastVote,
  useCoreGovernorGetProposalInfoHistory,
} from "@/contracts/generated";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { BigNumber } from "ethers";

const ManagementVoting: NextPage = () => {
  const account = useAccount();
  const router = useRouter();
  const provider = useProvider();
  const signer = useSigner();

  const { proposal_id } = router.query;
  // console.log(proposal_id);

  const [proposalId, setProposalId] = useState<any>("");
  const [proposalDescription, setProposalDescription] = useState<any>("");
  const [voteForCount, setVoteForCount] = useState<any>(0);
  const [voteAgainstCount, setVoteAgainstCount] = useState<any>(0);

  const proposal = useCoreGovernorProposals({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    args: [ BigNumber.from(proposal_id)]
  });

  const prosalInfoHistory = useCoreGovernorGetProposalInfoHistory({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  });

  const voteForConfig = usePrepareCoreGovernorCastVote({
      address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
      args: [ BigNumber.from(proposal_id), Number(1) ]
  })

  const voteAgainstConfig = usePrepareCoreGovernorCastVote({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    args: [ BigNumber.from(proposal_id), Number(0) ]
  })

  const voteFor = useCoreGovernorCastVote(voteForConfig.config)
  const voteAgainst = useCoreGovernorCastVote(voteAgainstConfig.config)

  // console.log(proposal);

  useEffect( () => {
    const fetchProposalData = async () => {
        if (proposal.data ){
            // console.log('proposal data', proposal.data);
            setProposalId(proposal.data.id.toHexString());
            setVoteForCount(proposal.data.forVotes.toNumber());
            setVoteAgainstCount(proposal.data.againstVotes.toNumber());
        }
    }
    fetchProposalData()
  }, [proposal])

  useEffect( () => { 
    const fetchProsalInfoHistory = async () => {
        if (prosalInfoHistory.data ){
            // console.log('proposal info data', prosalInfoHistory.data![0].proposalId.toHexString());

            const filteredProposal = prosalInfoHistory.data?.filter(item => item.proposalId.toHexString() === proposal_id);
            setProposalDescription(filteredProposal![0].proposalDescription);
            // console.log(proposalDescription);
        }
    }
    fetchProsalInfoHistory()
  }, [prosalInfoHistory])
  
  return (
    <div>
      <Head>
        <title>Management:Voting</title>
      </Head>
      <div className="row mb-3" style={{ padding: "1.5rem" }}>
        <div>
          <h2>Management:Voting</h2>
          <p>
            Please read the proposal submitted by the LuiDAO team and choose
            whether you agree or disagree with this proposal.
          </p>
        </div>
      </div>
      <div className="row row-cols-1 g-4" style={{ padding: "1.5rem" }}>
        <div className="card h-100 text-dark">
        <div className="card-header">Proposal ID {proposal_id}</div>
          <div className="card-body">
            <h5 className="card-title">Proposal Details</h5>
            <p className="card-text">
              {proposalDescription}
            </p>
            <button type="button" className="btn btn-primary" onClick={() => voteFor.write?.()}>賛成</button>
            <button type="button" className="btn btn-primary" onClick={() => voteAgainst.write?.()}>反対</button>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
            <h5 className="card-title">Voting Results</h5>
            <div>賛成: <strong>{voteForCount}</strong>  反対: <strong>{voteAgainstCount}</strong><button type="button" className="btn btn-light ml-auto">Execute</button></div>
            </li>
          </ul>
          <div className="card-footer">
            <small className="text-muted">Remaining time: 5d</small>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default ManagementVoting;