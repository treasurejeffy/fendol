import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { BsExclamationTriangleFill } from "react-icons/bs";
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
    const [view, setView] = useState(false);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchStages = async () => {
        try {
        const response = await Api.get('/species');
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
            
            setFormData({
                speciesName: '',
                description: '',
            });

            // After a successful API call
            toast.update(loadingToast, {
                render: "Species added successfully!",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                className: 'dark-toast'
            });          
            
            fetchStages();
            setView(!view)
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
                        
                    {view ? (
                        <div className={styles.create_form}>
                            <div className="d-flex justify-content-between"><h4 className="mt-3 mb-5">View Fish Type</h4> <span style={{cursor: 'pointer'}} onClick={()=>{setView(!view)}} className="text-decoration-underline mt-3 me-2 text-muted fw-semibold">Add Fish Type</span></div>
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
                                        <td>{stage.speciesName}</td>
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
                        </div>) : 
                        (<Form className={styles.create_form} onSubmit={handleAddSpecies}>
                            <ToastContainer />
                            <div className="d-flex justify-content-between"><h4 className="mt-3 mb-5">Add Fish Type</h4> <span style={{cursor: 'pointer'}} onClick={()=>{setView(!view)}} className="mt-3 me-2 text-muted text-decoration-underline fw-semibold">View Fish Type</span></div>                              
                            <Form.Label className="fw-semibold">Name</Form.Label>
                            <Form.Control
                                placeholder="Enter fish type"
                                type="text"
                                name="speciesName"
                                value={formData.speciesName}
                                required
                                onChange={handleInputChange}
                                className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
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
                                className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                            />
                            <div className="d-flex justify-content-end my-4">
                                <Button className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`}  disabled={loader} type="submit">
                                    {loader ? ' Adding...' : 'Add'}
                                </Button>
                            </div>
                        </Form>)}
                    </main>
                </section>
            </div>
        </section>
    );
};

export default AddSpecies;
