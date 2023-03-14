import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const LuiDAODetails: NextPage = () => {
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

    // 参加申請
    const Join = () => {
        alert("Join!");
    }

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
                                    {json1.map(issue => (
                                        <tr>
                                            <th scope="row">{issue.id}</th>
                                            <td>{issue.issue_name}</td>
                                            <td>{issue.responsible}</td>
                                            <td>{issue.status}</td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Link href={issue.link}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
                                                <button type="button" className="btn btn-light"><Image alt="trash" src="/icons/trash3.svg" width="16" height="16" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn btn-primary" type="button"><Link href="/IssueRegistration">Regist</Link></button>
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
                            <button className="btn btn-primary" type="button" onClick={Join}>Join</button>
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