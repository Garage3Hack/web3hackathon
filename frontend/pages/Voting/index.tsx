import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Voting: NextPage = () => {
    const json = [
        { id: 1, vote: 'メンバ追加', options: ["Pros.", "Cons.", "Decline"] },
        { id: 2, vote: '単体テストを実施するか？', options: ["Pros.", "Cons.", "Decline"] },
    ]
    return (
        <div>
            <Head><title>Voting</title></Head>
            <div className="row mb-3" style={{ padding: "1.5rem" }}>
                <div>
                    <h2>Voting List</h2>
                    <p>
                        Manage the voting related to LuiDAO operations.
                    </p>
                </div>
                {json.map(vote => (
                    <div className="row" style={{ padding: "1.5rem" }}>
                        <div className="card text-dark">
                            <div className="card-header">{vote.vote}</div>
                            <div className="card-body">
                                {vote.options.map( op => (
                                    <button type="button" className="btn btn-light">{op}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Voting