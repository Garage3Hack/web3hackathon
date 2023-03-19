import useDebounce from "@/common/useDebounce";
import {
  useMemberRegistry,
  usePjDao,
  usePjDaoAddMember,
  usePjDaoGetAllMembers,
  usePjDaoGetIssueList,
  usePreparePjDaoAddMember,
  useCoreGovernorProposals,
} from "@/contracts/generated";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";

const Management: NextPage = () => {
  const router = useRouter();
  const provider = useProvider();
  const { proposals, isError, isLoading } = useCoreGovernorProposals({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as
      | `0x${string}`
      | undefined,
  });

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
              {proposals.data ? (
                proposals.data[0].map((proposal, index) => (
                  <tr key={`proposal-${index}`}>
                    <th scope="row">{index}</th>
                    <td>{proposal.data![0][index]}</td>
                    <td>{proposal.data![1][index]}</td>
                    <td>{proposal.data![2][index]}</td>
                    <td>
                      <button type="button" className="btn btn-light">
                        <Link href={`/ManagementVoting/${proposal.data![0][index]}`}>
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
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Management;
