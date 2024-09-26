import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../feed.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import axios from 'axios';

const UpdateFeedInventory = () => {
    // Initial form state
    const [formData, setFormData] = useState({
        productStage: '',
        quantityUsed: 0,
        feedName: '',
        feedType: '',
    });
    const [loader, setLoader] = useState(false);

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission to update feed inventory
    const handleUpdateFeed = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Updating feed inventory...", {
            className: 'dark-toast'
        });

        try {
            // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for updating feed inventory
            const response = await axios.post('YOUR_API_ENDPOINT', formData);

            // Handle successful API call
            toast.update(loadingToast, {
                render: "Feed inventory updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            // Reset form after success
            setFormData({
                productStage: '',
                quantityUsed: 0,
                feedName: '',
                feedType: '',
            });
        } catch (error) {
            // Handle error during API call
            toast.update(loadingToast, {
                render: "Error updating feed inventory. Please try again.",
                type: "error",
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
                        <Form className={`vh-100 ${styles.create_form}`} onSubmit={handleUpdateFeed}>
                            <h4 className="pt-4 pb-5">Update Feed Inventory</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Product Stage</Form.Label>
                                    <Form.Select
                                        name="productStage"
                                        required
                                        value={formData.productStage}
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Select Stage</option>
                                        <option value="Fingerlings">Fingerlings</option>
                                        <option value="Small Fish">Small Fish</option>
                                        <option value="Medium Fish">Medium Fish</option>
                                        <option value="Large Fish">Large Fish</option>
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity Used</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity used"
                                        type="number"
                                        name="quantityUsed"
                                        value={formData.quantityUsed}
                                        min="1"
                                        required
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Feed Name</Form.Label>
                                    <Form.Control
                                        placeholder="Enter feed name"
                                        type="text"
                                        name="feedName"
                                        value={formData.feedName}
                                        required
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Feed Type</Form.Label>
                                    <Form.Control
                                        placeholder="Enter feed type"
                                        type="text"
                                        name="feedType"
                                        required
                                        value={formData.feedType}
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end py-5">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 fw-semibold" disabled={loader} type="submit">
                                    {loader ? ' Updating...' : 'Update'}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
};

export default UpdateFeedInventory;
