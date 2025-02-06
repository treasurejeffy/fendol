import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../showcase.module.scss";
import { Spinner, Alert, Button, Modal, Form, Dropdown } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { BsThreeDotsVertical} from "react-icons/bs"; // Dropdown icon
import ReactPaginate from "react-paginate";
import Api from "../../shared/api/apiLink";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewWholeHistory() {
  const [brokenQuantity, setBrokenQuantity] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingStages, setLoadingStages] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorStages, setErrorStages] = useState("");
  const [errorTable, setErrorTable] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'damage' or 'broken'
  const [brokenFishQuantity, setBrokenFishQuantity] = useState("");
  const [damageFishQuantity, setDamageFishQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetchTableData = async () => {
    setLoadingTable(true);
    try {
      const response = await Api.get("/show-glass/whole");
      if (response.data && response.data.data) {
        setTableData(response.data.data);
      } else {
        throw new Error("Expected an object with the data property");
      }
    } catch (error) {
      console.error(error);
      setErrorTable(error.response?.data?.message || "Error getting showcase data.");
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchQuantityData = async () => {
    setLoadingStages(true);
    try {
      const response = await Api.get("/show-glass/total-whole");
      if (response.data && typeof response.data.data.totalWholeQuantity === "number") {
        setBrokenQuantity(response.data.data.totalWholeQuantity);
      } else {
        throw new Error("Expected totalWholeQuantity to be a number");
      }
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

  const handleShowModal = (type) => {
    setModalType(type);
    setBrokenFishQuantity("");
    setRemarks("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Moving...");
  
    const quantity = modalType === "damage" ? damageFishQuantity : brokenFishQuantity;
    if (!quantity || !remarks) {
      toast.update(loadingToast, {
        render: 'Please fill in all fields.',
        type: "error",
        isLoading: false,
        autoClose: 3000,
        className: 'dark-toast'
      });
      setLoading(false);
      return;
    }
  
    try {
      const endpoint = modalType === "damage" ? "/move-to-damage" : "/move-to-broken";        
      const payload =
      modalType === "damage"
        ? { damagedFishQuantity: Number(damageFishQuantity), remarks }
        : { brokenFishQuantity: Number(brokenFishQuantity), remarks };
  
      await Api.post(endpoint, payload);
      toast.update(loadingToast, {
        render: "OPERATION SUCCESSFUL!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        className: 'dark-toast'
      });
      
      setDamageFishQuantity('');
      setBrokenFishQuantity('');
      setRemarks('');
      fetchTableData(); // Refresh table data after successful submission
      fetchQuantityData(); // Refresh quantity data after successful submission
      handleCloseModal();
    } catch (error) {
      toast.update(loadingToast, {
        render: error.response.data.message || 'An error occurred while performing the action.',
        type: "error",
        isLoading: false,
        autoClose: 3000,
        className: 'dark-toast'
      });
    } finally {
      setLoading(false);
    }
  };
  

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const paginatedData = tableData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
            <h4 className="mt-3 mb-5">View Whole Fish History</h4>

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
              ) : (
                brokenQuantity && (
                  <div className="w-50">
                    <div className="w-50 px-3 shadow">
                      <div className="d-flex justify-content-between pt-2">
                        <p className="text-muted fw-semibold" style={{ fontSize: "12px" }}>
                          In Stock
                        </p>
                        <Dropdown>
                          <Dropdown.Toggle as="span" id="dropdown-custom-components">
                            <BsThreeDotsVertical
                              className="m-1 cursor-pointer"
                              style={{ cursor: "pointer" }}
                            />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item  variant='light' onClick={() => handleShowModal("damage")}>
                              Move to Damage
                            </Dropdown.Item>
                            <Dropdown.Item variant='light' onClick={() => handleShowModal("broken")}>
                              Move to Broken
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <p className="text-start text-muted fw-semibold" style={{ fontSize: "14px" }}>
                        Total Quantity
                      </p>
                      <div className="d-flex pb-3">
                        <h1>{brokenQuantity}</h1>
                        <p className="mt-3 fw-semibold" style={{ fontSize: "12px" }}>
                          pieces
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
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
                      <th className="text-end pe-4">QUANTITY</th>                     
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((data, index) => (
                        <tr key={index}>
                          <td>{formatDate(data.updatedAt)}</td>
                          <td className="text-end pe-4">{data.wholeFishQuantity}</td>                          
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(tableData.length / itemsPerPage)}
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

        <Modal show={showModal} onHide={handleCloseModal}>
          <ToastContainer/>
          <Modal.Header closeButton  className='border-0'>
            <Modal.Title>
              {modalType === "damage" ? "Move to Damage" : "Move to Broken"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='border-0'>
            <h5 className="text-end fw-semibold"><span className='fs-6 fw-semibold'>Total Quatity: </span>{brokenQuantity}</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={modalType === "damage" ? damageFishQuantity : brokenFishQuantity}
                  onChange={(e) => modalType === "damage" ? setDamageFishQuantity(e.target.value) : setBrokenFishQuantity(e.target.value)}
                  className="py-2 shadow-none border-secondary-subtle border-1"
                />
              </Form.Group>
              <Form.Group className="mb3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="py-2 shadow-none border-secondary-subtle border-1"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" className={`border-0 btn-dark shadow py-2 px-3 fs-6 fw-semibold ${styles.submit}`} onClick={handleSubmit} disabled={loading}>
              Move
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}