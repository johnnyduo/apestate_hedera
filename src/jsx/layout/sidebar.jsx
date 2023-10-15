import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'

const Sidebar = () => {
    return (
        <>
            <div className="sidebar">
                <div className="brand-logo">
                    <Link to={"/"}><img src={logo} alt="" />
                    </Link>
                </div>
                <div className="menu">
                    <ul>
                        <li>
                            <Link to={"/"} title="Home">
                                <span><i className="icofont-ui-home"></i></span>
                            </Link>
                        </li>
                        <li><Link to={"/trade"} title="Trade">
                            <span><i className="icofont-stack-exchange"></i></span>
                        </Link>
                        </li>
                        <li><Link to={"/wallet"} title="Wallet">
                            <span><i className="icofont-wallet"></i></span>
                        </Link>
                        </li>
                        <li><Link to={"/price"} title="Price">
                            <span><i className="icofont-price"></i></span>
                        </Link>
                        </li>
                        <li><Link to={"/settings-profile"} title="Settings">
                            <span><i className="icofont-ui-settings"></i></span>
                        </Link>
                        </li>
                        <li className="logout"><Link to={"/signin"}
                            title="Signout">
                            <span><i className="icofont-power"></i></span>
                        </Link>
                        </li>
                    </ul>

                    <p className="copyright">
                        &#169; <Link to={"/#"}>Qkit</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;