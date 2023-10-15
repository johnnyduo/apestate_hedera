import React from 'react';
import Header from '../layout/header'
import Sidebar from '../layout/sidebar';
import { Link } from 'react-router-dom';
import SubMenu from '../element/sub-menu';

const SettingsSecurity = () => {
    return (
        <><Header />
            <Sidebar />
            <div className="content-body">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="page-title">
                            <h4>Security</h4>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <SubMenu/>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xxl-12">
                                        <div className="card">
                                            <div className="card-header px-0">
                                                <h4 className="card-title">2-step verification </h4>
                                            </div>
                                            <div className="card-body px-0">
                                                <div
                                                    className="verify-content ">
                                                    <div className="d-flex align-items-center">
                                                        <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-ui-touch-phone"></i></span>
                                                        <div className="primary-number">
                                                            <p className="mb-0"><strong>+xxx xxxxxxxx60</strong></p>
                                                            <small>Keep your primary phone number up-to-date</small>
                                                            <br/>
                                                            <span className="text-success">Required</span>
                                                        </div>
                                                    </div>
                                                    <button className=" btn btn-outline-primary">Manage</button>
                                                </div>
                                                <hr className="dropdown-divider my-4"/>
                                                <div
                                                    className="verify-content">
                                                    <div className="d-flex align-items-center">
                                                        <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-email"></i></span>
                                                        <div className="primary-number">
                                                            <p className="mb-0"><strong>hello@example.com</strong></p>
                                                            <small>Keep your primary email up-to-date</small>
                                                            <br/>
                                                            <span className="text-success">Required</span>
                                                        </div>
                                                    </div>
                                                    <button className=" btn btn-outline-primary">Manage</button>
                                                </div>
                                                <hr className="dropdown-divider my-4"/>
                                                <div
                                                    className="verify-content">
                                                    <div className="d-flex align-items-center">
                                                        <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-lock"></i></span>
                                                        <div className="primary-number">
                                                            <p className="mb-0"><strong>*************</strong></p>
                                                            <small>You can change your password</small>
                                                            <br/>
                                                            <span className="text-success">Required</span>
                                                        </div>
                                                    </div>
                                                    <button className=" btn btn-outline-primary">Manage</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-12">
                                        <div className="card">
                                            <div className="card-header px-0">
                                                <h4 className="card-title">Identity verification </h4>
                                            </div>
                                            <div className="card-body px-0">
                                                <div
                                                    className="verify-content">
                                                    <div className="d-flex align-items-center">
                                                        <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-id"></i></span>
                                                        <div className="primary-number">
                                                            <p className="mb-0">xxx xxxxx xxx40</p>
                                                            <small>Social Security Number</small>
                                                            <br/>
                                                            <span className="text-success">Verified</span>
                                                        </div>
                                                    </div>
                                                    <button className=" btn btn-outline-primary" data-toggle="modal"
                                                        data-target="#idCardModal">Manage</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-12">
                                        <div className="card">
                                            <div className="card-header px-0">
                                                <h4 className="card-title">Use 2-step verification to secure your
                                                    transactions </h4>
                                            </div>
                                            <div className="card-body px-0">
                                                <form action="#">
                                                    <div className="col-12">
                                                        <div className="form-check form-switch mb-3">
                                                            <input className="form-check-input" type="checkbox" id="s1"
                                                                checked/>
                                                            <label className="form-check-label" for="s1">Any amount of cryptocurrency <b
                                                                    className="text-success">Most secure</b></label>
                                                        </div>
                                                        <div className="form-check form-switch mb-3">
                                                            <input className="form-check-input" type="checkbox" id="s2"
                                                                checked/>
                                                            <label className="form-check-label" for="s2">Over 1.2000 BTC per day</label>
                                                        </div>
                                                        
                                                        <div className="form-check form-switch mb-3">
                                                            <input className="form-check-input" type="checkbox" id="s3"
                                                                checked/>
                                                            <label className="form-check-label" for="s3">Never <b
                                                                    className="text-danger">Least secure</b></label>
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <button className="btn btn-success">Save</button>
                                                    </div>
                                                </form>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </>
    );
};

export default SettingsSecurity;