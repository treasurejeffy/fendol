import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../admin-styles.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import Api from '../../shared/api/apiLink';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Alert, Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaTrashAlt } from "react-icons/fa";

export default function ViewAll() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [adminsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      toast.update(loadingToast, {
        render: "Failed to save admin. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 6000,
        className: 'dark-toast'
      });
    }
  };

  const handleDelete = async (adminId) => {
    const loadingToast = toast.loading("Deleting Admin...", {
      className: 'dark-toast'
    });

    if (window.confirm("Are you sure you want to delete this Admin?")) {
      try {
        await Api.delete(`/delete-admin/${adminId}`);
        toast.update(loadingToast, {
          render: "Admin deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          className: 'dark-toast'
        });
        fetchData();
      } catch (error) {
        toast.update(loadingToast, {
          render: "Failed to delete Admin. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          className: 'dark-toast'
        });
      }
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayAdmins = admins.slice(
    currentPage * adminsPerPage,
    (currentPage + 1) * adminsPerPage
  );

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
            <ToastContainer />
            <h4 className="mt-3 mb-5">All Admins</h4>
            
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">{error}</span>
                </Alert>
              </div>
            ) : admins.length === 0 ? (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">No available data</span>
                </Alert>
              </div>
            ) : (
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
                    {displayAdmins.map((admin) => (
                      <tr key={admin.id} onClick={() => handleEdit(admin)} title="Edit Admin">
                        <td>{admin.fullName}</td>
                        <td>{admin.email}</td>
                        <td className="d-flex justify-content-between">
                          <span>{admin.role}</span>
                          <FaTrashAlt
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(admin.id);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel="..."
                    pageCount={Math.ceil(admins.length / adminsPerPage)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}                  
                    onPageChange={handlePageClick}
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
              </div>
            )}
          </main>
        </section>
      </div>
    </section>
  );
}
