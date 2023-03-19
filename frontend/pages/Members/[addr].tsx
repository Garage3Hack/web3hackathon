import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { useBadgeNft, useBadgeNftBalanceOf, useMemberNft, useMemberNftBalanceOf, useMemberNftSafeMint, useMemberNftTokenOfOwnerByIndex, useMemberNftTokenUri, useMemberRegistryAddMember, usePrepareMemberNftSafeMint, usePrepareMemberRegistryAddMember } from '@/contracts/generated'
import { useAccount, useProvider, useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useDebounce from '@/common/useDebounce'
import { BigNumber } from 'ethers';

const MyProfile: NextPage = () => {
    const account = useAccount()
    const provider = useProvider()

    const router = useRouter();
    const {addr} = router.query
    // get a member nft
    const memberNftContract = useMemberNft({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        signerOrProvider: provider
    })
    const balanceOfResult = useMemberNftBalanceOf({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [addr! as `0x${string}`]
    })
    const memberNftTokenId = useMemberNftTokenOfOwnerByIndex({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [addr! as `0x${string}`, BigNumber.from(0)]
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
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [addr as `0x${string}`]
    })

    useEffect( () => {
        const fetchBadgeNftMeta = async () => {
            if (balanceOfBadgeResult.data && account.address && badgeNftContract){
                console.log('badge balance', balanceOfBadgeResult.data?.toNumber())
                const balanceOfBadge = balanceOfBadgeResult.data?.toNumber()
                const _badges = []
                for (let i=0; i< balanceOfBadge; i++) {
                    console.log('badge', i)
                    const badgeNftTokenId = await badgeNftContract?.tokenOfOwnerByIndex(account.address!, BigNumber.from(i))
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

    // Alert
    const [message, setMessage] = useState('')
    const [alert, setAlert] = useState(false)
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
                </div>
                <div className="col">
                    {
                        balanceOfResult && balanceOfResult.data && balanceOfResult.data.toNumber() > 0 ?
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="feature-icon d-inline-flex align-items-center justify-content-center bg-gradient fs-2 mb-3 p-2">
                                    <Image alt="{dao.name}" src={tokenInfo!.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')} width="128" height="128" className="rounded img-fluid" style={{ aspectRatio: 1 / 1 }} />
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
                                    </svg> */}
                                </div>
                                <h3 className="fs-2 text-secondary">You are member of BE creation</h3>
                            </div>
                        </div>
                        :
                        <div className="card mb-4">
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