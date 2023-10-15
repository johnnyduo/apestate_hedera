import React, { useState } from 'react';
import Header from '../layout/header'
import Sidebar from '../layout/sidebar';
import SubMenu from '../element/sub-menu';
import { Modal, Button } from 'react-bootstrap'

import checkimg from '../../images/routing.png'

const SettingsPaymentMethod = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    return (
        <><Header />
            <Sidebar />
            <div className="content-body">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="page-title">
                                <h4>Payment Method</h4>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <SubMenu />
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header px-0">
                                                    <h4 className="card-title">Add a payment method </h4>
                                                </div>
                                                <div className="card-body px-0">
                                                    <div
                                                        className="verify-content">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-ui-touch-phone"></i></span>
                                                            <div className="primary-number">
                                                                <p className="mb-0">Bank of America</p>
                                                                <small>Bank **************5421</small>
                                                                <br />
                                                                <span className="text-success">Verified</span>
                                                            </div>
                                                        </div>
                                                        <button className=" btn btn-outline-primary">Manage</button>
                                                    </div>
                                                    <hr className="dropdown-divider my-4" />
                                                    <div
                                                        className="verify-content">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-3 icon-circle bg-primary text-white"><i className="icofont-email"></i></span>
                                                            <div className="primary-number">
                                                                <p className="mb-0">Master Card</p>
                                                                <small>Credit Card *********5478</small>
                                                                <br />
                                                                <span className="text-success">Verified</span>
                                                            </div>
                                                        </div>
                                                        <button className=" btn btn-outline-primary">Manage</button>
                                                    </div>

                                                    <div className="mt-5">
                                                        <button type="button" className="btn btn-primary mr-3" onClick={handleShow1}>Add New Bank</button>
                                                        <button type="button" className="btn btn-success" onClick={handleShow}>Add New Card</button>
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
            </div>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header>
                    <Modal.Title>Add Bank Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form action="verify-step-6.html" class="identity-upload">
                        <div class="row g-3">
                            <div class="col-xl-12">
                                <label class="form-label">Routing number </label>
                                <input type="text" class="form-control" placeholder="25487" />
                            </div>
                            <div class="col-xl-12">
                                <label class="form-label">Account number </label>
                                <input type="text" class="form-control" placeholder="36475" />
                            </div>
                            <div class="col-xl-12">
                                <label class="form-label">Fulll name </label>
                                <input type="text" class="form-control" placeholder="Jannatul Maowa" />
                            </div>
                            <div class="col-xl-12">
                                <img src={checkimg} alt="" class="img-fluid" />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose1}>
                        Confirm
          </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Add Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form class="identity-upload">
                        <div class="row g-3">
                            <div class="col-xl-12">
                                <label class="form-label">Name on card </label>
                                <input type="text" class="form-control" placeholder="Jannatul Maowa" />
                            </div>
                            <div class="col-xl-12">
                                <label class="form-label">Card number </label>
                                <input type="text" class="form-control" placeholder="5658 4258 6358 4756" />
                            </div>
                            <div class="col-xl-4">
                                <label class="form-label">Expiration </label>
                                <input type="text" class="form-control" placeholder="10/22" />
                            </div>
                            <div class="col-xl-4">
                                <label class="form-label">CVC </label>
                                <input type="text" class="form-control" placeholder="125" />
                            </div>
                            <div class="col-xl-4">
                                <label class="form-label">Postal code </label>
                                <input type="text" class="form-control" placeholder="2368" />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Confirm
          </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SettingsPaymentMethod;