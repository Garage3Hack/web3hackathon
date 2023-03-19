import useDebounce from "@/common/useDebounce";
import {
  useMemberRegistry,
  usePjDao,
  usePjDaoAddMember,
  usePjDaoGetAllMembers,
  usePjDaoGetIssueList,
  usePreparePjDaoAddMember,
} from "@/contracts/generated";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";

const ManagementVoting: NextPage = () => {
  const account = useAccount();
  const router = useRouter();
  const provider = useProvider();

  //const { pjdao_addr, proposal_id } = router.query;

  const members = [
    { id: 1, name: "Aikei", introduction: "Engineer", link: "/MyProfile" },
    { id: 2, name: "Koizumi", introduction: "Engineer", link: "/MyProfile" },
    { id: 3, name: "Ebara", introduction: "Planner", link: "/MyProfile" },
  ];
  const daos = {
    id: 1,
    name: "Test DAO",
    image:
      "https://ipfs.io/ipfs/QmNPHSQGmMxgnHB3hWg6DVgQoAkcjjKGXRXykGoYNrnHJD/0.png",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    update: "2023/3/11",
    deliverables: [
      { id: 1, document: "AAAAAAAA", link: "http://aaaa" },
      { id: 2, document: "BBBBBBBB", link: "http://aaaa" },
      { id: 3, document: "CCCCCCCC", link: "http://aaaa" },
    ],
  };
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
        <div className="card-header">GenerativeDAO</div>
          <div className="card-body">
            <h5 className="card-title">提案内容</h5>
            <p className="card-text">
              このフェーズでGenerative
              AIの市場動向調査を行い、以下のようなコンセプトでプロダクトを考案しました。
              <li>クライアントの要望からStable Diffusionを用いて画像生成</li>
              <li>
                LLMを用いてクライアント要望をクラスタリングし其々の対策を考案する
              </li>
            </p>
            <button type="button" className="btn btn-primary">Pros</button>
            <button type="button" className="btn btn-primary">Cons</button>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
            <h5 className="card-title">投票結果</h5>
            <div>Pros: <strong>12</strong>  Cons: <strong>5</strong><button type="button" className="btn btn-light ml-auto">Execute</button></div>
            </li>
          </ul>
          <div className="card-footer">
            <small className="text-muted">Remaining time: 5d</small>
          </div>
        </div>
      </div>      
      <div className="row row-cols-1 g-4" style={{ padding: "1.5rem" }}>
        <div className="card text-dark">
        <div className="card-header">Members</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Introductions</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={`mem-${index}`}>
                    <th scope="row">{index}</th>
                    <td>{member.name}</td>
                    <td>{member.introduction}</td>
                    <td>
                      <button type="button" className="btn btn-light">
                        <Link href={`/`}>
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

export default ManagementVoting;
