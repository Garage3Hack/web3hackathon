import useDebounce from '@/common/useDebounce'
import { useMemberRegistry, usePjDao, usePjDaoAddMember, usePjDaoGetAllMembers, usePjDaoGetIssueList, usePjDaoGetRecentMvpAddress, usePjDaoMintMvpNft, usePjDaoMintNft, usePreparePjDaoAddMember, usePreparePjDaoMintMvpNft, usePreparePjDaoMintNft } from '@/contracts/generated'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useProvider } from 'wagmi'


const LuiDAODetails: NextPage = () => {
    const account = useAccount()
    const router = useRouter();
    const provider = useProvider()
    const { pjdao_addr } = router.query;

    const role2str = (rolenum: number) => {
        if (rolenum == 1) {
            return 'PRODUCTMANAGER'
        }
        if (rolenum == 2) {
            return 'PROJECTMANAGER'
        }
        if (rolenum == 3) {
            return 'DEVELOPER'
        }
        if (rolenum == 4) {
            return 'DESIGNER'
        }
        if (rolenum == 5) {
            return 'MARKETER'
        }
        if (rolenum == 6) {
            return 'QAENGINEER'
        }
        return 'NONE'
    }

    // common use
    const memberRegistryContract = useMemberRegistry({
        address: process.env.NEXT_PUBLIC_MEMBERREGISTRY_ADDR as `0x${string}` | undefined,
        signerOrProvider: provider
    })

    const pjDaoContract = usePjDao({
        address: pjdao_addr as `0x${string}`,
        signerOrProvider: provider
    })

    // MVP Nft
    // -- mint
    const mintMvpNftConfig = usePreparePjDaoMintMvpNft({
        address: pjdao_addr as `0x${string}`,
    })

    const mintMvpNftTx = usePjDaoMintMvpNft(mintMvpNftConfig.config)
    // notice mvp
    const recentMvpAddr = usePjDaoGetRecentMvpAddress({
        address: pjdao_addr as `0x${string}`,
    })
    const [recentMvp, setRecentMvp] = useState<any | null>(null)

    useEffect( () => {
        console.log('eff2')
        const fetchMvp = async () => {
            if(recentMvpAddr.data && memberRegistryContract && pjDaoContract) {
                const memberAddr = recentMvpAddr.data
                const mem =  await memberRegistryContract.getMember(memberAddr)
                const mem2 =  await pjDaoContract.members(memberAddr)
                setRecentMvp({
                    name: mem![0],
                    introduction: mem![1],
                    skills: mem![2],
                    role: mem2.role
                })
            }
        }
        fetchMvp()
    }, [recentMvpAddr.data, memberRegistryContract, pjDaoContract])

    // Badge NFT to member
    const [memberNftAddr, setMemberNftAddr] = useState<`0x${string}`>(account.address!)
    const debouncedMemberNftAddr = useDebounce(memberNftAddr, 500)

    const [memberNftRole, setMemberNftRole] = useState<number>(0)
    const debouncedMemberNftRole = useDebounce(memberNftRole, 500)
    const mintNftConfig = usePreparePjDaoMintNft({
        address: pjdao_addr as `0x${string}`,
        args: [debouncedMemberNftAddr, debouncedMemberNftRole]
    })

    const mintNftTx = usePjDaoMintNft(mintNftConfig.config)

    // Issue List
    const issues = usePjDaoGetIssueList({
        address: pjdao_addr as `0x${string}`
    })

    const [memberAddr, setMemberAddr] = useState<`0x${string}`>('0x0')
    const debouncedMemberAddr = useDebounce(memberAddr, 500)

    const [memberRole, setMemberRole] = useState<number>(0)
    const debouncedMemberRole = useDebounce(memberRole, 500)

    // Add member
    const {config} = usePreparePjDaoAddMember({
        address: pjdao_addr as `0x${string}`,
        args: [debouncedMemberAddr, debouncedMemberRole]
    })

    const {data, write} = usePjDaoAddMember(config)


    // member 一覧
    const pjDaoMembers = usePjDaoGetAllMembers({
        address: pjdao_addr as `0x${string}`
    })

    const daoMemberAddrs = pjDaoMembers.data

    const [members, setMembers] = useState<any[]>([])
    useEffect( () => {
        console.log('eff1')
        const fetchMembers = async () => {
            console.log(daoMemberAddrs)
            if (memberRegistryContract && pjDaoContract && daoMemberAddrs){
                const mems = [] as any
                for (let index = 0; index < daoMemberAddrs.length!; index++) {
                    const memberAddr = daoMemberAddrs[index];
                    const mem =  await memberRegistryContract.getMember(memberAddr)
                    const mem2 =  await pjDaoContract.members(memberAddr)
                    mems.push({
                        addr: memberAddr,
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
    }, [daoMemberAddrs, memberRegistryContract, pjDaoContract])

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
                        <div className="card-header">Current MVP</div>
                        <div className="card-body">
                            {recentMvp ?
                                <div className='d-flex gap-3 pt-0 pb-3'>
                                    <div className="d-inline-flex align-items-center justify-content-center">
                                        <Image alt="{dao.name}" src="/images/mvp.png" width="96" height="96" className="rounded img-fluid" style={{ aspectRatio: 1 / 1 }} />
                                    </div>
                                    <div>
                                        <h3 className="fs-2 text-secondary pt-3 mb-0">{recentMvp.name}</h3>
                                        <p className='text-secondary fs-5 mb-0'>{recentMvp.introduction}</p>
                                        <p className='text-secondary fs-6'>Skills: {recentMvp.skills.join(', ')}</p>
                                    </div>
                                </div>
                                :
                                <div></div>
                            }
                            <button type="button" className="btn btn-primary" onClick={() => {mintMvpNftTx.write?.()}}>Mint MVP Nft</button>
                        </div>
                    </div>
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
                                                <button type="button" className="btn btn-light"><Link href={`/IssueDetails/${pjdao_addr}/${index}`}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
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
                                    {members.map((member, index) => (
                                        <tr key={`mem-${index}`}>
                                            <th scope="row">{index}</th>
                                            <td>{member.name}</td>
                                            <td>{role2str(member.role)}</td>
                                            <td>
                                                <button type="button" className="btn btn-light"><Link href={`/`}><Image alt="refer" src="/icons/eye.svg" width="16" height="16" /></Link></button>
                                                <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#mintNftModal"
                                                    onClick={() => {
                                                        setMemberNftAddr(member.addr)
                                                        setMemberNftRole(member.role)
                                                    }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-award" viewBox="0 0 16 16">
                                                      <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                                                      <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                                                    </svg>
                                                </button>
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
                                        value={memberAddr} onChange={(e) => {setMemberAddr(e.target.value as `0x${string}`)}} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select className="form-select" id="memberRole" aria-label="Default select example "
                                        onChange={(e) => { 
                                            console.log(e.target.value)
                                            setMemberRole(Number(e.target.value))
                                        }}>
                                        <option value={1}>PRODUCTMANAGER</option>
                                        <option value={2}>PROJECTMANAGER</option>
                                        <option value={3}>DEVELOPER</option>
                                        <option value={4}>DESIGNER</option>
                                        <option value={5}>MARKETER</option>
                                        <option value={6}>QAENGINEER</option>
                                    </select>
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
                                        // eslint-disable-next-line react/jsx-key
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
            {/* <!-- Modal --> */}
            <div className="modal fade" id="mintNftModal" tabIndex={-1} aria-labelledby="mintNftModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="mintNftModalLabel">Modal title</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body text-secondary">
                    Do you mint NFT to {memberNftAddr} with {role2str(memberNftRole)}? 
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={() => {
                        console.log(mintNftTx)
                        if (mintNftTx.write){
                            mintNftTx.write()
                        } else {
                            alert('You can not mint nft.')
                        }
                    }}>Yes</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}

export default LuiDAODetails