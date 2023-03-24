import useDebounce from '@/common/useDebounce';
import { usePjDaoAddIssue, usePreparePjDaoAddIssue } from '@/contracts/generated';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount, useWaitForTransaction } from 'wagmi';

const IssueRegistration: NextPage = () => {
    const router = useRouter();
    const { pjdao_addr } = router.query;

    const account = useAccount()
    const addr = account.address as string

    const [title, setTitle] = useState('')
    const debouncedTitle = useDebounce(title, 500)

    const [description, setDescription] = useState('')
    const debouncedDescription = useDebounce(description, 500)

    const {config} = usePreparePjDaoAddIssue({
        address: pjdao_addr as `0x${string}`,
        args: [debouncedTitle, debouncedDescription, addr as `0x${string}`]
    })

    const {data, write} = usePjDaoAddIssue(config)

    const _ = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: (data) => {
            setLoading(false)
            router.back()
        }
      })

    // loading
    const [loading, setLoading] = useState(false)

    return (
        <div>
            <Head><title>LuiDAO Registration</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>Issue Registration</h2>
                    <p>
                        Register Issue on this page.
                    </p>
                </div>
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            console.log("create pj dao", write)
                            setLoading(true)
                            write?.()
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Issue Name</label>
                                <input type="text" className="form-control" id="issueName"
                                    placeholder="Enter issue of this LuiDAO"
                                    value={title} onChange={(e) => {setTitle(e.target.value)}} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="issueDescription"
                                    placeholder="Enter description of this issue" rows={3}
                                    value={description} onChange={(e) => {setDescription(e.target.value)}} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Responsible</label>
                                <input type="text" className="form-control" id="issueResponsible"
                                    placeholder="Enter responsible of this issue" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <input type="text" className="form-control" id="issueStatus"
                                    placeholder="Enter status of this issue" />
                            </div>
                            <button className="btn btn-primary" type="submit">Regist</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssueRegistration