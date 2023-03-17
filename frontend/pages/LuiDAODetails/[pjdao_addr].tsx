import useDebounce from '@/common/useDebounce'
import { usePjDaoAddMember, usePjDaoGetIssueList, usePreparePjDaoAddMember } from '@/contracts/generated'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const LuiDAODetails: NextPage = () => {
    const router = useRouter();
    const { pjdao_addr } = router.query;
    const issues = usePjDaoGetIssueList({
        address: pjdao_addr as `0x${string}`
    })

    const [memberAddr, setMemberAddr] = useState<`0x${string}`>('0x0')
    const debouncedMemberAddr = useDebounce(memberAddr, 500)

    const {config} = usePreparePjDaoAddMember({
        address: pjdao_addr as `0x${string}`,
        args: [debouncedMemberAddr, 0]
    })

    const {data, write} = usePjDaoAddMember(config)

    // パスパラメータから値を取得
    // Issueテストデータ
    const json1 = [
        { id: 1, issue_name: 'AAAAAAAA', responsible: 'Aikei', status: 'In Progress', link: '/IssueDetails'},
        { id: 2, issue_name: 'BBBBBBBB', responsible: 'Koizumi', status: 'Done', link: '/IssueDetails'},
        { id: 3, issue_name: 'CCCCCCCC', responsible: 'Someya', status: 'Done', link: '/IssueDetails' },
    ]
    // memberテストデータ
    const json2 = [
        { id: 1, name: 'Aikei', role: 'Engineer', link: '/MyProfile' },
        { id: 2, name: 'Koizumi', role: 'Engineer', link: '/MyProfile' },
        { id: 3, name: 'Ebara', role: 'Planner', link: '/MyProfile' },
    ]
    // 成果物テストデータ
    const json3 = [
        { id: 1, document: 'AAAAAAAA', link: 'http://aaaa' },
        { id: 2, document: 'BBBBBBBB', link: 'http://aaaa' },
        { id: 3, document: 'CCCCCCCC', link: 'http://aaaa' },
    ]
    // 成果物追加
    const Add = () => {
        alert("Add!");
    }

    // 提出
    const HandIn = () => {
        alert("HandIn!");
    }

    return (
        <div>
            <Head><title>LuiDAO Details</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>LuiDAO Details</h2>
                    <p>
                        This page is for managing issues, members, and deliverables in LuiDAO.
                    </p>
                </div>
                <div className=" row"style={{ padding: "1.5rem" }}>
                    <div className="card text-dark">
                        <div className="card-header">Issues</div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Issue Name</th>
                                        <th scope="col">Responsible</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { issues.data ? issues.data[0].map((issue, index) => (
                                        <tr key={`issue-${index}`}>
                                            <th scope="row">{index}</th>
                                            <td>{issues.data![0][index]}</td>
                                            <td>{`-`}</td>
                                            <td>{issues.data![1][index]}</td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Link href={""}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
                                                <button type="button" className="btn btn-light"><Image alt="trash" src="/icons/trash3.svg" width="16" height="16" /></button>
                                            </td>
                                        </tr>
                                    )) : <></> }
                                </tbody>
                            </table>
                            <button className="btn btn-primary" type="button"><Link href={`/IssueRegistration/${pjdao_addr}`}>Regist</Link></button>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ padding: "1.5rem" }}>
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
                                    {json2.map(member => (
                                        <tr>
                                            <th scope="row">{member.id}</th>
                                            <td>{member.name}</td>
                                            <td>{member.role}</td>
                                            <td>
                                            <button type="button" className="btn btn-light"><Link href={member.link}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                console.log("create pj dao", write)
                                write?.()
                            }}>
                                <div className="mb-3">
                                    <label className="form-label">Member addr</label>
                                    <input type="text" className="form-control" id="memberAddr"
                                        placeholder="Enter member address to invite this pj DAO"
                                        value={memberAddr} onChange={(e) => {setMemberAddr(e.target.value)}} />
                                </div>
                                <button className="btn btn-primary" type="submit">Add</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ padding: "1.5rem" }}>
                    <div className="card text-dark">
                        <div className="card-header">Deliverables</div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Document Name</th>
                                        <th scope="col">Link</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {json3.map(doc => (
                                        <tr>
                                            <th scope="row">{doc.id}</th>
                                            <td>{doc.document}</td>
                                            <td><Link href={doc.link}>{doc.link}</Link></td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Image alt="trash" src="/icons/trash3.svg" width="16" height="16" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn btn-primary" type="button" onClick={Add}>Add</button>
                            <button className="btn btn-primary" type="button" onClick={HandIn}>Hand in</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LuiDAODetails