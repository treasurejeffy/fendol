import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../product-stages.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import Api from '../../shared/api/apiLink';

const AddSpecies = () => {
    const [formData, setFormData] = useState({
        speciesName: '',
        description: '',
    });
    const [loader, setLoader] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSpecies = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Adding species...", {
            className: 'dark-toast'
        });
    
        try {
            // Make the actual API call to post species data
            const response = await Api.post('/species', formData);
    
            // After a successful API call
            toast.update(loadingToast, {
                render: "Species added successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
            // Reset form after successful submission
            setFormData({
                speciesName: '',
                description: '',
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error adding species. Please try again.",
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
                        <Form className={styles.create_form} onSubmit={handleAddSpecies}>
                            <h4 className="mt-4 mb-5">Add Fish Type</h4>                               
                            <Form.Label className="fw-semibold">Name</Form.Label>
                            <Form.Control
                                placeholder="Enter fish type"
                                type="text"
                                name="speciesName"
                                value={formData.speciesName}
                                required
                                onChange={handleInputChange}
                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                            />
                            <Form.Label className="fw-semibold mt-3">Description</Form.Label>
                            <Form.Control
                                placeholder="Enter description"
                                as="textarea"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                style={{ height: '200px' }}
                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                            />
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? ' Adding...' : 'Add Species'}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
};

export default AddSpecies;
