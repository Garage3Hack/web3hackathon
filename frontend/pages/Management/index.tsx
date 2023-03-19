import useDebounce from "@/common/useDebounce";
import {
  useCoreGovernorGetProposalIdsAndDescriptions,
  coreGovernorABI,
  useCoreGovernorState,
} from "@/contracts/generated";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useContract } from "wagmi";
import { BigNumber } from "ethers";

const Management: NextPage = () => {
  const provider = useProvider();
  const { data } = useCoreGovernorGetProposalIdsAndDescriptions({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  });

  const [ proposals, setProposals ] = useState<string[]>([]);
  const [ descriptions, setDescriptions ] = useState<string[]>([]);
  const [ states, setStates ] = useState<any[]>([]);

  console.log(data![0]);
  console.log(data![1]);
  //setProposals(data![0]);
  //setDescriptions(data![1]);

  const CoreGovernorContract = useContract({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    abi: coreGovernorABI,
    signerOrProvider: provider,
  });

  useEffect(() => {
    const fetchState = async () => {
      const stat = [];
      for (let i = 0; i < data![0].length; i++) {
        const state = await CoreGovernorContract?.state(
          BigNumber.from(data![0][i])
        );
        console.log(state);
        stat.push(state);
        setStates(stat);
      }
    };
    fetchState()
    console.log("3");
  }, [data])

  /*useEffect( () => {
      const fetchProposals = async () => {
          if (CoreGovernorContract){
              const { proposal, description } = useCoreGovernorGetProposalIdsAndDescriptions({
                address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`
              });
              console.log(proposal);
              console.log(description);
              setProposals(proposal);
              setDescriptions(description);
          }
      }
      fetchProposals()
  }, [proposals, descriptions])*/

  return (
    <div>
      <Head>
        <title>Management:Proposal List</title>
      </Head>
      <div className="row mb-3" style={{ padding: "1.5rem" }}>
        <div className="accordion" id="voting-list">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">description</th>
                <th scope="col">status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Management;
