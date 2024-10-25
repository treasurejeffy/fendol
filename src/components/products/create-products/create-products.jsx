import React, { useState } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, Row, Button } from 'react-bootstrap';
import styles from '../product.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import Api from "../../shared/api/apiLink";

// Function to format numbers with commas
const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to remove commas from the formatted number
const removeCommas = (number) => {
    return number.toString().replace(/,/g, "");
};

export default function CreateProducts() {
    const [loader, setLoader] = useState(false);

    // Form fields state
    const [formData, setFormData] = useState({
        productName: "",
        productWeight: "",
        unit: "",
        basePrice: ""
    });

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If changing basePrice, format with commas for display
        if (name === "basePrice") {
            const formattedValue = value ? formatNumberWithCommas(removeCommas(value)) : "";
            setFormData({
                ...formData,
                [name]: formattedValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Creating Product...", {
            className: 'dark-toast'
        });

        try {
            // Before submitting, remove commas from basePrice
            const formDataToSubmit = {
                ...formData,
                basePrice: removeCommas(formData.basePrice)
            };

            const response = await Api.post('/product', formDataToSubmit);

            // After a successful API call
            toast.update(loadingToast, {
                render: "Created Product successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            // Reset form or handle success as needed
            setFormData({
                productName: "",
                productWeight: "",
                unit: "",
                basePrice: ""
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error creating product. Please try again.",
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
                <div className={styles.sidebar}>
                    <SideBar className={styles.sidebarItem} />
                </div>

                <section className={`${styles.content}`}>
                    <main>
                        <ToastContainer />
                        <Form className={styles.create_form} onSubmit={handleSubmit}>
                            <h4 className="mt-3 mb-5">Create Product</h4>
                            <Row xxl={2} xl={2} lg={2} md={1}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Product Name</Form.Label>
                                    <Form.Control
                                        placeholder="Enter product name"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        required
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Product Weight</Form.Label>
                                    <Form.Control
                                        placeholder="Enter product weight"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        type="text"
                                        name="productWeight"
                                        value={formData.productWeight}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Product Unit</Form.Label>
                                    <Form.Select
                                        name="unit"
                                        value={formData.unit}
                                        required
                                        onChange={handleInputChange}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Select Unit</option>
                                        <option value="kg">Kilogram</option>
                                        <option value="g">Gram</option>
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Base Price</Form.Label>
                                    <Form.Control
                                        placeholder="Enter base price"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        type="text"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        required
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end mt-5">
                                <Button className="btn shadow btn-dark py-2 px-5 mt-4 fs-6 fw-semibold" disabled={loader} type="submit">
                                    {loader ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
}
