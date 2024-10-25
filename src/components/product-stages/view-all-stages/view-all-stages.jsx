import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import axios from "axios";
import { Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate';

const ViewAllStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Adjust this number as needed
  const [selectedStage, setSelectedStage] = useState(null); // For the modal
  const [showModal, setShowModal] = useState(false); // Modal visibility

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await Api.get('/fish-stages'); // Replace with your API URL
        console.log(response.data);
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

    fetchStages();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStage({
      ...selectedStage,
      [name]: value,
    });
  };

  // edit stage
  const handleEdit = (stage) => {
    setSelectedStage(stage); // Set the selected admin data
    setShowModal(true); // Show the modal
  };

  // save edited stage
  const handleSave = async () => {
    try {
      // You can call your API to save the changes here
      await Api.put(`/admins/${selectedStage.id}`, selectedStage);
      setShowModal(false); // Close the modal after saving
    } catch (error) {
      console.error("Failed to save admin:", error);
    }
  };


  // Pagination logic
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
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <SideBar className={styles.sidebarItem} />
        </div>

        {/* Content */}
        <section className={`${styles.content}`}>
          <main className={styles.create_form}>
            <h4 className="mt-3 mb-5">View Stages</h4>

            {/* Loader */}
            {loading && (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">{error}</span>
                </Alert>
              </div>
            )}

            {/* No Data Message */}
            {!loading && !error && displayedStages.length === 0 && (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  No available data
                </Alert>
              </div>
            )}

            {/* Stages Table */}
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
                      // Format the createdAt date
                      const formattedCreatedAt = formatDate(stage.createdAt);

                      return (
                        <tr key={stage.id} onClick={()=>handleEdit(stage)}>
                          <td>{formattedCreatedAt}</td>
                          <td>{stage.title}</td>
                          <td>
                            {stage.description} 
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
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

                {/* Modal for Editing Admin */}
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
                            placeholder="*****" // Default placeholder for password
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="role"
                            style={{ height: '200px' }}
                            required
                            value={selectedStage.description}
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
