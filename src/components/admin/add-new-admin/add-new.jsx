import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup  } from 'react-bootstrap';
import styles from '../admin-styles.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import Api from '../../shared/api/apiLink';

const AddNew = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: ""
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        
        const loadingToast = toast.loading("Creating New Admin..", {
            className: 'dark-toast'
        });
    
        try {
            const response = await Api.post('/admin', formData);
    
            // Extract the response data
            const { message, admin } = response.data; // Adjust based on your API response
    
            // After a successful API call
            toast.update(loadingToast, {
                render: message || "Created Admin successfully!", // Use the message from response if available
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
    
            // Reset form or handle success as needed
            setFormData({
                fullName: "",
                email: "",
                password: "",
                role: ""
            });
        } catch (error) {
            // Log the error response for debugging
            console.error("Error creating admin:", error);
    
            // Extract the error message if it exists
            const errorMessage = error.response?.data?.message || "Error creating admin. Please try again."; // Fallback message
    
            toast.update(loadingToast, {
                render: errorMessage, // Use the error message from the response
                type: "error", // Use string for type
                isLoading: false,
                autoClose: 6000,
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
                        <Form className={styles.create_form} onSubmit={handleSubmit}>
                            <h4 className="mt-5 mb-5">Create Admin</h4>
                            <Row xxl={2} xl={2} lg={2} md={1} sm={1} xs={1}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                                    <Form.Control
                                        placeholder="John Doe"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">E-Mail</Form.Label>
                                    <Form.Control
                                        placeholder="johndoe@gmail.com"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Password</Form.Label>
                                    <InputGroup className="mb-4">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 border-end-0 ${styles.inputs}`}
                                            placeholder="**********"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            minLength={7}
                                            maxLength={10}
                                            required
                                        />
                                        <InputGroup.Text
                                            onClick={togglePasswordVisibility}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 border-start-0 ${styles.inputs}`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold fs-6">Role</Form.Label>
                                    <Form.Control
                                        placeholder="Worker"
                                        type="text"
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        name="role"
                                        value={formData.role}
                                        required
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-5">
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
};

export default AddNew;
