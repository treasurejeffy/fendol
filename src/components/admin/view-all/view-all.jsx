import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../admin-styles.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import Api from '../../shared/api/apiLink';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Alert, Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ViewAll() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const fetchData = async () => {
    try {
      const response = await Api.get('/admins');
      console.log('API Response:', response);

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


  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
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
      await Api.put(`/edit-admin/${selectedAdmin.id}`, selectedAdmin);
  
      toast.update(loadingToast, {
        render: "Admin saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        className: 'dark-toast'
      });
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save admin:", error);
  
      toast.update(loadingToast, {
        render: "Failed to save admin. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 6000,
        className: 'dark-toast'
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-semibold">Edit Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-0 pt-5">
              {selectedAdmin && (
                <Form>
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

                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Password</Form.Label>
                    <div className="col-8">
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter new password"
                          onChange={handleInputChange}
                          className={`py-2 shadow-none border-secondary-subtle border-1 border-end-0 ${styles.fadedPlaceholder}`}
                        />
                        <InputGroup.Text
                          onClick={togglePasswordVisibility}
                          className="bg-light-subtle shadow-none border-secondary-subtle border-1 border-start-0"
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3 row">
                    <Form.Label className="col-4 fw-semibold">Role</Form.Label>
                    <div className="col-8">
                      <Form.Select
                        name="role"
                        value={
                          ["Product Manager", "Inventory Manager", "Sales Manager"].includes(selectedAdmin.role)
                            ? selectedAdmin.role
                            : ""
                        }
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      >
                        <option value="" disabled>
                          Select Role
                        </option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Sales Manager">Sales Manager</option>
                      </Form.Select>
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
