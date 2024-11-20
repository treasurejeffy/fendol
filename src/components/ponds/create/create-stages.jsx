import React, { useState, useEffect } from 'react';
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import styles from '../product-stages.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import Api from "../../shared/api/apiLink";
import { useNavigate } from "react-router-dom";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function CreateStages() {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [view, setView] = useState(false);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);

    // Fetch stages data
    const fetchStages = async () => {
        try {
            const response = await Api.get('/fish-stages');
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

    // Format date utility
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

        const loadingToast = toast.loading("Creating Pond...", {
            className: 'dark-toast'
        });

        try {
            const response = await Api.post('/fish-stage', formData);

            // Reset form after successful submission
            setFormData({
                title: "",
                description: "",
            });
            toast.update(loadingToast, {
                render: "Created Pond successfully!",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                className: 'dark-toast'
            });

            setView(true)
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error creating stage. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
        } finally {
            setLoader(false);
        }
    };

    // Handle stage edit
    const handleEditStage = (stage) => {
        setSelectedStage(stage);
        setShowModal(true);
    };

    const handleSave = async () => {
        const saveToast = toast.loading('Saving changes...');
        try {
            await Api.put(`/fish-stage/${selectedStage.id}`, selectedStage);
            toast.update(saveToast, {
                render: 'Pond updated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            fetchStages();
            setShowModal(false);
        } catch (error) {
            toast.update(saveToast, {
                render: 'Failed to update pond. Please try again.',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
        }
    };
    const indexOfFirstItem = currentPage * itemsPerPage - itemsPerPage;
    const indexOfLastItem = indexOfFirstItem + itemsPerPage;
    const currentStages = stages.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
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
                                <ToastContainer />
                                <div className="d-flex justify-content-between">
                                    <h4 className="mt-3 mb-5">View Pond</h4>
                                    <span style={{ cursor: 'pointer' }} onClick={() => { setView(false) }} className="text-decoration-underline mt-3 me-2 text-muted fw-semibold">Create Pond</span>
                                </div>

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

                                {!loading && !error && currentStages.length > 0 && (
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
                                                {currentStages.map((stage) => {
                                                    const formattedCreatedAt = formatDate(stage.createdAt);
                                                    return (
                                                        <tr key={stage.id} onClick={() => handleEditStage(stage)}>
                                                            <td>{formattedCreatedAt}</td>
                                                            <td>{stage.title}</td>
                                                            <td>{stage.description || "No description available"}</td>                                                        
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                        <div className="d-flex justify-content-center mt-3">
                                            <ReactPaginate
                                                previousLabel={"<"}
                                                nextLabel={">"}
                                                breakLabel={"..."}
                                                pageCount={Math.ceil(stages.length / itemsPerPage)}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={3}
                                                onPageChange={handlePageChange}
                                                containerClassName={"pagination justify-content-center"}
                                                pageClassName={"page-item"}
                                                pageLinkClassName={"page-link"}
                                                previousClassName={"page-item"}
                                                previousLinkClassName={"page-link"}
                                                nextClassName={"page-item"}
                                                nextLinkClassName={"page-link"}
                                                breakClassName={"page-item"}
                                                breakLinkClassName={"page-link"}
                                                activeClassName={"active-light"}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Form className={styles.create_form} onSubmit={handleSubmit}>
                                <ToastContainer />
                                <div className="d-flex justify-content-between">
                                    <h4 className="mt-3 mb-5">Create Pond</h4>
                                    <span style={{ cursor: 'pointer' }} onClick={() => { setView(true) }} className="text-decoration-underline mt-3 me-2 text-muted fw-semibold">View Ponds</span>
                                </div>
                                <Form.Label className="fw-semibold">Name</Form.Label>
                                <Form.Control
                                    placeholder="Enter Pond Name.."
                                    className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Label className="fw-semibold fs-6 mt-4">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    required
                                    onChange={handleInputChange}
                                    className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                    style={{ height: '200px' }}
                                />
                                <div className="d-flex justify-content-end my-4">
                                    <Button className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`} disabled={loader} type="submit">
                                        {loader ? "Creating..." : "Create"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </main>

                    {/* Edit Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton className='border-0 mb-4'>
                            <Modal.Title>Edit Pond</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedStage && (
                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={selectedStage.title}
                                            onChange={(e) => setSelectedStage({ ...selectedStage, title: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={selectedStage.description}
                                            onChange={(e) => setSelectedStage({ ...selectedStage, description: e.target.value })}
                                        />
                                    </Form.Group>
                                </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer className='border-0'>                            
                            <Button variant="dark" onClick={handleSave} className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </section>
            </div>
        </section>
    );
}
