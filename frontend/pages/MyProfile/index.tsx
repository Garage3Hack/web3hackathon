import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { useAdministerNftDelegate, useBadgeNft, useBadgeNftBalanceOf, useMemberNft, useMemberNftBalanceOf, useMemberNftSafeMint, useMemberNftTokenOfOwnerByIndex, useMemberNftTokenUri, useMemberRegistryAddMember, usePrepareAdministerNftDelegate, usePrepareMemberNftSafeMint, usePrepareMemberRegistryAddMember, useAdministerNft, useAdministerNftBalanceOf } from '@/contracts/generated'
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
        args: [myAddr as `0x${string}`, 'https://ipfs.io/ipfs/QmX1ZaB4TUScdPFaZBUjfCiWPZ5B6iqTBCMecyS6G2QVTL']
    })
    const { data, write } = useMemberNftSafeMint(config)


    // delegate for vote
    const adminNftDeleteConfig = usePrepareAdministerNftDelegate({
        address: process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`,
        args: [account.address!]
    })

    const adminNftDeleteTx = useAdministerNftDelegate(adminNftDeleteConfig.config)

    // get a member nft
    const memberNftContract = useMemberNft({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        signerOrProvider: provider
    })
    const balanceOfResult = useMemberNftBalanceOf({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [myAddr as `0x${string}`]
    })
    const memberNftTokenId = useMemberNftTokenOfOwnerByIndex({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [myAddr as `0x${string}`, BigNumber.from(0)]
    })
    const memberNft = useMemberNftTokenUri({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [memberNftTokenId?.data!]
    })

    const [tokenInfo, setTokenInfo] = useState<any | null>(null)
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

    // get badge nfts
    const [badges, setBadges] = useState<any[]>([])
    const badgeNftContract = useBadgeNft({
        address: process.env.NEXT_PUBLIC_BADGENFT_ADDR as `0x${string}`,
        signerOrProvider: provider
    })
    const balanceOfBadgeResult = useBadgeNftBalanceOf({
        address: process.env.NEXT_PUBLIC_BADGENFT_ADDR as `0x${string}`,
        args: [myAddr as `0x${string}`]
    })

    useEffect( () => {
        const fetchBadgeNftMeta = async () => {
            if (balanceOfBadgeResult.data && account.address && badgeNftContract){
                console.log('badge balance data', balanceOfBadgeResult.data)
                console.log('badge balance', balanceOfBadgeResult.data?.toNumber())
                const balanceOfBadge = balanceOfBadgeResult.data?.toNumber()
                const _badges = []
                for (let i=0; i< balanceOfBadge; i++) {
                    console.log('badge', i)
                    let badgeNftTokenId 
                    try {
                        badgeNftTokenId = await badgeNftContract?.tokenOfOwnerByIndex(account.address!, BigNumber.from(i))
                    } catch (error) {
                        console.log(error)
                        break
                    }
                    console.log('badge tokenid', badgeNftTokenId)
                    const tokenURI = await badgeNftContract.tokenURI(badgeNftTokenId)
                    console.log('badge tokenURI', tokenURI)
                    const resp = await fetch(tokenURI)
                    const json = await resp.json()
                    _badges.push(json)
                }
                setBadges(_badges)
            }
        }
        fetchBadgeNftMeta()
    }, [account.address, badgeNftContract, balanceOfBadgeResult.data])

    
    // get administer nfts
    const [administerNfts, setAdministerNfts] = useState<any[]>([])
    const administerNftContract = useAdministerNft({
        address: process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`,
        signerOrProvider: provider
    })
    const balanceOfAdministerResult = useAdministerNftBalanceOf({
        address: process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`,
        args: [myAddr as `0x${string}`]
    })

    useEffect( () => {
        const fetchAdministerNftMeta = async () => {
            if (balanceOfAdministerResult.data && account.address && administerNftContract){
                console.log('administer balance data', balanceOfAdministerResult.data)
                console.log('administer balance', balanceOfAdministerResult.data?.toNumber())
                const balanceOfAdminister = balanceOfAdministerResult.data?.toNumber()
                const _administers = []
                for (let i=0; i< balanceOfAdminister; i++) {
                    console.log('administer', i)
                    let administerNftTokenId 
                    try {
                        administerNftTokenId = await administerNftContract?.tokenOfOwnerByIndex(account.address!, BigNumber.from(i))
                    } catch (error) {
                        console.log(error)
                        break
                    }
                    console.log('administer tokenid', administerNftTokenId)
                    const tokenURI = await administerNftContract.tokenURI(administerNftTokenId)
                    console.log('administer tokenURI', tokenURI)
                    const resp = await fetch(tokenURI)
                    const json = await resp.json()
                    _administers.push(json)
                }
                setAdministerNfts(_administers)
            }
        }
        fetchAdministerNftMeta()
    }, [account.address, administerNftContract, balanceOfAdministerResult.data])

    // Registration
    const beAMember = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("be a member", write)
        write?.()
        addMember.write?.()
        adminNftDeleteTx.write?.()
        setLoading(true)
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
            setLoading(false)
        }
      })

    // Alert
    const [message, setMessage] = useState('')
    const [alert, setAlert] = useState(false)

    // loading
    const [loading, setLoading] = useState(false)

    return (
        <div>
            <div className="row mb-0" style={{ padding: "1.5rem" }}>
                { alert ?
                    <div className="alert alert-success alert-dismissible" role="alert">
                       <div>{message}</div>
                       <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={()=>{setAlert(false)}}></button>
                    </div>
                    : <div></div>
                }
                <div>
                    <h2>My Profile</h2>
                    {
                        loading ?
                            <div>
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                <span className='m-3 fs-3 text-primary'>Transaction processing....</span>
                            </div>
                        : null
                    }
                </div>
                <div className="col">
                    {
                        balanceOfResult && balanceOfResult.data && balanceOfResult.data.toNumber() > 0 ?
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="feature-icon d-inline-flex align-items-center justify-content-center bg-gradient fs-2 mb-3 p-2">
                                    <Image alt="BE creation member" src={tokenInfo && tokenInfo.image ? tokenInfo.image : ''} width="128" height="128" className="rounded img-fluid" style={{ aspectRatio: 1 / 1 }} />
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
                                    </svg> */}
                                </div>
                                <h3 className="fs-2 text-secondary">You are member of BE creation</h3>
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
            {/* <div className="row mb-3" style={{ padding: "1.5rem" }}> */}
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div className="col">
                    <h2>Your Badges</h2>
                    <ul className="row row-cols-3  g-4 py-5">
                        {badges?.map((badge, index)=> (
                                <div key={`badge-${index}`} className="col">
                                    <div className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style={{backgroundImage: `url('${badge.image}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                      <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                                        <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{badge.name}</h3>
                                        <ul className="d-flex list-unstyled mt-auto">
                                          <li className="me-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-award" viewBox="0 0 16 16">
                                              <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                                              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                                            </svg>
                                          </li>
                                          <li className="d-flex align-items-center me-3">
                                            <small>{badge.description}</small>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                </div>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div className="col">
                    <h2>Your Administer NFTs</h2>
                    <ul className="row row-cols-3  g-4 py-5">
                        {administerNfts?.map((administerNft, index)=> (
                                <div key={`administerNft-${index}`} className="col">
                                    <div className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style={{backgroundImage: `url('${administerNft.image}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                      <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                                        <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{administerNft.name}</h3>
                                        <ul className="d-flex list-unstyled mt-auto">
                                          <li className="me-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-award" viewBox="0 0 16 16">
                                              <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                                              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                                            </svg>
                                          </li>
                                          <li className="d-flex align-items-center me-3">
                                            <small>{administerNft.description}</small>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                </div>
                        ))}
                    </ul>
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