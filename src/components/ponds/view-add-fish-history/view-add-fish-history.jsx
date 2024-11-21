import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../product-stages.module.scss';
import { Spinner, Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from "react-icons/fa";
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate'; // Import ReactPaginate

export default function ViewAddFishHistory() {
  const [tableData, setTableData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorTable, setErrorTable] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const itemsPerPage = 10; // Number of items per page


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await Api.get('fishes');
        setTableData(response.data.data);
      } catch (error) {
        setErrorTable("Error fetching add fish history data.");
      } finally {
        setLoadingTable(false);
      }
    };
    fetchTableData();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle page change
  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  // Calculate current items
  const currentItems = tableData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const pageCount = Math.ceil(tableData.length / itemsPerPage); // Total number of pages

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
            <h4 className="mt-3 mb-5">View Add Fish History</h4>
                         

            {loadingTable && (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {errorTable && (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <FaExclamationTriangle size={40} /><span className="fw-semibold">{errorTable}</span>
                </Alert>
              </div>
            )}
            {!loadingTable && !errorTable && (
              <>
                <table className={`mt-5 ${styles.styled_table}`}>
                  <thead className={`rounded-2 ${styles.theader}`}>
                    <tr>
                      <th>DATE CREATED</th>
                      <th>POND</th>
                      <th>QUANTITY ADDED</th>
                      <th>FISH TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((data, index) => {
                        const formattedDate = formatDate(data.createdAt);
                        return (
                          <tr key={index}>
                            <td>{formattedDate}</td>
                            <td>{data.stageTitle}</td>
                            <td>{data.quantity}</td>
                            <td>{data.speciesName}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
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
                </div>
              </>
            )}
          </main>
        </section>
      </div>
    </section>
  );
}
