import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../finance.module.scss'; // Adjust your styles module
import { BsExclamationTriangleFill } from "react-icons/bs";
import { Spinner, Alert } from 'react-bootstrap';
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate';

const FinanceLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Adjust this number as needed
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const response = await Api.get('/ledger'); // Replace with your API URL
        if (Array.isArray(response.data.data)) {
          setLedgerData(response.data.data);
        } else {
          throw new Error('Expected an array of ledger data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, []);

  // Format date function
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Pagination logic
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedLedgerData = ledgerData.slice(startIndex, endIndex);

  useEffect(() => {
    if (displayedLedgerData.length > 0) {
      // Set the balance from the first entry (or any logic you'd prefer)
      setBalance(displayedLedgerData[0].balanceWithRollover);
    }
  }, [displayedLedgerData]);

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
            <h4 className="mt-3 mb-5">Finance Ledger</h4>

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

            {!loading && !error && ledgerData.length === 0 && (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  No available data
                </Alert>
              </div>
            )}

            {/* Ledger Table */}
            {!loading && !error && displayedLedgerData.length > 0 && (
              <>              
                <table className={styles.styled_table}>
                  <thead  className={`rounded-2 ${styles.theader}`}>
                    <tr>
                      <th>DATE</th>
                      <th className="pt-3">PRODUCT</th>
                      <th className="pt-3">DESCRIPTION</th>
                      <th className="pt-3">QUANTITY</th>
                      <th style={{ color: 'green' }} className="pt-3">CREDIT(₦)</th>
                      <th  style={{ color: 'red' }} className="pt-3">DEBIT(₦)</th>
                      <th >BALANCE(₦)</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {displayedLedgerData.map((record,index) => {
                      const formattedDate = formatDate(record.date);                    
                      return (
                        <React.Fragment key={record.date}> 
                            <tr key={index}>
                              <td>{formatDate(record.date)}</td>
                              <td>{record.productName}</td>
                              <td>{record.description || 'No description'}</td>
                              <td>{record.quantity}</td>
                              <td style={{ color: 'green' }}>{record.credit ? `₦${record.credit}` : '-'}</td>
                              <td style={{ color: 'red' }}>{record.debit ? `₦${record.debit}` : '-'}</td>
                              <td>{`₦${record.balance}`}</td>
                            </tr>                          
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"< "}
                    nextLabel={" >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(ledgerData.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
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
                    activeClassName={"dark"}
                  />
                </div>
              </>
            )}
          </main>
        </section>
      </div>
    </section>
  );
};

export default FinanceLedger;
