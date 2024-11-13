import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import { Spinner, Alert, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../store.module.scss';
import Api from '../../shared/api/apiLink';
import { FaExclamationTriangle } from "react-icons/fa";

export default function InventoryHistory() {
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventoryHistory = async () => {
      try {
        const response = await Api.get('/stores-histories'); 
        setInventoryHistory(response.data.data); // Assuming the response contains an array of history data
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryHistory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

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
            <h4 className="mt-3 mb-5">Store Inventory History</h4>
            
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
              <table responsive className={styles.styled_table}> 
                <thead>
                  <tr className="fw-semibold">
                    <th>DATE CREATED</th>                    
                    <th>NAME</th>
                    <th>POND</th>
                    <th>QUANTITY <br /> ADDED (KG)</th>
                    <th>QUANTITY <br /> USED (KG)</th>
                    <th>QUANTITY <br /> REMAINING(KG)</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryHistory.map((history, index) => {
                     const formattedCreatedAt = formatDate(history.createdAt);
                     return(
                      <tr key={index}>
                        <td>{formattedCreatedAt}</td>
                        <td>{history.name}</td>
                        <td>{history.quantityUsed}</td>
                        <td>{history.storeDetails.quantity}</td>
                        <td>{history.quantityUsed}</td>
                        <td>{history.remainingStock}</td>
                        <td className="text-uppercase fw-semibold d-flex">
                          <span className={
                            history.status === 'in stock' 
                              ? 'text-success' 
                              : history.status === 'out of stock' 
                              ? 'text-danger' 
                              : history.status === 'low stock' 
                              ? 'text-warning' 
                              : ''
                          }>
                            {history.status}
                          </span>
                        </td>

                      </tr>
                     )                    
                  })}
                </tbody>
              </table>
            )}
          </main>        
        </section>
      </div>
    </section>
  );
}
