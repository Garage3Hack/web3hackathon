import { usePjDaoFactoryCreatePjDao, usePreparePjDaoFactoryCreatePjDao } from '@/contracts/generated'
import type { NextPage } from 'next'
import Head from 'next/head'
const LuiDAORegistration: NextPage = () => {
    const {config} = usePreparePjDaoFactoryCreatePjDao({
        address: process.env.NEXT_PUBLIC_PJDAOFACTORY_ADDR as string,
        args: ['sample', 'sample description']
    })
    const { data, isLoading, isSuccess, write } = usePjDaoFactoryCreatePjDao(config)
    const registDao = () => {
        console.log("create pj dao", write)
        write?.()
        console.log("writed")
    }
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
                        <div className="mb-3">
                            <label className="form-label">LuiDAO Name</label>
                            <input type="text" className="form-control" id="luidaoName"
                                placeholder="Enter a name of this LuiDAO"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="luidaoDescription"
                                placeholder="Enter a description of this LuiDAO" rows={3}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Required Skills</label>
                            <textarea className="form-control" id="requiredSkills"
                                placeholder="Enter skills needed to participate in this LuiDAO" rows={3}></textarea>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={registDao}>Regist</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LuiDAORegistration