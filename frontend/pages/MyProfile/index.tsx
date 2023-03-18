import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { useMemberNft, useMemberNftBalanceOf, useMemberNftSafeMint, useMemberNftTokenOfOwnerByIndex, useMemberNftTokenUri, useMemberRegistryAddMember, usePrepareMemberNftSafeMint, usePrepareMemberRegistryAddMember } from '@/contracts/generated'
import { useAccount, useProvider, useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'
import useDebounce from '@/common/useDebounce'
import { BigNumber } from 'ethers';

const MyProfile: NextPage = () => {
    const account = useAccount()
    const provider = useProvider()
    const myAddr = account.address as string
    const {config} = usePrepareMemberNftSafeMint({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [myAddr, 'https://ipfs.io/ipfs/QmZ9QkhHKTPjtpNf23XSJYN7JBRNUTX5ST2zZf9marTZoQ/26.json']
    })
    const { data, write } = useMemberNftSafeMint(config)


    // get a member nft
    const memberNftContract = useMemberNft({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        signerOrProvider: provider
    })
    const balanceOfResult = useMemberNftBalanceOf({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [myAddr]
    })

    // useEffect( () => {
    //     const fetchNftMeta = async () => {
    //         console.log('balance', balanceOfResult?.data?.toNumber())
    //         const memberNftTokenId = memberNftContract?.tokenOfOwnerByIndex(account.address, BigNumber.from(0))
    //         console.log('tokenid', memberNftTokenId)
    //     }
    //     fetchNftMeta()
    // }, [account.address, balanceOfResult?.data, memberNftContract])

    const memberNftTokenId = useMemberNftTokenOfOwnerByIndex({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [myAddr, 0]
    })
    const memberNft = useMemberNftTokenUri({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [memberNftTokenId?.data!]
    })

    const [tokenInfo, setTokenInfo] = useState(null)
    const tokenURI = memberNft.data!
    useEffect(()=>{
        const fetchTokenURI = async () => {
            const resp = await fetch(tokenURI)
            console.log(memberNft.data!, resp)
            const json = await resp.json()
            setTokenInfo(json)
        }
        fetchTokenURI()
    }, [tokenURI])

    // Registration
    const beAMember = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("be a member", write)
        write?.()
        addMember.write?.()
    }

    const [username, setUsername] = useState('')
    const debouncedUsername = useDebounce(username, 500)

    const [introduction, setIntroduction] = useState('')
    const debouncedIntroduction = useDebounce(introduction, 500)

    const [skills, setSkills] = useState<string[]>([])
    const debouncedSkills = useDebounce(skills, 500)

    const handleMultipleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const listOfOptions = Array.from(e.target.selectedOptions, option => option.value);
        console.log(listOfOptions)
        setSkills(listOfOptions)
    }

    const memRegist = usePrepareMemberRegistryAddMember({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
        args: [debouncedUsername, debouncedIntroduction, debouncedSkills]
    })

    const addMember = useMemberRegistryAddMember(memRegist.config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: (data) => {
            setAlert(true)
            setMessage('Welcome BE CREATION!!')
        }
      })

    // Alert
    const [message, setMessage] = useState('')
    const [alert, setAlert] = useState(false)
    return (
        <div>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                { alert ?
                    <div className="alert alert-success alert-dismissible" role="alert">
                       <div>{message}</div>
                       <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={()=>{setAlert(false)}}></button>
                    </div>
                    : <div></div>
                }
                <div>
                    <h2>My Profile</h2>
                </div>
                <div className="col">
                    {
                        balanceOfResult?.data?.toNumber() > 0 ?
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-success bg-gradient fs-2 mb-3 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
                                    </svg>
                                </div>
                                <h3 className="fs-2 text-secondary">You're member of BE CREATION</h3>
                                <p>{JSON.stringify(tokenInfo)}</p>
                            </div>
                        </div>
                        :
                        <div className="card mb-4">
                            <div className="card-header text-primary fw-bold">Registration</div>
                            <div className="card-body">
                                <form onSubmit={beAMember}>
                                    <div className="mb-2">
                                        <label className="small mb-1 text-secondary">Name</label>
                                        <input className="form-control" id="inputUsername" type="text" placeholder="Enter your name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small mb-1 text-secondary">Introduction</label>
                                        <textarea className="form-control" id="inputBio"
                                            placeholder="Enter your biography" rows={3}
                                            value={introduction}
                                            onChange={(e) => setIntroduction(e.target.value)} ></textarea>
                                    </div>
                                    <div className="mb-5">
                                        <label className="form-label small mb-1 text-secondary">Skills (You can select multiple options)</label>
                                        <select className="form-select" multiple aria-label="Default select example multiple"
                                            onChange={handleMultipleSelect}>
                                            <option selected>Engineering</option>
                                            <option>Planning</option>
                                            <option>Design</option>
                                            <option>DataScience</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-primary" type="submit" >Be a member</button>
                                </form>
                            </div>
                        </div>
                    }
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