import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from 'axios';
import { Spinner, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ViewMoveFishHistory() {
  const [moveFishHistory, setMoveFishHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoveFishHistory = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const response = await axios.get('YOUR_API_ENDPOINT'); 
        setMoveFishHistory(response.data); // Assuming the response contains an array of history data
      } catch (error) {
        setError("Error fetching move fish history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMoveFishHistory();
  }, []);

  return (
    <section className={`d-none d-lg-block ${styles.body}`} >
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
            
            {/* Table */}
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" />
              </div>
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <FaExclamationTriangle size={40}/><span className="fw-semibold">{error}</span>
              </Alert>
              </div>
            ) : (
              <table className={styles.styled_table}> 
                <thead>
                  <tr>
                    <th>DATE CREATED</th>
                    <th>STAGE FROM</th>
                    <th>STAGE TO</th>
                    <th>QUANTITY</th>
                    <th>REMARK</th>
                  </tr>
                </thead>
                <tbody>
                  {moveFishHistory.map((history, index) => (
                    <tr key={index}>
                      <td>{history.dateCreated}</td>
                      <td>{history.stageFrom}</td>
                      <td>{history.stageTo}</td>
                      <td>{history.quantity}</td>
                      <td>{history.remark}</td>
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
