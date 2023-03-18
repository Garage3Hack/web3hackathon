import { useMemberRegistry, usePjDao, usePjDaoGetAllMembers, usePjDaoGetIssueInfo } from '@/contracts/generated';
import { BigNumber } from 'ethers';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

const IssueDetails: NextPage = () => {
    const router = useRouter();
    const provider = useProvider()
    const { pjdao_addr, issue } = router.query;

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
    // member 一覧
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
    }, [daoMemberAddrs, memberRegistryContract])
    const json = [
        { id: 1, comment: 'AAAAAAAA', issuer: 'aikei', update: '2023/3/17' },
        { id: 2, comment: 'BBBBBBBB', issuer: 'someya', update: '2023/3/17' },
        { id: 3, comment: 'CCCCCCCC', issuer: 'koizumi', update: '2023/3/17' },
    ]
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <div className="mb-3">
                            {pjdao_addr}
                            {issue}
                            {JSON.stringify(issueDetail.data)}
                            <label className="form-label">Issue Name</label>
                            <input type="text" className="form-control" id="issueName"
                                placeholder="Enter your issue." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="issueDescription"
                                placeholder="Enter a description of the issue." rows={3}></textarea>
                        </div>
                        <div>
                            <label className="form-label">Responsible</label>
                            <input type="text" className="form-control" id="issueResponsible"
                                placeholder="Enter the name of the person responsible." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <input type="text" className="form-control" id="issueStatus"
                                placeholder="Enter the status of this issue." />
                        </div>
                        <div className="row" style={{ padding: "1.5rem" }}>
                            {/* メンバー一覧 */}
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
                                                <button type="button" className="btn btn-light"><Link href={`/`}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Issuer</th>
                                    <th scope="col">Update</th>
                                    <th scope="col"></th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {json.map(comment => (
                                    <tr>
                                        <th scope="row">{comment.id}</th>
                                        <td>{comment.comment}</td>
                                        <td>{comment.issuer}</td>
                                        <td>{comment.update}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary"><i className="bi bi-eye"></i></button>
                                            <button type="button" className="btn btn-danger"><i className="bi bi-trash3"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-primary" type="button">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssueDetails