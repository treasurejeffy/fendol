import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { BsExclamationTriangleFill } from "react-icons/bs";
import { Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';


const ViewAllStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter stages based on the search term
  const filteredStages = stages.filter(stage => 
    (stage.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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


  // Get the stages to be displayed based on current page
  const displayedStages = filteredStages.slice(startIndex, endIndex);

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
            <div className="d-flex justify-content-between">
              <h4 className="mt-3 mb-5">View Ponds</h4>

              {/* Search input field */}
              <div className="w-50s">
              <input
                  type="text"
                  className="form-control mb-3 shadow-none border-secondary"
                  placeholder="Search by Pond...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />
              </div>
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

            {!loading && !error && filteredStages.length === 0 && (
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
                      <th>Description</th>                                     
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStages.map((stage) => {
                      const formattedCreatedAt = formatDate(stage.createdAt);
                      return (
                        <tr key={stage.id} style={{cursor: 'pointer'}} onClick={()=>{handleEditStage(stage)}}>
                          <td>{formattedCreatedAt}</td>
                          <td>{stage.title}</td>
                          <td>{stage.description}</td>                                                             
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
                    pageCount={Math.ceil(filteredStages.length / itemsPerPage)}
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
                    activeClassName={"active-light"}
                  />
                </div>
              </>
            )}
          </main>
        </section>
      </div>
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
  );
};

export default ViewAllStages;
