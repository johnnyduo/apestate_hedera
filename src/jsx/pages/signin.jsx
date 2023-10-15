import React from 'react';import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'

const Signin = () => {
    return (
        <>
            <div className="authincation section-padding">
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-xl-5 col-md-6">
                        <div className="mini-logo text-center my-4">
                            <Link to={"/intro"}><img src={logo} alt=""/></Link>
                            <h4 className="card-title mt-3">Sign in to Qash</h4>
                        </div>
                        <div className="auth-form card">
                            <div className="card-body">
                                <form name="myform" className="signin_validate row g-3" action="otp-2">
                                    <div className="col-12">
                                        <input type="email" className="form-control" placeholder="hello@example.com"
                                            name="email"/>
                                    </div>
                                    <div className="col-12">
                                        <input type="password" className="form-control" placeholder="Password"
                                            name="password"/>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                            <label className="form-check-label" for="flexSwitchCheckDefault">Remember
                                                me</label>
                                        </div>
                                    </div>
                                    <div className="col-6 text-right">
                                        <Link to={"/reset"}>Forgot Password?</Link>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                                    </div>
                                </form>
                                <p className="mt-3 mb-0">Don't have an account? <Link className="text-primary"
                                        to={"/signup"}>Sign up</Link></p>
                            </div>

                        </div>
                        <div className="privacy-link">
                            <Link to={"/signup"}>Have an issue with 2-factor
                                authentication?</Link>
                            <br />
                            <Link to={"/signup"}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Signin;