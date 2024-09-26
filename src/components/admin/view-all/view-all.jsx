import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../admin-styles.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import Api from '../../shared/api/apiLink';
import { Spinner, Alert } from 'react-bootstrap';

const DropdownMenu = ({ show, onClickOutside, onEdit, onDeactivate }) => {
  if (!show) return null;

  return (
    <div className={styles.dropdownMenu} onClick={onClickOutside}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={onEdit}>Edit</li>
        <li className={styles.menuItem} onClick={onDeactivate}>Deactivate</li>
      </ul>
    </div>
  );
};

export default function ViewAll() {
  const [admins, setAdmins] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5); // Change as needed

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


  const handleDropdownToggle = (index) => {
    setDropdownVisible((prev) => (prev === index ? null : index));
  };

  const handleClickOutside = () => {
    setDropdownVisible(null);
  };

  const handleEdit = (admin) => {
    console.log('Edit Admin:', admin);
  };

  const handleDeactivate = async (admin) => {
    try {
      await Api.post(`YOUR_API_URL/${admin.id}/deactivate`);
      setAdmins((prev) => prev.map((item) =>
        item.id === admin.id ? { ...item, status: 'deactivated' } : item
      ));
      console.log('Admin deactivated successfully');
    } catch (err) {
      console.error('Failed to deactivate admin:', err);
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
                      <tr key={index}>
                        <td>{admin.fullName}</td>
                        <td>{admin.email}</td>
                        <td className="d-flex justify-content-between align-items-center">
                          <span>{admin.role}</span>
                          <div className="position-relative">
                            <BsThreeDotsVertical
                              className="me-3 cursor-pointer"
                              onClick={() => handleDropdownToggle(index)} 
                            />
                            <DropdownMenu
                              show={dropdownVisible === index}
                              onClickOutside={handleClickOutside}
                              onEdit={() => handleEdit(admin)} 
                              onDeactivate={() => handleDeactivate(admin)} 
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center mt-3">
                  <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="btn btn-primary me-2"
                  >
                    Previous
                  </button>
                  <span>{` ${currentPage} ${totalPages}`}</span>
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="btn btn-primary ms-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </section>
      </div>
    </section>
  );
}
