import React, { useState,useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button,Alert, Spinner} from 'react-bootstrap';
import { BsExclamationTriangleFill } from "react-icons/bs";
import styles from '../process.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import Api from "../../shared/api/apiLink";

export default function CreateProcess() {
    const [loader, setLoader] = useState(false);
    const [view, setView] = useState(false);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchStages = async () => {
        try {
        const response = await Api.get('/process-stages');
        if (Array.isArray(response.data.data)) {
            setStages(response.data.data);
        } else {
            throw new Error('Expected an array of stages');
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

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
        const loadingToast = toast.loading("Creating Process...", {
            className: 'dark-toast'
        });

        try {
            const response = await Api.post('/process-stage', formData);

            // Reset form or handle success as needed
            setFormData({
                title: "",
                description: "",
            });

            // After a successful API call
            toast.update(loadingToast, {
                render: "Created Process successfully!",
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
            
            fetchStages();
            setView(!view);
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
                        {view ? (
                            <div className={styles.create_form}>
                                <div className="d-flex justify-content-between"><h4 className="mt-3 mb-5">View Process</h4> <span style={{cursor: 'pointer'}} onClick={()=>{setView(!view)}} className="border-1 mt-3 me-2 text-muted text-decoration-underline fw-semibold">Create Process</span></div>
                                {loading && (
                                <div className="text-center">
                                    <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                                )}

                                {error && (
                                <div className="d-flex justify-content-center">
                                    <Alert variant="danger" className="text-center w-50 py-5">
                                    <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">{error}</span>
                                    </Alert>
                                </div>
                                )}

                                {!loading && !error && stages.length === 0 && (
                                <div className="d-flex justify-content-center">
                                    <Alert variant="info" className="text-center w-50 py-5">
                                    No available data
                                    </Alert>
                                </div>
                                )}

                                {!loading && !error && stages.length > 0 && (
                                <>
                                    <table className={styles.styled_table}>
                                    <thead>
                                        <tr>
                                        <th>DATE CREATED</th>
                                        <th>NAME</th>
                                        <th>DESCRIPTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stages.map((stage) => {
                                        const formattedCreatedAt = formatDate(stage.createdAt);
                                        return (
                                            <tr key={stage.id}>
                                            <td>{formattedCreatedAt}</td>
                                            <td>{stage.title}</td>
                                            <td>
                                                {stage.description.length > 40 
                                                ? `${stage.description.slice(0, 40)}...` 
                                                : stage.description}
                                            </td>
                                            </tr>
                                        );
                                        })}
                                    </tbody>
                                    </table>
                                </>)}
                            </div>) : (
                            <Form className={styles.create_form} onSubmit={handleSubmit}>
                                <ToastContainer/> 
                                <div className="d-flex justify-content-between"><h4 className="mt-3 mb-5">Create Process</h4> <span style={{cursor: 'pointer'}} onClick={()=>{setView(!view)}} className="border-1 mt-3 me-2 text-decoration-underline text-muted fw-semibold">View Process</span></div>
                                <Form.Label className="fw-semibold">Name</Form.Label>
                                <Form.Select
                                className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                >
                                <option value="" disabled>Select Process</option>
                                    <option value="washing">Washing</option>
                                    <option value="smoking">Smoking</option>
                                    <option value="drying">Drying</option>
                                </Form.Select>

                                <Form.Label className="fw-semibold fs-6 mt-4">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description" // Add name attribute here
                                    value={formData.description}
                                    required
                                    onChange={handleInputChange}
                                    className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                    style={{ height: '200px' }}
                                />
                                
                                <div className="d-flex justify-content-end my-4">
                                    <Button className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`} disabled={loader} type="submit">
                                        {loader ? (
                                        ' Creating...'
                                            
                                        ) : (
                                            "Create"
                                        )}
                                    </Button>
                                </div>
                            </Form>)}
                    </main>
                </section>
            </div>
        </section>
    );
}