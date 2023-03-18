import type { NextPage } from 'next'
import Head from 'next/head'
import { useMemberNftBalanceOf, useMemberNftSafeMint, useMemberRegistryAddMember, usePrepareMemberNftSafeMint, usePrepareMemberRegistryAddMember } from '@/contracts/generated'
import { useAccount, useWaitForTransaction } from 'wagmi'

const MyProfile: NextPage = () => {
    const account = useAccount()
    const {config} = usePrepareMemberNftSafeMint({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [account.address as string, 'https://ipfs.io/ipfs/QmZ9QkhHKTPjtpNf23XSJYN7JBRNUTX5ST2zZf9marTZoQ/26.json']
    })
    const { data, write } = useMemberNftSafeMint(config)

    const balanceOfResult = useMemberNftBalanceOf({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [account.address as string]
    })
    
    const beAMember = () => {
        console.log("be a member", write)
        write?.()
        addMember.write?.()
    }
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      })

    const memRegist = usePrepareMemberRegistryAddMember({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
        args: [account.address as string, 'hello!', []]
    })

    const addMember = useMemberRegistryAddMember(memRegist.config)

    return (
        <div>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>My Profile: {data?.hash} {isLoading === true ? 'loading' : ''} {isSuccess === true ? 'success' : 'noop'}</h2>
                    <button className="btn btn-primary" type="button" onClick={beAMember}>Be Create</button>
                </div>
                <div>
                    balance of {balanceOfResult?.data?.toString()}
                </div>
                <div className="col">
                    <div className="card mb-4">
                        <div className="card-header">Basic</div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="small mb-1">Name</label>
                                    <input className="form-control" id="inputUsername" type="text" placeholder="Enter your name"
                                        value="username" />
                                </div>
                                <div className="mb-3">
                                    <label className="small mb-1">Role</label>
                                    <select className="form-select" aria-label="Default select example">
                                        <option selected>Engineer</option>
                                        <option value="1">Planner</option>
                                        <option value="2">Designer</option>
                                        <option value="3">Data scientist</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" id="inputBio"
                                        placeholder="Enter your biography" rows={3}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Skills</label>
                                    <textarea className="form-control" id="inputSkills"
                                        placeholder="Enter your skills" rows={3}></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div className="col">
                    <div className="card mb-4">
                        <div className="card-header">Participating LuiDAOs</div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">LuiDAO Name</th>
                                        <th scope="col">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Supply Chain Platform</td>
                                        <td>...</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>NFT Project</td>
                                        <td>...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-1" style={{ padding: "1.5rem" }}>
                <div className="col">
                    <div className="card mb-4">
                        <div className="card-header">Trophies</div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Trophy</th>
                                        <th scope="col">from which LuiDAO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Senior Project Manager</td>
                                        <td>Supply Chain Platform</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Web Application developer</td>
                                        <td>NFT Project</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile