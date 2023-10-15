import React from 'react';
import Header from '../layout/header'
import Sidebar from '../layout/sidebar';
import { Link } from 'react-router-dom';
import PriceArea from '../charts/price-area'

const Price = () => {
    return (
        <>
            <Header />
            <Sidebar />
            <div className="content-body">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-btc">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc BTC-alt"></i>
                                            <span>Bitcoin</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-eth">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc ETH-alt"></i>
                                            <span>Ethereum</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-usdt">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc USDT-alt"></i>
                                            <span>Tether</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-xrp">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc XRP-alt"></i>
                                            <span>Ripple</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-ltc">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc LTC-alt"></i>
                                            <span>Litecoin</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-ada">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc ADA-alt"></i>
                                            <span>Cardano</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-eos">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc EOS-alt"></i>
                                            <span>EOS</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-xmr">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc XMR-alt"></i>
                                            <span>Monero</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-xtz">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc XTZ-alt"></i>
                                            <span>Tezos</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-xem">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc XEM-alt"></i>
                                            <span>NEM</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-neo">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc NEO-alt"></i>
                                            <span>NEO</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-dash">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc DASH-alt"></i>
                                            <span>Dash</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-etc">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc ETC-alt"></i>
                                            <span>Ethereum Classic</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-dgb">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc DGB-alt"></i>
                                            <span>DigiByte</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="price-widget bg-dcr">
                                <Link to={"/price-details"}>
                                    <div className="price-content">
                                        <div className="icon-title">
                                            <i className="cc DCR-alt"></i>
                                            <span>Decred</span>
                                        </div>
                                        <h5>$ 11,785.10</h5>
                                    </div>
                                    <PriceArea />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Price;