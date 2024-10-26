import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { BsExclamationTriangleFill } from "react-icons/bs";
import axios from "axios";
import { Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAllStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [selectedStage, setSelectedStage] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStage(prevStage => ({
      ...prevStage,
      [name]: value,
    }));
  };

  const handleEdit = (stage) => {
    setSelectedStage(stage);
    setShowModal(true);
  };

  // save edited stage
  const handleSave = async () => {
    if (!selectedStage || !selectedStage.title || !selectedStage.description) {
      toast.error("Please fill in all fields."); // Ensure all fields are filled
      return;
    }

    let loadingToast; // Declare loadingToast here

    try {
      // Show loading toast
      loadingToast = toast.loading("Saving stage..."); // Show loading toast

      // Call your API to save the changes using the correct URL with ID
      const response = await Api.put(`/fish-stage/${selectedStage.id}`, selectedStage);

      // Show success toast
      toast.update(loadingToast, { render: "Stage updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
      fetchStages();
      setShowModal(false); // Close the modal after saving
    } catch (error) {
      console.error("Failed to save stage:", error);
      // Show error toast
      toast.update(loadingToast, { render: "Failed to save stage. Please try again.", type: "error", isLoading: false, autoClose: 3000 }); // Update error toast
    }
  };


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStages = stages.slice(startIndex, endIndex);

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
          <main className={styles.create_form}>
            <h4 className="mt-3 mb-5">View Stages</h4>

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

            {!loading && !error && displayedStages.length === 0 && (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  No available data
                </Alert>
              </div>
            )}

            {!loading && !error && displayedStages.length > 0 && (
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
                    {displayedStages.map((stage) => {
                      const formattedCreatedAt = formatDate(stage.createdAt);
                      return (
                        <tr key={stage.id} onClick={() => handleEdit(stage)} className={styles.trow}>
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

                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"< "}
                    nextLabel={" >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(stages.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"dark"}
                  />
                </div>
                <ToastContainer />

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-semibold">Edit Stage</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="border-0 pt-5">
                    {selectedStage && (
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={selectedStage.title || ''}
                            placeholder="*****"
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            style={{ height: '200px' }}
                            required
                            value={selectedStage.description || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Form>
                    )}
                  </Modal.Body>
                  <Modal.Footer className="border-0 mt-5">
                    <Button variant="dark" className="px-5" onClick={handleSave}>
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </main>
        </section>
      </div>
    </section>
  );
};

export default ViewAllStages;
