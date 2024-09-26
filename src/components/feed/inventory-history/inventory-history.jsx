import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import { Spinner, Alert, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../feed.module.scss';
import axios from 'axios';
import { FaExclamationTriangle } from "react-icons/fa";

export default function InventoryHistory() {
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventoryHistory = async () => {
      try {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const response = await axios.get('YOUR_API_ENDPOINT'); 
        setInventoryHistory(response.data); // Assuming the response contains an array of history data
      } catch (error) {
        setError("Error fetching inventory history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryHistory();
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
            <h4 className="mt-3 mb-5">Feed Inventory History</h4>
            
            {/* Table */}
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" />
              </div>
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5 my-5">
                   <FaExclamationTriangle size={30}/> <span>{error}</span>
                </Alert>
              </div>
            ) : (
              <Table responsive className={styles.styled_table}> 
                <thead>
                  <tr>
                    <th>DATE CREATED</th>
                    <th>QUANTITY <br /> USED (KG)</th>
                    <th>FEED NAME</th>
                    <th>PRODUCT STAGE</th>
                    <th>QUANTITY <br /> REMAINING(KG)</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryHistory.map((history, index) => (
                    <tr key={index}>
                      <td>{history.dateCreated}</td>
                      <td>{history.quantityUsed}</td>
                      <td>{history.feedName}</td>
                      <td>{history.productStage}</td>
                      <td>{history.quantityRemaining}</td>
                      <td>{history.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </main>        
        </section>
      </div>
    </section>
  );
}
