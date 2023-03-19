import useDebounce from '@/common/useDebounce';
import { useMemberRegistry, usePjDao, usePjDaoAddIssue, usePjDaoAddLike, usePjDaoChangeIssueStatus, usePjDaoGetAllMembers, usePjDaoGetIssueInfo, usePreparePjDaoAddLike, usePreparePjDaoChangeIssueStatus } from '@/contracts/generated';
import { BigNumber } from 'ethers';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';

const IssueDetails: NextPage = () => {
    const account = useAccount()
    const router = useRouter();
    const provider = useProvider()
    const { pjdao_addr, issue } = router.query;

    // change status
    const status2str = (_status: number | undefined) => {
        if (_status == 0) {
            return "ToDo";
        } else if (_status == 1) {
            return "InProgress";
        } else if (_status == 2) {
            return "Done";
        } else if (_status == 3) {
            return "Pending";
        } else if (_status == 4) {
            return "Rated";
        } else {
            return 'Invalid'
        }
    }
    const status2number = (_status: string | undefined) => {
        if (_status == "ToDo") {
            return 0;
        } else if (_status == "InProgress") {
            return 1;
        } else if (_status == "Done") {
            return 2;
        } else if (_status == "Pending") {
            return 3;
        } else if (_status == "Rated") {
            return 4;
        } else {
            return -1
        }
    }
    const [issueStatus, setIssueStatus] = useState(0)
    const debouncedIssueStatus = useDebounce(issueStatus, 500)

    const changeIssueStatusConfig = usePreparePjDaoChangeIssueStatus({
        address: pjdao_addr as `0x${string}`,
        args: [BigNumber.from(issue), debouncedIssueStatus]
    })

    const changeIssueStatusTx = usePjDaoChangeIssueStatus(changeIssueStatusConfig.config)

    const pjDaoContract = usePjDao({
        address: pjdao_addr as `0x${string}`,
        signerOrProvider: provider
    })

    // issue detail取得
    const issueDetail = usePjDaoGetIssueInfo({
        address: pjdao_addr as `0x${string}`,
        args: [BigNumber.from(issue ? issue : 0)]
        }
    )
    // member 一覧 / add like
    const pjDaoMembers = usePjDaoGetAllMembers({
        address: pjdao_addr as `0x${string}`
    })

    const daoMemberAddrs = pjDaoMembers.data

    const memberRegistryContract = useMemberRegistry({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
        signerOrProvider: provider
    })

    const [members, setMembers] = useState<any[]>([])
    useEffect( () => {
        const fetchMembers = async () => {
            console.log(daoMemberAddrs)
            if (memberRegistryContract && pjDaoContract && daoMemberAddrs){
                const mems = [] as any
                for (let index = 0; index < daoMemberAddrs.length!; index++) {
                    const memberAddr = daoMemberAddrs[index];
                    const mem =  await memberRegistryContract.getMember(memberAddr)
                    const mem2 =  await pjDaoContract.members(memberAddr)
                    mems.push({
                        addr: memberAddr,
                        name: mem![0],
                        introduction: mem![1],
                        skills: mem![2],
                        role: mem2.role
                    })
                }
                console.log(mems)
                setMembers(mems)
            }
        }
        fetchMembers()
    }, [daoMemberAddrs, memberRegistryContract, pjDaoContract])

    // add like
    const [likeMember, setLikeMember] = useState<`0x${string}`>(account.address!)
    const debouncedLikeMember = useDebounce(likeMember, 500)

    const addLikeConfig = usePreparePjDaoAddLike({
        address: pjdao_addr as `0x${string}`,
        args: [BigNumber.from(issue), debouncedLikeMember]
    })

    const addLikeTx = usePjDaoAddLike(addLikeConfig.config)

    return (
        <div>
            <Head><title>Issue Details</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>Issue Details</h2>
                    <p>
                        This page manages issues within the LuiDAO. Please add your comments on the results of your review of this issue.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    <div className="col">
                        <div className="mb-3">
                            {/* {pjdao_addr}
                            {issue}
                            {JSON.stringify(issueDetail.data)} */}
                            <label className="form-label">Issue Name</label>
                            <input type="text" className="form-control" id="issueName"
                                placeholder="Enter your issue." value={issueDetail?.data?.[0]} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="issueDescription"
                                placeholder="Enter a description of the issue." rows={7} value={issueDetail?.data?.[1]} disabled ></textarea>
                        </div>
                        <div>
                            <label className="form-label">Responsible</label>
                            <input type="text" className="form-control" id="issueResponsible"
                                placeholder="Enter the name of the person responsible." value={issueDetail?.data?.[2]} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status | Current Status: {status2str(issueDetail?.data?.[3])}</label>
                            <select className="form-select" id="issueStatus" aria-label="Default select example multiple"
                                defaultValue={status2str(issueDetail?.data?.[3])}
                                onChange={(e) => { 
                                    console.log(e.target.value)
                                    setIssueStatus(status2number(e.target.value))
                                }}>
                                <option>ToDo</option>
                                <option>InProgress</option>
                                <option>Done</option>
                                <option>Pending</option>
                            </select>
                            <button type="button" className="btn btn-light" onClick={() => {
                                changeIssueStatusTx.write?.()
                            }}>Change status</button>
                        </div>
                        <div className="row" style={{ padding: "1.5rem" }}>
                            {/* メンバー一覧 */}
                        {issueDetail?.data?.[3] == 2 ? 
                        <div className="card text-dark">
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
                                                <td>{member.role}</td>
                                                <td>
                                                <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                    onClick={() => {
                                                        setLikeMember(member.addr)
                                                    }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                    </svg>
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>: null
                        }
                        </div>
                    </div>
               </div>
            </div>
            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body text-secondary">
                    Do you add like to {likeMember} ? 
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={() => {
                        addLikeTx.write?.()
                    }}>Yes</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}

export default IssueDetails