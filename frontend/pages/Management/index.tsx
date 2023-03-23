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

  const [proposalIds, setProposalIds] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const state2str = (state: number): string => {
    switch (state) {
      case 0:
        return 'Pending';
      case 1:
        return 'Active';
      case 2:
        return 'Canceled';
      case 3:
        return 'Defeated';
      case 4:
        return 'Succeeded';
      case 5:
        return 'Queued';
      case 6:
        return 'Expired';
      case 7:
        return 'Executed';
      default:
        return 'Unknown';
    }
  };

  const CoreGovernorContract = useContract({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    abi: coreGovernorABI,
    signerOrProvider: provider,
  });

  useEffect(() => {
    const fetchState = async () => {
      const pid = [];
      const des = [];
      const stat = [];

      for (let i = 0; i < data!.length; i++) {
        const state = await CoreGovernorContract?.state(
          BigNumber.from(data![i]["proposalId"])
        );

        console.log(JSON.stringify(data![i]["proposalId"]["_hex"]));

        // console.log(data![i][0]));
        // pid.push(data![i][0]);
        pid.push(BigNumber.from(data![i]["proposalId"]).toHexString());
        des.push(data![i]["proposalDescription"]);
        stat.push(state);
      }
      setProposalIds(pid);
      setDescriptions(des);
      setStates(stat);
    };
    fetchState();
    console.log("3");
  }, [data]);


  return (
    <div>
      <Head>
        <title>Management:Proposal List</title>
      </Head>
      <div className="row mb-3" style={{ padding: "1.5rem" }}>
        <div className="card text-dark">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th>pid</th>
                  <th>description</th>
                  <th>status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {proposalIds!.map((proposalId: any, index) => (
                  <tr key={`proposal-${index}`}>
                    <td>{index}</td>
                    <td>{proposalId}</td>
                    <td>{descriptions[index]}</td>
                    <td>{state2str(states[index])}</td>
                    <td>
                      <button type="button" className="btn btn-light">
                        {/* <Link href={`/ManagementVoting/${descriptions[index]}/${proposalIds[index]}`}> */}
                        <Link href={`/ManagementVoting/${proposalIds[index]}`}>
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
    </div>
  );
};

export default Management;
