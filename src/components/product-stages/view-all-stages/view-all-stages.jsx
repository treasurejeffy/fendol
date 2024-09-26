import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { BsThreeDotsVertical,BsExclamationTriangleFill } from "react-icons/bs";
import axios from "axios";
import { Spinner, Alert } from 'react-bootstrap';

const DropdownMenu = ({ show, onClickOutside, onEdit, onDelete }) => {
  if (!show) return null;

  return (
    <div className={styles.dropdownMenu} onClick={onClickOutside}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={onEdit}>Edit Stage</li>
        <li className={styles.menuItem} onClick={onDelete}>Delete Stage</li>
      </ul>
    </div>
  );
};

export default function ViewAllStages() {
  const [stages, setStages] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all stages from the API
    const fetchStages = async () => {
      try {
        const response = await axios.get('YOUR_API_URL'); // Replace with your API URL
        setStages(response.data); // Assuming response.data is an array of stages
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  const handleDropdownToggle = (index) => {
    setDropdownVisible((prev) => (prev === index ? null : index));
  };

  const handleClickOutside = () => {
    setDropdownVisible(null);
  };

  const handleEditStage = (stage) => {
    console.log('Editing stage:', stage);
    // Implement your edit stage logic here
  };

  const handleDeleteStage = async (stage) => {
    try {
      await axios.delete(`YOUR_API_URL/${stage.id}`); // Replace with your delete API endpoint
      setStages((prev) => prev.filter((item) => item.id !== stage.id));
      console.log('Stage deleted successfully');
    } catch (err) {
      console.error('Failed to delete stage:', err);
    }
  };

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

            {/* Stages Table */}
            {!loading && !error && (
              <table className={styles.styled_table}>
                <thead>
                  <tr>
                    <th>DATE CREATED</th>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((stage, index) => (
                    <tr key={index}>
                      <td>{stage.dateCreated}</td>
                      <td>{stage.id}</td>
                      <td>{stage.name}</td>
                      <td className="d-flex justify-content-between align-items-center">
                        <span>{stage.description}</span>
                        <div className="position-relative">
                          <BsThreeDotsVertical
                            className="me-3 cursor-pointer"
                            onClick={() => handleDropdownToggle(index)} // Pass index to toggle
                          />
                          <DropdownMenu
                            show={dropdownVisible === index} // Show menu only for active index
                            onClickOutside={handleClickOutside}
                            onEdit={() => handleEditStage(stage)} // Pass the stage object
                            onDelete={() => handleDeleteStage(stage)} // Pass the stage object
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
