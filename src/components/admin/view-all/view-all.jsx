import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../admin-styles.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import Api from '../../shared/api/apiLink';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Alert, Modal, Button, Form } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ViewAll() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5); // Change as needed
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For the modal
  const [showModal, setShowModal] = useState(false); // Modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('/admins');
        console.log('API Response:', response); // Log the response for debugging

        if (Array.isArray(response.data.data)) {
          setAdmins(response.data.data);
        } else {
          throw new Error("Expected an array of admins");
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Ensuring it only runs once

  const handleEdit = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin data
    setShowModal(true); // Show the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdmin({
      ...selectedAdmin,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const loadingToast = toast.loading("Saving Admin...", {
      className: 'dark-toast'
    });
  
    try {
      // API call to save the admin details
      await Api.put(`/admins/${selectedAdmin.id}`, selectedAdmin);
  
      // On successful API call
      toast.update(loadingToast, {
        render: "Admin saved successfully!",
        type: "success", // Use string for type
        isLoading: false,
        autoClose: 3000, // Close after 3 seconds
        className: 'dark-toast'
      });
  
      setShowModal(false); // Close the modal after saving
    } catch (error) {
      console.error("Failed to save admin:", error);
  
      // Display error toast
      toast.update(loadingToast, {
        render: "Failed to save admin. Please try again.",
        type: "error", // Use string for type
        isLoading: false,
        autoClose: 6000, // Close after 6 seconds
        className: 'dark-toast'
      });
    }
  };
  

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(admins.length / adminsPerPage);

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
            <h4 className="mt-3 mb-5">All Admins</h4>
            
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

            {!loading && !error && admins.length === 0 && (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">No available data</span>
                </Alert>
              </div>
            )}

            {!loading && !error && (
              <div>
                <table className={styles.styled_table}>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>E-MAIL</th>
                      <th>ROLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAdmins.map((admin, index) => (
                      <tr key={index} onClick={() => handleEdit(admin)}>
                        <td>{admin.fullName}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center mt-3 align-items-center">
                  <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="btn btn-light me-2"
                  >
                    <FaArrowLeft/>
                  </button>
                  <span >{` ${currentPage} ${totalPages}`}</span>
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="btn btn-light ms-2"
                  >
                   <FaArrowRight/>
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Modal for Editing Admin */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-semibold">Edit Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-0 pt-5">
              {selectedAdmin && (
                <Form>
                  {/* Full Name */}
                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Full Name</Form.Label>
                    <div className="col-8">
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={selectedAdmin.fullName}
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />
                    </div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Email</Form.Label>
                    <div className="col-8">
                      <Form.Control
                        type="email"
                        name="email"
                        value={selectedAdmin.email}
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />
                    </div>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Password</Form.Label>
                    <div className="col-8">
                      <Form.Control
                        type="password"
                        name="password"
                        value={selectedAdmin.password || ''}
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />
                    </div>
                  </Form.Group>

                  {/* Role */}
                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Role</Form.Label>
                    <div className="col-8">
                      <Form.Control
                        type="text"
                        name="role"
                        value={selectedAdmin.role}
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />
                    </div>
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0 mt-5" style={{height: '200px'}} >
              <Button variant="dark" className="px-5" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      </div>
    </section>
  );
}
