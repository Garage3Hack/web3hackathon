import Link from 'next/link'
import Image from 'next/image'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'


const LuidaoHeader = () => {


    return (
        <div className="row">
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">LuiDAO</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/LuiDAORegistration">Registration</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/Members">Members</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/Voting">Voting</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav d-flex flex-row me-1">

                            <li className="nav-item me-3 me-lg-0">
                                <Web3Button icon="show" label="Connect Wallet" balance="show" />
                            </li>
                            <li className="nav-item me-3 me-lg-0">
                                <a className="nav-link" href="#"><Image alt="settings" src="/icons/gear-fill.svg" width="16" height="16" /> Settings </a>
                            </li>
                            <li className="nav-item me-3 me-lg-0">
                                <a className="nav-link" href="/MyProfile"><Image alt="settings" src="/icons/person-fill.svg" width="16" height="16" /> My Profile </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default LuidaoHeader