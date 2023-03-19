import type { NextPage } from 'next'
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link'
import { useMemberNftBalanceOf, usePjDaoFactoryGetAllPjDaOs } from "@/contracts/generated";
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

const LuiDAOs: NextPage = () => {
    const account = useAccount()
    const router = useRouter()
    const { data, isError, isLoading } = usePjDaoFactoryGetAllPjDaOs({
        address: process.env.NEXT_PUBLIC_PJDAOFACTORY_ADDR as `0x${string}` | undefined
    })
    const balanceOfResult = useMemberNftBalanceOf({
        address: process.env.NEXT_PUBLIC_MEMBERNFT_ADDR as `0x${string}`,
        args: [account.address!]
    })
    const json = [
        { id: 1, name: 'Test DAO', image: 'https://ipfs.io/ipfs/QmNPHSQGmMxgnHB3hWg6DVgQoAkcjjKGXRXykGoYNrnHJD/0.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
        { id: 2, name: 'Canvas DAO', image: '/images/00087-2503621524.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
        { id: 3, name: 'Supply DAO', image: '/images/00114-535645852.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
    ]
    useEffect(()=>{
        if (balanceOfResult) {
            if (balanceOfResult.data){
                if(balanceOfResult.data.toNumber() === 0) {
                    router.push('/MyProfile')
                }
            }
        }
    }, [balanceOfResult])
    return (
        <div>
            <Head><title>LuiDAOs</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>LuidDAOs</h2>
                    <p>
                        This page creates and manages LuiDAO. It displays LuiDAO information in card format. Click on the title of each card for more information.
                    </p>
                </div>
                <p>{data?.length}</p>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {data?.map((dao, index) => (
                        <div key={index} className="col">
                            <div className="card h-100 text-dark">
                                <Image alt="{dao.name}" src={dao.pjImageUri} width="300" height="180" className="card-img-top img-fluid" style={{ aspectRatio: 4 / 3 }} />
                                <div className="card-body">
                                    <h5 className="card-title"><Link href={`/LuiDAODetails/${dao.pjDAO}`}>{dao.name}</Link></h5>
                                    <p className="card-text">{dao.description}</p>
                                </div>
                                <div className="card-footer">
                                    <small className="text-muted">Last updated {dao.timeLockController}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LuiDAOs