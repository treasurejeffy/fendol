import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../customer.module.scss'; 
import { BsExclamationTriangleFill } from "react-icons/bs";
import { Spinner, Alert, Modal,Form,Button } from 'react-bootstrap';
import Api from "../../shared/api/apiLink";
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { IoFilterOutline } from "react-icons/io5";

const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [filterData, setFilterData] = useState({
    fullName: '',
    category: '',
    date: '',
    paymentType: ''
  });
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const response = await Api.get('/customers-ledger'); 
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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB');
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const displayedLedgerData = ledgerData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (displayedLedgerData.length > 0) {
      setBalance(displayedLedgerData[0].balanceWithRollover);
    }
  }, [displayedLedgerData]);

  const handleShow = () => {    
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  // filter function
  const handleSave = async(e)=>{  
    e.preventDefault();
        setLoader(true);
        
        const loadingToast = toast.loading("Filtering Ledger...", {
            className: 'dark-toast'
        });
    
        try {
            const response = await Api.get(`/filter?category=${filterData.category}&fullName=${filterData.fullName}&paymentType=${filterData.paymentType}&date=${filterData.date}`, );
            const { message } = response.data;
            setLedgerData(response.data.data);            

            toast.update(loadingToast, {
                render: message || "Filtered Successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            setFilterData({
              fullName: '',
              category: '',
              paymentType:'',
              date: ''
            })
            setShowModal(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error filtering ledger. Please try again.";
            toast.update(loadingToast, {
                render: errorMessage,
                type: "error",
                isLoading: false,
                autoClose: 6000,
                className: 'dark-toast'
            });
        } finally {
            setLoader(false);
        }
  }

  return (
    <section className={`d-none d-lg-block ${styles.body}`}>
      <div className="sticky-top">
        <Header />
      </div>
      <div className="d-flex gap-2">
        <div className={styles.sidebar}>
          <SideBar className={styles.sidebarItem} />
        </div>

        <section className={styles.content}>
          <main className={styles.create_form}>
            <div className="d-flex justify-content-between mt-3 mb-5"><h4>Ledger</h4> <button onClick={handleShow} className="btn btn-dark border-0 px-4 fw-semibold">  <IoFilterOutline className="mb-1" size={17}/> Filter</button></div>

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

            {!loading && !error && ledgerData.length === 0 && (
              <div className="d-flex justify-content-center">
                <Alert variant="info" className="text-center w-50 py-5">
                  No available data
                </Alert>
              </div>
            )}

            {!loading && !error && displayedLedgerData.length > 0 && (
              <>
                <table className={styles.styled_table}>
                  <thead className={`rounded-2 ${styles.theader}`}>
                    <tr>
                      <th>DATE</th>
                      <th>NAME</th>
                      <th>CATEGORY</th>
                      <th>PRODUCT</th>
                      <th>QUANTITY</th>
                      <th>PAYMENT TYPE</th>
                      <th style={{ color: 'green' }}>CREDIT(₦)</th>
                      <th style={{ color: 'red' }}>DEBIT(₦)</th>
                      <th>BALANCE(₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedLedgerData.map((record, index) => (
                      <tr key={index}>
                        <td>{formatDate(record.date)}</td>                      
                        <td>{record.fullName}</td>
                        <td>{record.category}</td>
                        <td>{record.productName}</td>
                        <td>{record.quantity}</td>
                        <td>{record.paymentType}</td>
                        <td style={{ color: 'green' }}>{record.credit || '-'}</td>
                        <td style={{ color: 'red' }}>{record.debit || '-'}</td>
                        <td>{record.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
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
                    activeClassName={"active"}
                  />
                </div>
              </>
            )}
          </main>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-semibold">Filter Customer Ledger</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-0 pt-5">
                <Form>
                  <Form.Group className="mb-3 ">
                    <Form.Label className=" fw-semibold">Filter By Full Name</Form.Label>                   
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Enter Full Name"
                        value={filterData.fullName}
                        onChange={handleInputChange}
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />               
                  </Form.Group>

                  <Form.Group className="mb-3">                    
                    <Form.Label className="fw-semibold">Filter By Category</Form.Label>
                      <Form.Select
                          className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                          name="category"
                          value={filterData.category}
                          onChange={handleInputChange}
                          required
                      >
                          <option value="" disabled>Select Category</option>
                          <option value="Marketer">Marketer</option>
                          <option value="Customer">Customer</option>
                      </Form.Select>                    
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Filter By Date</Form.Label>                                      
                      <Form.Control
                        type='date'
                        name="date"
                        value={filterData.date}
                        onChange={handleInputChange}                                       
                        className="py-2 shadow-none border-secondary-subtle border-1"
                      />                                          
                  </Form.Group>

                  <Form.Label className="fw-semibold">Filter By Payment Type</Form.Label>
                    <Form.Select
                        name="paymentType"
                        value={filterData.paymentType}
                        onChange={handleInputChange}
                        required
                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                    >
                        <option value="" disabled>Select Payment Type</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit">Credit</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Pos">Pos</option>
                  </Form.Select>
                </Form>              
            </Modal.Body>
            <Modal.Footer className="border-0 d-flex gap-4 justify-content-end mb-4 mt-5">
              <button disabled={loader} className="btn btn-light bg-light border-1 border-secondary  px-4" onClick={()=>{setFilterData({fullName:'', category:'', date:'', paymentType:''})}}>
                  Clear Filter
              </button>
              <Button variant="dark" className="text-white px-5" disabled={loader} onClick={handleSave}>
                Filter
              </Button>
            </Modal.Footer>
          </Modal>
          <ToastContainer />
        </section>
      </div>
    </section>
  );
};

export default CustomerLedger;
