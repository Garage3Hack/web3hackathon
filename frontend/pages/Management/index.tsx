import useDebounce from "@/common/useDebounce";
import {
  useCoreGovernorGetProposalIdsAndDescriptions,
  useCoreGovernorGetProposalInfoHistory,
  coreGovernorABI,
  useCoreGovernorState,
} from "@/contracts/generated";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProvider, useContract } from "wagmi";
import { BigNumber } from "ethers";

const Management: NextPage = () => {
  const provider = useProvider();
  // const { data, isError, isLoading } = useCoreGovernorGetProposalIdsAndDescriptions({
  //   address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  // });

  const { data, isError, isLoading } = useCoreGovernorGetProposalInfoHistory({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  });

  console.log(data);

  const [proposals, setProposals] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const CoreGovernorContract = useContract({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    abi: coreGovernorABI,
    signerOrProvider: provider,
  });

  // useEffect(() => {
  //   const fetchState = async () => {
  //     const pid = [];
  //     const des = [];
  //     const stat = [];
  //     for (let i = 0; i < data![0].length; i++) {
  //       const state = await CoreGovernorContract?.state(
  //         BigNumber.from(data![0][i])
  //       );
  //       console.log(state);
  //       console.log(data![0][i])
  //       pid.push(data![0][i]);
  //       des.push(data![1][i]);
  //       stat.push(state);
  //     }
  //     setProposals(pid);
  //     setDescriptions(des);
  //     setStates(stat);
  //   };
  //   fetchState();
  //   console.log("3");
  // }, [data]);

  console.log(JSON.stringify(proposals));

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
              {data!.map((proposal:any, index) => (
                <tr key={`proposal-${index}`}>
                  <td>{index}</td>
                  <td>{proposal[1]}</td>
                  <td>{states[index]}</td>
                  <td>
                    <button type="button" className="btn btn-light">
                      <Link href={`/ManagementVoting/${proposal[1]}/${proposal[0]}`}>
                        <Image
                          alt="refer"
                          src="/icons/eye.svg"
                          width="16"
                          height="16"
                        />
                      </Link>
                    </button>
                  </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Management;
