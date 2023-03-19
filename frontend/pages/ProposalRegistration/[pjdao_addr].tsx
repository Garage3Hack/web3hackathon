import useDebounce from '@/common/useDebounce'
import { useCoreGovernorPropose, usePrepareCoreGovernorPropose } from '@/contracts/generated'
import { BigNumber, Signer } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useWaitForTransaction, useSigner } from 'wagmi'

const ProposalRegistration: NextPage = () => {
    const router = useRouter()
    
    const { pjdao_addr } = router.query; // pjDAOの情報はProposalに入れる？
    const { data: signer, isError, isLoading } = useSigner();

    const [proposalDescription, setProposalDescription] = useState('')
    const debouncedProposalDescription = useDebounce(proposalDescription, 500)

    const {config} = usePrepareCoreGovernorPropose({
        address: process.env.NEXT_PUBLIC_COREGOVERNOR_ADDR  as `0x${string}`,
        args: [[process.env.NEXT_PUBLIC_ADMINISTERNFT_ADDR as `0x${string}`], [BigNumber.from(0)], [signer], [], proposalDescription]
    })

    const {data, write} = useCoreGovernorPropose(config)

    useWaitForTransaction({
        hash: data?.hash,
        onSuccess: (data) => {
            router.push('/Management')
        }
    })

    return (
        <div>
            <Head><title>Proposal Registration</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>Proposal Registration</h2>
                    <p>
                        Register Proposal on this page.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            console.log("create proposal", write)
                            write?.()
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Proposal Description</label>
                                <textarea className="form-control" id="luidaoDescription"
                                    placeholder="Enter a proposal description of this LuiDAO" rows={3}
                                    value={proposalDescription}
                                    onChange={(e) => setProposalDescription(e.target.value)} />
                            </div>
                            <button className="btn btn-primary" type="submit">Regist</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalRegistration