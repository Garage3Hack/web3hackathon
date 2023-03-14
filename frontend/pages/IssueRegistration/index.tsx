import type { NextPage } from 'next'
import Head from 'next/head'

const IssueRegistration: NextPage = () => {
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <div className="mb-3">
                            <label className="form-label">Issue Name</label>
                            <input type="text" className="form-control" id="issueName"
                                placeholder="Enter issue of this LuiDAO" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="issueDescription"
                                placeholder="Enter description of this issue" rows={3}></textarea>
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
                        <button className="btn btn-primary" type="button">Regist</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssueRegistration