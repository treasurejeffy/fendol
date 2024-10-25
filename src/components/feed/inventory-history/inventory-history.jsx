import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import { Spinner, Alert, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../feed.module.scss';
import Api from '../../shared/api/apiLink';
import { FaExclamationTriangle } from "react-icons/fa";
import ReactPaginate from 'react-paginate'; // Make sure to install this library using `npm install react-paginate`

export default function InventoryHistory() {
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page starts from 0 for ReactPaginate
  const itemsPerPage = 10; // Items per page

  useEffect(() => {
    const fetchInventoryHistory = async () => {
      try {
        const response = await Api.get('/feeds-histories');
        setInventoryHistory(response.data.data); // Assuming the response contains an array of history data
      } catch (error) {
        setError("Error fetching inventory history. Please try again.");
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

  // Handle pagination changes
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Determine which items to show for the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = inventoryHistory.slice(offset, offset + itemsPerPage);

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
              <>
                <table responsive className={styles.styled_table}>
                  <thead>
                    <tr className="fw-semibold">
                      <th>DATE CREATED</th>                    
                      <th>FEED NAME</th>
                      <th>FEED TYPE</th>
                      <th>PRODUCT <br /> STAGE</th>
                      <th>QUANTITY <br /> ADDED (KG)</th>
                      <th>QUANTITY <br /> USED (KG)</th>
                      <th>QUANTITY <br /> REMAINING(KG)</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((history, index) => {
                      const formattedCreatedAt = formatDate(history.createdAt);
                      return (
                        <tr key={index}>
                          <td>{formattedCreatedAt}</td>
                          <td>{history.feedDetails.feedName}</td>
                          <td>{history.feedDetails.feedType}</td>
                          <td>{history.stage}</td>
                          <td>{history.feedDetails.quantity}</td>
                          <td>{history.quantityUsed}</td>
                          <td>{history.remainingFeed}</td>
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
                      );
                    })}
                  </tbody>
                </table>

                {/* ReactPaginate for pagination */}
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(inventoryHistory.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination justify-content-center mt-4"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </>
            )}
          </main>        
        </section>
      </div>
    </section>
  );
}
