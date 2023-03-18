import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const Management: NextPage = () => {
  const daos = [
    {
      id: 1,
      name: "Test DAO",
      image:
        "https://ipfs.io/ipfs/QmNPHSQGmMxgnHB3hWg6DVgQoAkcjjKGXRXykGoYNrnHJD/0.png",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
      update: "2023/3/11",
      deliverables: [
        { id: 1, document: "AAAAAAAA", link: "http://aaaa" },
        { id: 2, document: "BBBBBBBB", link: "http://aaaa" },
        { id: 3, document: "CCCCCCCC", link: "http://aaaa" },
      ],
    },
    {
      id: 2,
      name: "Canvas DAO",
      image: "/images/00087-2503621524.png",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
      update: "2023/3/11",
      deliverables: [
        { id: 1, document: "AAAAAAAA", link: "http://aaaa" },
        { id: 2, document: "BBBBBBBB", link: "http://aaaa" },
        { id: 3, document: "CCCCCCCC", link: "http://aaaa" },
      ],
    },
    {
      id: 3,
      name: "Supply DAO",
      image: "/images/00114-535645852.png",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
      update: "2023/3/11",
      deliverables: [
        { id: 1, document: "AAAAAAAA", link: "http://aaaa" },
        { id: 2, document: "BBBBBBBB", link: "http://aaaa" },
        { id: 3, document: "CCCCCCCC", link: "http://aaaa" },
      ],
    },
  ];
  return (
    <div>
      <Head>
        <title>Management:Voting</title>
      </Head>
      <div className="row mb-3" style={{ padding: "1.5rem" }}>
        <div className="accordion" id="voting-list">
          {daos.map((luidao, index) => (
            <div key={"voting-" + index} className="accordion-item">
              <h2 className="accordion-header" id={"heading-" + index}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={"#collapse-" + index}
                  aria-controls={"collapse-" + index}
                >
                  {luidao.name}
                </button>
              </h2>
              <div
                id={"collapse-" + index}
                className="accordion-collapse collapse"
                aria-labelledby={"heading-" + index}
              >
                <div className="accordion-body">{luidao.description}</div>
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Document Name</th>
                        <th scope="col">Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {luidao.deliverables.map((doc, index) => (
                        <tr key={"doc-" + index}>
                          <th scope="row">{index}</th>
                          <td>{doc.document}</td>
                          <td>
                            <Link href={doc.link}>{doc.link}</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <button type="button" className="btn btn-primary">
                    Pros
                  </button>
                  <button type="button" className="btn btn-primary">
                    Cons
                  </button>
                  <button type="button" className="btn btn-primary">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
          ;
        </div>
      </div>
    </div>
  );
};

export default Management;
