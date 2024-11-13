import React, { useState } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col } from 'react-bootstrap';
import styles from '../showcase.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import Api from "../../shared/api/apiLink";

export default function AddNew() {
    const [loader, setLoader] = useState(false);

    // Form fields state
    const [formData, setFormData] = useState({
        type: "",
        initialQuantity: 0,
    });

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the field is 'initialQuantity', parse the value as a float
        if (name === 'initialQuantity') {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0, // Fallback to 0 if value is NaN
            });
        } else {
            setFormData({
                ...formData,
                [name]: value, // For other fields, just update normally
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const loadingToast = toast.loading("Adding  New Showcase...", {
            className: 'dark-toast'
        });

        try {
            const response = await Api.post('/create-show-glass', formData);

            // After a successful API call
            toast.update(loadingToast, {
                render: "Created showcase successfully!",
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            // Reset form or handle success as needed
            setFormData({
                type: "",
                initialQuantity: 0,
            });

        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error creating showcase. Please try again.",
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
                <div className={styles.sidebar}>
                    <SideBar className={styles.sidebarItem} />
                </div>

                <section className={`${styles.content}`}>
                    <main>
                        <Form className={styles.create_form} onSubmit={handleSubmit}>
                            <ToastContainer/>
                            <h4 className="mt-3 mb-5">Add New</h4>                            
                            <Row lg={2} md={1}>
                                <Col>
                                    <Form.Label className="fw-semibold">Type Of Showcase</Form.Label>
                                    <Form.Select
                                        aria-label="Select Name"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        name="type" // Make sure this matches the key in formData
                                        value={formData.type} // Use the value from formData for this select
                                        onChange={handleInputChange} // This will handle updates to formData
                                        required
                                    >
                                        <option value="" disabled>Select an option...</option> 
                                        <option value="broken">Broken</option>
                                        <option value="whole">Whole</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Label className="fw-semibold fs-6">Default Quantity</Form.Label>
                                    <Form.Control            
                                        name="initialQuantity" // Add name attribute here
                                        value={formData.initialQuantity}
                                        readOnly
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>                                              
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? (
                                      ' Adding New...'
                                        
                                    ) : (
                                        "Add New"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
}