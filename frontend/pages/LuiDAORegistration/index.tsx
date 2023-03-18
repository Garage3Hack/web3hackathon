import useDebounce from '@/common/useDebounce'
import { usePjDaoFactoryCreatePjDao, usePreparePjDaoFactoryCreatePjDao } from '@/contracts/generated'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useWaitForTransaction } from 'wagmi'
const LuiDAORegistration: NextPage = () => {
    const router = useRouter()
    const [daoName, setDaoName] = useState('')
    const debouncedDaoName = useDebounce(daoName, 500)

    const [daoDescription, setDaoDescription] = useState('')
    const debouncedDaoDescription = useDebounce(daoDescription, 500)
 
    const {config} = usePreparePjDaoFactoryCreatePjDao({
        address: process.env.NEXT_PUBLIC_PJDAOFACTORY_ADDR as `0x${string}` ,
        args: [debouncedDaoName, debouncedDaoDescription]
    })
    const { data, isLoading, isSuccess, write } = usePjDaoFactoryCreatePjDao(config)

    useWaitForTransaction({
        hash: data?.hash,
        onSuccess: (data) => {
            router.push('/')
        }
      })

    return (
        <div>
            <Head><title>LuiDAO Registration</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>LuidDAO Registration</h2>
                    <p>
                        Register LuiDAO on this page.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            console.log("create pj dao", write)
                            write?.()
                        }}>
                            <div className="mb-3">
                                <label className="form-label">LuiDAO Name</label>
                                <input type="text" className="form-control" id="luidaoName"
                                    placeholder="Enter a name of this LuiDAO"
                                    value={daoName}
                                    onChange={(e) => setDaoName(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" id="luidaoDescription"
                                    placeholder="Enter a description of this LuiDAO" rows={3}
                                    value={daoDescription}
                                    onChange={(e) => setDaoDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Required Skills</label>
                                <textarea className="form-control" id="requiredSkills"
                                    placeholder="Enter skills needed to participate in this LuiDAO" rows={3}></textarea>
                            </div>
                            <button className="btn btn-primary" type="submit">Regist</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LuiDAORegistration