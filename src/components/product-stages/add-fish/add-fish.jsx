import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../product-stages.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import axios from 'axios';

const AddFish = () => {
    const [formData, setFormData] = useState({
        stage: '',
        quantity: 0,
        fishName: '',
        specie: '',
    });
    const [loader, setLoader] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddFish = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Adding fish...",{
            className: 'dark-toast'});

        try {
            const response = await axios.post('YOUR_API_ENDPOINT', formData);

            // After a successful API call
            toast.update(loadingToast, {
                render: "Fish added successfully!",
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
            // Reset form or handle success as needed
            setFormData({
                stage: '',
                quantity: 0,
                specie: '',
                fishName: '',
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: "Error adding fish. Please try again.",
                type: "error", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
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
                        <ToastContainer />
                        <Form className={styles.create_form} onSubmit={handleAddFish}>
                            <h4 className="mt-5 mb-5">Add Fish</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage</Form.Label>
                                    <Form.Select
                                        name="stage"
                                        value={formData.stage}
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="stage1">Stage 1</option>
                                        <option value="stage2">Stage 2</option>
                                        <option value="stage3">Stage 3</option>
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        min="1"
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Fish Name</Form.Label>
                                    <Form.Control
                                        placeholder="Enter fish name"
                                        type="text"
                                        name="fishName"
                                        required
                                        value={formData.fishName}
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Specie</Form.Label>
                                    <Form.Control
                                        placeholder="Enter specie"
                                        type="text"
                                        name="specie"
                                        required                                    
                                        value={formData.specie}
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? (
                                      ' Adding...'
                                        
                                    ) : (
                                        "ADD"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
};

export default AddFish;
