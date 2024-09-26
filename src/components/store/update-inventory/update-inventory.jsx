import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../store.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import axios from 'axios';

export default function  UpdateInventory  () {
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
    });
    const [loader, setLoader] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateInventory = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Updating inventory...", {
            className: 'dark-toast'
        });

        try {
            // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for updating inventory
            const response = await axios.post('YOUR_API_ENDPOINT', formData);

            toast.update(loadingToast, {
                render: "Inventory updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            // Reset the form or handle success as needed
            setFormData({
                name: '',
                quantity: 0,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: "Error updating inventory. Please try again.",
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
                        <Form className={styles.create_form} onSubmit={handleUpdateInventory}>
                            <h4 className="mt-4 mb-5">Update Store Inventory</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Name</Form.Label>
                                    <Form.Control
                                        placeholder="Enter item name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        min="1"
                                        required
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
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

