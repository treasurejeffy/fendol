import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../showcase.module.scss';
import { Spinner, Alert } from 'react-bootstrap'; 
import { FaExclamationTriangle } from "react-icons/fa";
import ReactPaginate from 'react-paginate'; 
import Api from "../../shared/api/apiLink";
import { format } from 'date-fns';

export default function ViewBrokenHistory() {
  const [brokenQuantity, setBrokenQuantity] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageCount, setPageCount] = useState(0); 
  const [loadingStages, setLoadingStages] = useState(true); 
  const [loadingTable, setLoadingTable] = useState(true); 
  const [errorStages, setErrorStages] = useState(''); 
  const [errorTable, setErrorTable] = useState(''); 

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

// Function to fetch table data
const fetchTableData = async () => {
    setLoadingTable(true);
    try {
      const response = await Api.get('/show-glass/broken');
      if (response.data && response.data.data) {
        // Assuming response.data.data is an object containing the details you need
        setTableData([response.data.data]); // Wrap in array if it's a single object
        setPageCount(Math.ceil(1 / itemsPerPage)); // Adjust pagination for a single item
      } else {
        throw new Error('Expected an object with the data property');
      }
    } catch (error) {
      console.error(error);
      setErrorTable("Error fetching fish stages data.");
    } finally {
      setLoadingTable(false);
    }
  };
  
  // Function to fetch broken quantity data
  const fetchQuantityData = async () => {
    setLoadingStages(true);
    try {
      const response = await Api.get('/show-glass/total-broken');   
      // setBrokenQuantity(response); 
      setBrokenQuantity(response.data.data.totalBrokenQuantity);
    } catch (error) {
      console.error(error);
      setErrorStages("Error fetching broken quantity data.");
    } finally {
      setLoadingStages(false);
    }
  };
  
  useEffect(() => {
    fetchQuantityData();
    fetchTableData();
  }, []);

  const paginatedData = tableData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  console.log(brokenQuantity);
  
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
            <h4 className="mt-3 mb-5">View Broken Fish History</h4>

            <div className={`d-flex mb-5`}>
              {loadingStages ? (
                <div className="text-start w-25 shadow py-5 px-3">                
                    <span className="text-muted">Loading...</span>                
                </div>
              ) : errorStages ? (
                <div className="w-100">
                  <Alert variant="danger" className="text-center py-5">
                    <FaExclamationTriangle size={40} />
                    <span className="fw-semibold">{errorStages}</span>
                  </Alert>
                </div>
              ) : brokenQuantity ? (
                <div className="w-50 ">
                      <div className="w-50 px-3 shadow-sm">
                      <p className="text-end text-muted fw-semibold" style={{fontSize:'12px'}}>In Stock</p>
                      <p className="text-start text-muted fw-semibold" style={{fontSize:'14px'}}>Total Quantity</p>
                      <div className="d-flex pb-3">
                          <h1>{brokenQuantity}</h1>
                          <p className="mt-3 fw-semibold" style={{fontSize:'12px'}}>Kg</p>
                      </div>
                    </div>
                </div>
              ) : null}
            </div>

            {loadingTable ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : errorTable ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <FaExclamationTriangle size={40} />
                  <span className="fw-semibold">{errorTable}</span>
                </Alert>
              </div>
            ) : (
              <div>
                <table className={styles.styled_table}>
                  <thead className={`rounded-2 ${styles.theader}`}>
                    <tr>
                      <th>DATE CREATED</th>
                      <th>QUANTITY</th>
                      <th>TYPE</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((data, index) => (
                        <tr key={index}>
                          <td>{format(new Date(data.createdAt), 'MM/dd/yyyy')}</td>
                          <td>{data.fishQuantity}</td>
                          <td>{data.type}</td>                        
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(tableData.length / itemsPerPage)} // Use tableData instead of ledgerData
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item disabled"}
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

