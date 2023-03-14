import type { NextPage } from 'next'
import Head from 'next/head'

const IssueDetails: NextPage = () => {
    const json = [
        { id: 1, comment: 'AAAAAAAA', issuer: 'aikei', update: '2023/3/17' },
        { id: 2, comment: 'BBBBBBBB', issuer: 'someya', update: '2023/3/17' },
        { id: 3, comment: 'CCCCCCCC', issuer: 'koizumi', update: '2023/3/17' },
    ]
    return (
        <div>
            <Head><title>Issue Details</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>Issue Details</h2>
                    <p>
                        This page manages issues within the LuiDAO. Please add your comments on the results of your review of this issue.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <div className="mb-3">
                            <label className="form-label">Issue Name</label>
                            <input type="text" className="form-control" id="issueName"
                                placeholder="Enter your issue." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="issueDescription"
                                placeholder="Enter a description of the issue." rows={3}></textarea>
                        </div>
                        <div>
                            <label className="form-label">Responsible</label>
                            <input type="text" className="form-control" id="issueResponsible"
                                placeholder="Enter the name of the person responsible." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <input type="text" className="form-control" id="issueStatus"
                                placeholder="Enter the status of this issue." />
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Issuer</th>
                                    <th scope="col">Update</th>
                                    <th scope="col"></th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {json.map(comment => (
                                    <tr>
                                        <th scope="row">{comment.id}</th>
                                        <td>{comment.comment}</td>
                                        <td>{comment.issuer}</td>
                                        <td>{comment.update}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary"><i className="bi bi-eye"></i></button>
                                            <button type="button" className="btn btn-danger"><i className="bi bi-trash3"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-primary" type="button">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssueDetails