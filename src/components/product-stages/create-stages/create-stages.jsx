import React, { useState } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styles from '../product-stages.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import Api from "../../shared/api/apiLink";

export default function CreateStages() {
    const [loader, setLoader] = useState(false);

    // Form fields state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        
        // Fetch the token from sessionStorage
        const token = sessionStorage.getItem('authToken'); // Ensure the key matches what you have set

        const loadingToast = toast.loading("Creating Stage...", {
            className: 'dark-toast'
        });

        try {
            const response = await Api.post('/fish-stage', formData);

            // After a successful API call
            toast.update(loadingToast, {
                render: "Created Stage successfully!",
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            // Reset form or handle success as needed
            setFormData({
                title: "",
                description: "",
            });

        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error creating stage. Please try again.",
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
                            <h4 className="mt-3 mb-5">Create Stages</h4>                            
                            <Form.Label className="fw-semibold">Name</Form.Label>
                            <Form.Control
                                placeholder="Eg. Fingerlings, Small, Medium, Large, washing, smoking, drying..."
                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                type="text"
                                name="title" // Change this to match the key in formData
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                    
                            <Form.Label className="fw-semibold fs-6 mt-4">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description" // Add name attribute here
                                value={formData.description}
                                required
                                onChange={handleInputChange}
                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                style={{ height: '200px' }}
                            />
                            
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? (
                                      ' Creating...'
                                        
                                    ) : (
                                        "Create"
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