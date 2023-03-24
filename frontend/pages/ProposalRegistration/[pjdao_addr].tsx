import useDebounce from "@/common/useDebounce";
import {
  usePjDaoGetAllMembers,
  usePrepareCoreGovernorProposeWithDaoInfo,
  useCoreGovernorProposeWithDaoInfo,
  useMemberRegistryGetAllMembers,
  useMemberRegistry,
  useAdministerNft,
  usePjDao,
  usePjDaoName,
  pjDaoABI,
} from "@/contracts/generated";
import { role2str } from "@/utils/util";
import { BigNumber, Signer } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWaitForTransaction, useProvider, useContract, useSigner } from "wagmi";
//import { ethers } from "ethers";

const ProposalRegistration: NextPage = () => {
  const router = useRouter();
  const provider = useProvider();
  //const { data: signer, isError, isLoading } = useSigner()

  const { pjdao_addr } = router.query;

  const administerNftContract = useAdministerNft({
    address: process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as
      | `0x${string}`
      | undefined,
    signerOrProvider: provider,
  });

  // member 一覧
  const pjDaoMembers = usePjDaoGetAllMembers({
    address: pjdao_addr as `0x${string}`
  })

  // Dao名前取得
  const pjDaoName = usePjDaoName({
    address: pjdao_addr as `0x${string}`
  })

  // member詳細取得
  const pjDaoContract = usePjDao({
    address: pjdao_addr as `0x${string}`,
    signerOrProvider: provider
  })

  const daoMemberAddrs = pjDaoMembers.data
  const daoName = pjDaoName.data;

  const memberRegistryContract = useMemberRegistry({
    address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
    signerOrProvider: provider
  })

  // メンバアドレスからMember情報を取得
  const [members, setMembers] = useState<any[]>([])
  useEffect( () => {
      const fetchMembers = async () => {
          if (memberRegistryContract && pjDaoContract && daoMemberAddrs){
              const mems = [] as any
              for (let index = 0; index < daoMemberAddrs?.length!; index++) {
                  const memberAddr = daoMemberAddrs![index];
                  const mem = await memberRegistryContract.getMember(memberAddr)
                  const mem2 =  await pjDaoContract.members(memberAddr)
                  mems.push({
                    addr: memberAddr,
                    name: mem![0],
                    introduction: mem![1],
                    skills: mem![2],
                    role: mem2.role
                  })
              }
              setMembers(mems)
          }
      }
      fetchMembers()
    }, [daoMemberAddrs, memberRegistryContract])

    // proposalが承認された際に指定したアドレスに送付するトランザクションを作成
    const calldata =
    administerNftContract == undefined
      ? ""
      : administerNftContract.interface.encodeFunctionData("safeBatchMint", [
          daoMemberAddrs,
          "https://ipfs.io/ipfs/QmTbA5N1j1f22NZBHTAuZXWpYTuD3z7fcQ7ed35T3FiCQ9",
        ]);

  const [proposalDescription, setProposalDescription] = useState("");
  const debouncedProposalDescription = useDebounce(proposalDescription, 500);

  // const { config } = usePrepareCoreGovernorPropose({
  //   address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  //   args: [
  //     [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
  //     [BigNumber.from(0)],
  //     [calldata] as `0x${string}`[],
  //     proposalDescription,
  //   ],
  // });

  // const { data, write } = useCoreGovernorPropose(config);

  // const generateHash = (str: string) => {
  //   return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
  // };

  // const CoreGovernorContract = useContract({
  //   address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  //   abi: coreGovernorABI,
  //   signerOrProvider: signer});

  // useWaitForTransaction({
  //   hash: data?.hash,
  //   onSuccess: async (data) => {

  //     const descriptionHash = generateHash(proposalDescription);
  //     const proposalIdJson = await CoreGovernorContract!.hashProposal(
  //       [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
  //       [BigNumber.from(0)],
  //       [calldata] as `0x${string}`[],
  //       descriptionHash as `0x${string}`);
  //     const tx = await CoreGovernorContract?.addProposalIdAndDescription(proposalIdJson._hex, proposalDescription);
  //     await tx!.wait();
  //     router.push("/Management");
  //   }
  // });

  // 2023/3/21
  const { config } = usePrepareCoreGovernorProposeWithDaoInfo({
    address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
    args: [
      [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
      [BigNumber.from(0)],
      [calldata] as `0x${string}`[],
      proposalDescription,
      pjdao_addr as `0x${string}`
    ],
  });

  const { data, write } = useCoreGovernorProposeWithDaoInfo(config);

  // const generateHash = (str: string) => {
  //   return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
  // };

  // const CoreGovernorContract = useContract({
  //   address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR as `0x${string}`,
  //   abi: coreGovernorABI,
  //   signerOrProvider: signer});

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {

      console.log("ProposalRegistration useWaitForTransaction " , data);
      setLoading(false)

      // const descriptionHash = generateHash(proposalDescription);
      // const proposalIdJson = await CoreGovernorContract!.hashProposal(
      //   [process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`],
      //   [BigNumber.from(0)],
      //   [calldata] as `0x${string}`[],
      //   descriptionHash as `0x${string}`);
      // const tx = await CoreGovernorContract?.addProposalIdAndDescription(proposalIdJson._hex, proposalDescription);
      // await tx!.wait();
      router.push("/Management");
    }
  });

  // loading
  const [loading, setLoading] = useState(false)

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
        {
            loading ?
                <div>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className='m-3 fs-3 text-primary'>Transaction processing....</span>
                </div>
            : null
        }
        <div className="row mb-3" style={{ padding: "1.5rem" }}>
          <div className="card text-dark">
          <div className="card-header">{daoName}</div>
            <div className="card-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("create proposal", write);
                setLoading(true)
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
        <div className="row mb-3" style={{ padding: "1.5rem" }}>
          <div className="card mb-4">
            <div className="card-header">Members</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                  <tr key={`mem-${index}`}>
                    <th scope="row">{index}</th>
                    <td>{member.name}</td>
                    <td>{role2str(member.role)}</td>
                    <td>
                      <button type="button" className="btn btn-light"><Link href={`/Members/${member.addr}`}><Image alt="refer" src="/icons/eye.svg" width="16" height="16"/></Link></button>
                    </td>
                  </tr>
                  ))}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalRegistration;
