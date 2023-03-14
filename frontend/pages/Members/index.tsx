import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Members: NextPage = () => {
    const json = [
        { id: 1, name: 'Aikei', role: 'Engineer', link: '/MyProfile' },
        { id: 2, name: 'Koizumi', role: 'Engineer', link: '/MyProfile' },
        { id: 3, name: 'Ebara', role: 'Planner', link: '/MyProfile' },
    ]
    return (
        <div>
            <Head><title>Members</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>member List</h2>
                    <p>
                        This page manages the members.
                    </p>
                </div>
                <div className="row">
                    <div className="card text-dark">
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
                                    {json.map(member => (
                                        <tr>
                                            <th scope="row">{member.id}</th>
                                            <td>{member.name}</td>
                                            <td>{member.role}</td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Link href={member.link}><Image alt="refer" src="/icons/eye.svg" width="16" height="16"/></Link></button>
                                                <button type="button" className="btn btn-light"><Image alt="trash" src="/icons/trash3.svg" width="16" height="16"/></button>
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
    )
}

export default Members