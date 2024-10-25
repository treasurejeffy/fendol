import React, { useState, useEffect } from "react";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../feed.module.scss'; // Use your product styles
import { BsThreeDotsVertical } from "react-icons/bs"; // Dropdown icon
import Api from "../../shared/api/apiLink";
import { Spinner, Alert, Modal, Form, Button } from 'react-bootstrap'; // Import Bootstrap Spinner and Alert
import ReactPaginate from 'react-paginate'; // Import React Paginate
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DropdownMenu = ({ show, onClickOutside, onAddClick, onRemoveClick, onEditClick }) => {
  if (!show) return null;

  return (
    <div className={styles.dropdownMenu} onClick={onClickOutside}>
      <ul className={styles.menuList}>
        <li className={` mx-2 mt-2 rounded ${styles.menuItem}`} onClick={onAddClick}>Add feed</li>
        <li className={` mx-2 rounded ${styles.menuItem}`} onClick={onRemoveClick}>Remove feed</li>
        <li className={` mx-2 mb-2 rounded ${styles.menuItem}`} onClick={onEditClick}>Edit feed</li>
      </ul>
    </div>
  );
};

export default function UpdateFeedInventory() {
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // Loader state
  const [error, setError] = useState(''); // Error state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // Track modal type
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const itemsPerPage = 5; // Define how many items per page
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track active dropdown
  const [stages, setStages] = useState([]);
  const [quantityUsed, setQuantityUsed] = useState();
  const [quantity, setQuantity] = useState();
  const [feedPrice, setFeedPrice] = useState();
  const [stage, setStage] = useState('');
  const [thresholdValue, setThresholdValue] = useState();
  const [unit, setUnit] = useState('');
  const [disabled, setDisabled] = useState(false); // Add disabled state

  // Handle Save click in Modal
  const handleSaveClick = async () => {
    const feedName = selectedProduct?.feedName;
    const feedType = selectedProduct?.feedType;
    const id = selectedProduct?.id;
    setDisabled(true); // Disable button during API call

    const loadingToast = toast.loading("Processing your request...", {
      className: 'dark-toast'
    });

    try {
      let response;
      if (modalType === 'add') {
        // Add feed logic
        response = await Api.post(`/add?feedName=${feedName}&feedType=${feedType}`, {
          quantity,
          feedPrice
        });
        toast.update(loadingToast, {
          render: "Feed added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          className: 'dark-toast'
        });
      } else if (modalType === 'remove') {
        // Remove feed logic
        response = await Api.put(`/update/${id}`, {
         stage, quantityUsed
        });
        toast.update(loadingToast, {
          render: "Feed removed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          className: 'dark-toast'
        });
      } else if (modalType === 'edit') {
        // Edit feed logic
        response = await Api.put(`/feed/edit-threshold/${id}`, {
          thresholdValue
        });
        toast.update(loadingToast, {
          render: "Feed edited successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          className: 'dark-toast'
        });
      }

      // Reset state after successful save
      setQuantityUsed(0);
      setQuantity(0);
      setFeedPrice('');
      setStage('');
      setThresholdValue(0);
      setUnit('');
      fetchData();
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error processing the request:', error.response?.data?.message || error.message);
      
      const errorMessage = error.response?.data?.message || "Error processing the request. Please try again.";

      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 6000,
        className: 'dark-toast'
      });
    } finally {
      setDisabled(false); // Re-enable button after API call
    }
  };

  const isDisabled = !quantityUsed || !feedPrice || disabled; // Adjust disabled logic

  // fetch feeds
  const fetchData = async () => {
    try {
      const response = await Api.get('/feeds'); 
      setProducts(response.data.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.'); // Set error message if API call fails
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Fetch data from API
  useEffect(() => {


    const fetchStages = async () => {
        try {
          const response = await Api.get('/fish-stages'); // Replace with your API URL
          console.log(response.data);
          if (Array.isArray(response.data.data)) {
            setStages(response.data.data);
          } else {
            throw new Error('Expected an array of stages');
          }
        } catch (err) {
          console.log(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        } finally {
          console.log('get success')
        }
      };
  
      fetchStages();

    fetchData(); // Call the function to fetch data
  }, []);

  // Handle Add click
  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setModalType('add'); // Set modal type for Add
    setShowModal(true); // Show modal
  };

  // Handle Remove click
  const handleRemoveClick = (product) => {
    setSelectedProduct(product);
    setModalType('remove'); // Set modal type for Remove
    setShowModal(true); // Show modal
  };

  // Handle Edit click
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalType('edit'); // Set modal type for Edit
    setShowModal(true); // Show modal
  };
  


  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (productId) => {
    setActiveDropdown(activeDropdown === productId ? null : productId); // Toggle active dropdown
  };
  
  // Handle click outside dropdown
  const handleClickOutside = () => setActiveDropdown(null);

  // Handle page change for pagination
  const handlePageChange = (data) => {
    setCurrentPage(data.selected); // Update current page
  };

  // Calculate current products to display based on current page
  const currentProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
            <h4 className="mt-3 mb-5">View All</h4>
            
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
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            {!loading && !error && products.length === 0 && (
              <Alert variant="info">
                No products available.
              </Alert>
            )}

            {/* Products Table */}
            {!loading && !error && (
              <>
                <table className={styles.styled_table}>
                  <thead>
                    <tr className="fw-semibold">
                      <th>DATE CREATED</th>
                      <th>FEED NAME</th>                     
                      <th>UNIT</th>
                      <th>QUANTITY</th>
                      <th>FEED TYPE</th>
                      <th>THRESHOLD VALUE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{formatDate(product.createdAt)}</td>
                        <td>{product.feedName}</td>
                        <td>{product.unit}</td>
                        <td>{product.quantity}</td>
                        <td>{product.feedType}</td>
                        <td>{product.threshold}</td>
                        <td className="d-flex justify-content-between">
                        <span className={
                            product.status === 'in stock' 
                              ? 'text-success  text-uppercase fw-semibold' 
                              : product.status === 'out of stock' 
                              ? 'text-danger  text-uppercase fw-semibold' 
                              : product.status === 'low stock' 
                              ? 'text-warning  text-uppercase fw-semibold' 
                              : ''
                          }>
                            {product.status}
                          </span>
                          <div>
                            <BsThreeDotsVertical
                              className="me-3 cursor-pointer"
                              style={{cursor: "pointer"}}
                              onClick={() => handleDropdownToggle(product.id)}
                            />
                            <DropdownMenu 
                              show={activeDropdown === product.id} 
                              onClickOutside={handleClickOutside} 
                              onAddClick={() => handleAddClick(product)}
                              onRemoveClick={() => handleRemoveClick(product)}
                              onEditClick={() => handleEditClick(product)} 
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    previousLabel={"< "}
                    nextLabel={" >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(products.length / itemsPerPage)}
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

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} className="rounded-0">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-semibold">
              {modalType === 'add' ? 'Add Feed' : modalType === 'remove' ? 'Remove Feed' : 'Edit Feed'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="mt-5">
            {/* Feed Name */}
            <Form.Group className="mb-3 row">
              <Form.Label className="col-4">Feed Name</Form.Label>
              <div className="col-8">
                <Form.Control 
                  type="text" 
                  readOnly 
                  defaultValue={selectedProduct?.feedName} 
                  className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                />
              </div>
            </Form.Group>

            {/* Feed Type */}
            <Form.Group className="mb-3 row">
              <Form.Label className="col-4">Feed Type</Form.Label>
              <div className="col-8">
                <Form.Control 
                  type="text" 
                  readOnly 
                  defaultValue={selectedProduct?.feedType} 
                  className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                />
              </div>
            </Form.Group>

            {/* Add Feed (Quantity and Price Bought) */}
            {modalType === 'add' && (
              <>
                {/* Quantity */}
                <Form.Group className="mb-3 row">
                  <Form.Label className="col-4">Quantity (kg)</Form.Label>
                  <div className="col-8">
                    <Form.Control 
                      type="number" 
                      required 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))} 
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                      placeholder="Quantity (kg)" 
                    />
                  </div>
                </Form.Group>

                {/* Price Bought */}
                <Form.Group className="mb-3 row">
                  <Form.Label className="col-4">Price Bought</Form.Label>
                  <div className="col-8">
                    <Form.Control 
                      type="number" 
                      required 
                      value={feedPrice} 
                      onChange={(e) => setFeedPrice(e.target.value)} 
                      placeholder="Price Bought" 
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                    />
                  </div>
                </Form.Group>
              </>
            )}

            {/* Remove Feed (Stage and Quantity) */}
            {modalType === 'remove' && (
              <>
                {/* Product Stage */}
                <Form.Group className="mb-3 row">
                  <Form.Label className="col-4">Product Stage</Form.Label>
                  <div className="col-8">
                    <Form.Select
                      name="stage"
                      required
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                    >
                       <option value="" disabled>Choose Stage</option>
                        {!stages ? (
                            <option>Please wait...</option>
                        ) : stages.length < 1 ? (
                            <option>No data available</option>
                        ) : (
                            stages.map((stage, index) => (
                                <option value={stage.title} key={index}>{stage.title}</option>
                            ))
                        )}
                    </Form.Select>
                  </div>
                </Form.Group>

                {/* Quantity */}
                <Form.Group className="mb-4 row">
                  <Form.Label className="col-4">Quantity</Form.Label>
                  <div className="col-8">
                    <Form.Control 
                      type="number" 
                      value={quantityUsed} 
                      onChange={(e) => setQuantityUsed(Number(e.target.value))} 
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                      placeholder="Quantity" 
                    />
                  </div>
                </Form.Group>
              </>
            )}

            {/* Edit Feed (Threshold Value and Unit) */}
            {modalType === 'edit' && (
              <>
                {/* Threshold Value */}
                <Form.Group className="mb-3 row">
                  <Form.Label className="col-4">Threshold Value</Form.Label>
                  <div className="col-8">
                    <Form.Control 
                      type="text" 
                      placeholder="Threshold Value" 
                      required 
                      value={thresholdValue} 
                      onChange={(e) => setThresholdValue(Number(e.target.value))} 
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                    />
                  </div>
                </Form.Group>

                {/* Unit */}
                <Form.Group className="mb-3 row">
                  <Form.Label className="col-4">Unit</Form.Label>
                  <div className="col-8">
                    <Form.Control 
                      type="text" 
                      readOnly 
                      defaultValue={selectedProduct?.unit} 
                      className={`py-2 shadow-none border-secondary-subtle border-1 ${styles.inputs}`} 
                    />
                  </div>
                </Form.Group>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="mt-5 mb-3 border-0">
            <Button className={`px-5 btn-dark fw-semibold`} onClick={handleSaveClick}>
              {modalType === 'add' ? 'Add Feed' : modalType === 'remove' ? 'Remove Feed' : 'Edit Feed'}
            </Button>
            <ToastContainer /> {/* Include ToastContainer for notifications */}
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}