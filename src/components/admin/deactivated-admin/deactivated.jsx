import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../admin-styles.module.scss';
import { BsThreeDotsVertical, BsExclamationTriangleFill } from "react-icons/bs";
import axios from "axios";
import { Spinner, Alert } from 'react-bootstrap';

const DropdownMenu = ({ show, onClickOutside, onRestore, onDelete }) => {
  if (!show) return null;

  return (
    <div className={styles.dropdownMenu} onClick={onClickOutside}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={onRestore}>Restore</li>
        <li className={styles.menuItem} onClick={onDelete}>Delete</li>
      </ul>
    </div>
  );
};

export default function Deactivated() {
  const [deactivatedAdmins, setDeactivatedAdmins] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeactivatedAdmins = async () => {
      try {
        const response = await axios.get('YOUR_API_URL'); // Replace with your API URL
        setDeactivatedAdmins(response.data); // Assuming response.data is an array of deactivated admins
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeactivatedAdmins();
  }, []);

  const handleDropdownToggle = (index) => {
    setDropdownVisible((prev) => (prev === index ? null : index));
  };

  const handleClickOutside = () => {
    setDropdownVisible(null);
  };

  const handleRestore = async (admin) => {
    try {
      await axios.post(`YOUR_API_URL/${admin.id}/restore`); // Replace with your restore API endpoint
      setDeactivatedAdmins((prev) =>
        prev.filter((item) => item.id !== admin.id)
      );
      console.log('Admin restored successfully');
    } catch (err) {
      console.error('Failed to restore admin:', err);
    }
  };

  const handleDelete = async (admin) => {
    try {
      await axios.delete(`YOUR_API_URL/${admin.id}`); // Replace with your delete API endpoint
      setDeactivatedAdmins((prev) =>
        prev.filter((item) => item.id !== admin.id)
      );
      console.log('Admin deleted successfully');
    } catch (err) {
      console.error('Failed to delete admin:', err);
    }
  };

  return (
    <section className={`d-none d-lg-block  ${styles.body}`}>
      <div className="sticky-top">
        <Header />
      </div>
      <div className="d-flex gap-2">
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <SideBar className={styles.sidebarItem} />
        </div>

        {/* Content */}
        <section className={`${styles.content} `}>
          <main className={styles.create_form}>
            <h4 className="mt-3 mb-5">Deactivated Admins</h4>

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

            {/* Deactivated Admins Table */}
            {!loading && !error && (
              <table className={styles.styled_table}>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>E-MAIL</th>
                    <th>ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  {deactivatedAdmins.map((admin, index) => (
                    <tr key={index}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td className="d-flex justify-content-between align-items-center">
                        <span>{admin.role}</span>
                        <div className="position-relative">
                          <BsThreeDotsVertical
                            className="me-3 cursor-pointer"
                            onClick={() => handleDropdownToggle(index)} // Pass index to the function
                          />
                          <DropdownMenu
                            show={dropdownVisible === index} // Show menu only for active index
                            onClickOutside={handleClickOutside}
                            onRestore={() => handleRestore(admin)} // Pass the admin object
                            onDelete={() => handleDelete(admin)} // Pass the admin object
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </main>
        </section>
      </div>
    </section>
  );
}
