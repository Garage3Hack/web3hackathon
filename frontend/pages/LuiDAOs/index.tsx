import type { NextPage } from 'next'
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link'

const LuiDAOs: NextPage = () => {
    const json = [
        { id: 1, name: 'Test DAO', image: '/images/00025-796973551.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
        { id: 2, name: 'Canvas DAO', image: '/images/00087-2503621524.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
        { id: 3, name: 'Supply DAO', image: '/images/00114-535645852.png', description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', update: '2023/3/11' },
    ]
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {json.map(dao => (
                        <div className="col">
                            <div className="card h-100 text-dark">
                                <Image alt="{dao.name}" src={dao.image} width="300" height="180" className="card-img-top img-fluid" style={{ aspectRatio: 4 / 3 }} />
                                <div className="card-body">
                                    <h5 className="card-title"><Link href="/LuiDAODetails">{dao.name}</Link></h5>
                                    <p className="card-text">{dao.description}</p>
                                </div>
                                <div className="card-footer">
                                    <small className="text-muted">Last updated {dao.update}</small>
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