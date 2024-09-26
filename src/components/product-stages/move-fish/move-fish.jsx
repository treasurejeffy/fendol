import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../product-stages.module.scss'; 
import { toast, ToastContainer } from 'react-toastify';
import SideBar from '../../shared/sidebar/sidebar'; 
import Header from '../../shared/header/header'; 
import axios from 'axios'; 

export default function MoveFish() {
    const [moveFishData, setMoveFishData] = useState({
        stageFrom: '',
        stageTo: '',
        fishName: '',
        specie: '',
        quantity: '',
        remark: '',
    });
    const [loader, setLoader] = useState(false);

    const handleInputChangeMoveFish = (e) => {
        const { name, value } = e.target;
        setMoveFishData({ ...moveFishData, [name]: value });
    };

    const handleMoveFishes = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Moving fish...");

        try {
            const response = await axios.post('YOUR_API_ENDPOINT', moveFishData);
            toast.update(loadingToast, {
                render: "Fish moved successfully!",
                type: "success", 
                isLoading: false,
                autoClose: 7000,
            });
            setMoveFishData({
                stageFrom: '',
                stageTo: '',
                fishName: '',
                specie: '',
                quantity: '',
                remark: '',
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: "Error moving fish. Please try again.",
                type: "error", 
                isLoading: false,
                autoClose: 7000,
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <section className={`d-none d-lg-block ${styles.body}`}>
            <div className="sticky-top">
                <Header />
            </div>
            <div className="d-flex gap-2">
                <div className={`${styles.sidebar}`}>
                    <SideBar className={styles.sidebarItem} />
                </div>
                <section className={`${styles.content}`}>
                    <main>
                        <ToastContainer/>
                        <Form className={styles.create_form} onSubmit={handleMoveFishes}>
                            <h4 className="my-5">Move Fish</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage From</Form.Label>
                                    <Form.Select
                                        name="stageFrom"
                                        value={moveFishData.stageFrom}
                                        onChange={handleInputChangeMoveFish}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="">Select Stage From</option>
                                        <option value="stage1">Stage 1</option>
                                        <option value="stage2">Stage 2</option>
                                        <option value="stage3">Stage 3</option>
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage To</Form.Label>
                                    <Form.Select
                                        name="stageTo"
                                        value={moveFishData.stageTo}
                                        onChange={handleInputChangeMoveFish}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="">Select Stage To</option>
                                        <option value="stage1">Stage 1</option>
                                        <option value="stage2">Stage 2</option>
                                        <option value="stage3">Stage 3</option>
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Fish Name</Form.Label>
                                    <Form.Control
                                        placeholder="Enter fish name"
                                        type="text"
                                        name="fishName"
                                        value={moveFishData.fishName}
                                        required
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Specie</Form.Label>
                                    <Form.Control
                                        placeholder="Enter specie"
                                        type="text"
                                        name="specie"
                                        value={moveFishData.specie}
                                        required
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="quantity"
                                        value={moveFishData.quantity}
                                        min='1'
                                        required
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Remark</Form.Label>
                                    <Form.Control
                                        placeholder="Enter remark"
                                        type="text"
                                        name="remark"
                                        required
                                        value={moveFishData.remark}
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? 'Moving' : "Move"}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
}
