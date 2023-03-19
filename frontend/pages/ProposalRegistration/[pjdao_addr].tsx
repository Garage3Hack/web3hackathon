import useDebounce from "@/common/useDebounce";
import {
  useCoreGovernorPropose,
  usePrepareCoreGovernorPropose,
  useAdministerNft,
  coreGovernorABI,
} from "@/contracts/generated";
import { BigNumber, Signer } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useWaitForTransaction, useProvider, useSigner, useContract } from "wagmi";
import { ethers } from "ethers";

const ProposalRegistration: NextPage = () => {
  const router = useRouter();
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner()

  const { pjdao_addr } = router.query;

  const administerNftContract = useAdministerNft({
    address: process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as
      | `0x${string}`
      | undefined,
    signerOrProvider: provider,
  });

  const calldata =
    administerNftContract == undefined
      ? ""
      : administerNftContract.interface.encodeFunctionData("safeMint", [
          "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          "https://ipfs.io/ipfs/QmTbA5N1j1f22NZBHTAuZXWpYTuD3z7fcQ7ed35T3FiCQ9",
        ]);

  const [proposalDescription, setProposalDescription] = useState("");
  const debouncedProposalDescription = useDebounce(proposalDescription, 500);

  const { config } = usePrepareCoreGovernorPropose({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    args: [
      [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
      [BigNumber.from(0)],
      [calldata] as `0x${string}`[],
      proposalDescription,
    ],
  });

  const { data, write } = useCoreGovernorPropose(config);

  const generateHash = (str: string) => {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
  };

  const CoreGovernorContract = useContract({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    abi: coreGovernorABI,
    signerOrProvider: signer});

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (data) => {

      const descriptionHash = generateHash(proposalDescription);
      const proposalIdJson = await CoreGovernorContract!.hashProposal(
        [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
        [BigNumber.from(0)],
        [calldata] as `0x${string}`[],
        descriptionHash as `0x${string}`);
      const tx = await CoreGovernorContract?.addProposalIdAndDescription(proposalIdJson._hex, proposalDescription);
      await tx!.wait();
      router.push("/Management");
    }
  });

  return (
    <div>
      <Head>
        <title>Proposal Registration</title>
      </Head>
      <div className="row mb-3" style={{ padding: "1.5rem" }}>
        <div>
          <h2>Proposal Registration</h2>
          <p>Register Proposal on this page.</p>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("create proposal", write);
                write?.();
              }}
            >
              <div className="mb-3">
                <label className="form-label">Proposal Description</label>
                <textarea
                  className="form-control"
                  id="luidaoDescription"
                  placeholder="Enter a proposal description of this LuiDAO"
                  rows={3}
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Regist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalRegistration;
