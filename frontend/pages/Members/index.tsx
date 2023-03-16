import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useMemberRegistry, useMemberRegistryGetAllMembers } from '@/contracts/generated'
import { useEffect, useState } from 'react'

interface Member {name: string, introduction: string, skills: readonly string[]};
const Members: NextPage = () => {
    const json = [
        { id: 1, name: 'Aikei', role: 'Engineer', link: '/MyProfile' },
        { id: 2, name: 'Koizumi', role: 'Engineer', link: '/MyProfile' },
        { id: 3, name: 'Ebara', role: 'Planner', link: '/MyProfile' },
    ]

    const { data, isError, isLoading } = useMemberRegistryGetAllMembers({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined
    })

    const memberRegistryContract = useMemberRegistry({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined
    })

    const [members, setMembers] = useState<Member[]>([])
    useEffect( () => {
        const fetchMembers = async () => {
            const mems = [] as Member[]
            for (let index = 0; index < data?.length!; index++) {
                const memberAddr = data![index];
                const mem = await memberRegistryContract?.getMember(memberAddr)
                members.push({
                    name: mem![0],
                    introduction: mem![1],
                    skills: mem![2],
                })
            }
            setMembers(mems)
        }
        fetchMembers()
    }, [data])



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
                                        <th scope="col">Introductions</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, index) => (
                                        <tr key={`mem-${index}`}>
                                            <th scope="row">{member.id}</th>
                                            <td>{member.name}</td>
                                            <td>{member.introduction}</td>
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