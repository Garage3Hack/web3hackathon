import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useMemberRegistry, useMemberRegistryAddMember, useMemberRegistryGetAllMembers, usePrepareMemberRegistryAddMember } from '@/contracts/generated'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

interface Member {addr: string, name: string, introduction: string, skills: readonly string[]};
const Members: NextPage = () => {
    const provider = useProvider()
    const { data, isError, isLoading } = useMemberRegistryGetAllMembers({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined
    })

    const memberRegistryContract = useMemberRegistry({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
        signerOrProvider: provider
    })

    const [members, setMembers] = useState<Member[]>([])
    useEffect( () => {
        const fetchMembers = async () => {
            if (memberRegistryContract){
                const mems = [] as Member[]
                for (let index = 0; index < data?.length!; index++) {
                    const memberAddr = data![index];
                    const mem = await memberRegistryContract.getMember(memberAddr)
                    mems.push({
                        addr: memberAddr,
                        name: mem![0],
                        introduction: mem![1],
                        skills: mem![2],
                    })
                }
                setMembers(mems)
            }
        }
        fetchMembers()
    }, [data, memberRegistryContract])



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
                                        <th scope="col">Addr</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Introductions</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, index) => (
                                        <tr key={`mem-${index}`}>
                                            <th scope="row">{index}</th>
                                            <td>{member.addr}</td>
                                            <td>{member.name}</td>
                                            <td>{member.introduction}</td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Link href={`/Members/${member.addr}`}><Image alt="refer" src="/icons/eye.svg" width="16" height="16"/></Link></button>
                                                <button type="button" className="btn btn-light disabled"><Image alt="trash" src="/icons/trash3.svg" width="16" height="16"/></button>
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