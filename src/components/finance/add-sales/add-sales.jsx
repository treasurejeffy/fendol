import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import styles from '../finance.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import Api from '../../shared/api/apiLink';

const AddSales = () => {
    const [dryData, setDryData] = useState({
        productName: "",
        quantity: 0,
        description: ""
    });

    const [freshData, setFreshData] = useState({        
        productName:"",
        productWeight: 0,
        quantity: 0,
        description: "",
        stageId_from: ""        
    })

    const [fingerlingsData, setFingerlingsData] = useState(
        {
            productName:"",
            quantity: 0,
            description:"",
            stageId_from : ""
        }
    )
    const [loader, setLoader] = useState(false);
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState(null);
    const [salesType, setSalesType] = useState('Type'); 
    const [stages, setStages] = useState([]);

    // Fetch stages
    const fetchStages = async () => {
        try {
            const response = await Api.get('/fish-stages');
            if (Array.isArray(response.data.data)) {
                setStages(response.data.data);
            } else {
                throw new Error('Expected an array of stages');
            }
        } catch (err) {
            console.log(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        }
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Api.get('/products'); // Adjust the API endpoint as necessary
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
        fetchStages();
    }, []);

        // Handle input changes for dryData
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setDryData({
                ...dryData,
                [name]: value ? value : parseFloat(value)
            });
        };

        // freshData input changes
        const handleInputChangeFresh = (e) => {
            const { name, value } = e.target;
            setFreshData({
                ...freshData,
                [name]: value ? value : parseFloat(value)
            });
        };

        // fingerlingsData control input
        const handleInputChangeFingerlings = (e) => {
            const { name, value } = e.target;
            setFingerlingsData({
                ...fingerlingsData,
                [name]: value ? value : parseFloat(value)
            });
        };


    // Fetch product details when a product is selected
    const handleProductSelect = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedProductName = e.target.value;
        const selectedProductId = selectedOption.getAttribute('data-id');

        setDryData({ ...dryData, productName: selectedProductName });

        if (selectedProductId) {
            try {
                const response = await Api.get(`/product/${selectedProductId}`);
                const productData = response.data.data;

                setDryData({
                    ...dryData,
                    productName: selectedProductName,
                    productWeight: productData.productWeight || '',
                    totalPrice: productData.totalPrice || '',
                });

                setProductDetails(productData);
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Error fetching product details.');
            }
        }
    };  

    // Handle form submission
    const handleAddSales = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Adding sale...", {
            className: 'dark-toast'
        });

        try {
            let endpoint = '';
            let formData = {};
        
            // Determine the correct endpoint and form data based on the sales type
            if (salesType === 'Dry Fish') {
                endpoint = '/sales';
                formData = dryData; // Data for Dry Fish
            } else if (salesType === 'Fingerlings Fish') {
                endpoint = '/sales-fingerlings';
                formData = fingerlingsData; // Data for Fingerlings Fish
            } else if (salesType === 'Fresh Fish') {
                endpoint = '/sales-fresh-fish';
                formData = freshData; // Data for Fresh Fish
            }
        
            // Send POST request to the determined endpoint with the respective form data
            const response = await Api.post(endpoint, formData);
        
            // Display success toast notification
            toast.update(loadingToast, {
                render: "Sale added successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
        
            // Reset the form data for Dry Fish as an example
            setDryData({
                productName: '',
                quantity: 0,
                description: ''
            });
        
            // Reset form data for other types as needed
            setFingerlingsData({
                productName: '',
                quantity: 0,
                description: ''
            });
        
            setFreshData({
                productName: '',
                quantity: 0,
                description: ''
            });
        
        } catch (error) {
            // Handle error, show error toast notification
            toast.update(loadingToast, {
                render: error.response ? error.response.data.message : 'Something went wrong',
                type: "error",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
        }finally {
            setLoader(false);
        }
    };

    return (
        <section className={`d-none d-lg-block ${styles.body}`}>
            <div className="sticky-top">
                <Header />
            </div>
            <div className="d-flex gap-2">
                <div className={`${styles.sidebar}`}>
                    <SideBar className={styles.sidebarItem} />
                </div>
                <section className={`${styles.content}`}>
                    <main className={styles.create_form}>
                        <ToastContainer />
                        <div className='d-flex justify-content-between'>
                            <h4 className="mt-4 mb-5">Add New Sale</h4>
                            <Dropdown className='mt-4'>
                                <Dropdown.Toggle className='bg-light' variant="light" id="dropdown-variants-light">
                                    <span className='pe-4'>{salesType}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{setSalesType('Dry Fish')}}>Dry Fish</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{setSalesType('Fresh Fish')}}>Fresh Fish</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{setSalesType('Fingerlings Fish')}}>Fingerlings Fish</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        
                        {salesType === 'Type' ? (
                            <p style={{height: '10vh'}} className='text-muted fs-5 d-flex align-items-center justify-content-center fw-semibold'>
                                Please select sales type
                            </p>
                        ) : null}                          

                            {salesType === 'Dry Fish' && <Form onSubmit={handleAddSales}>
                                <Row xxl={2} xl={2} lg={2}>
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Product Name</Form.Label>
                                        <Form.Select
                                            name="productName"
                                            required
                                            value={dryData.productName}
                                            onChange={handleProductSelect}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        >
                                            <option value="" disabled>Select Product</option>
                                            {products.map((product, index) => (
                                                <option key={index} value={product.productName} data-id={product.id}>
                                                    {product.productName || 'No Data Yet'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>

                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Quantity</Form.Label>
                                        <Form.Control
                                            placeholder="Enter quantity"
                                            type="number"
                                            name="quantity"
                                            value={dryData.quantity}
                                            min="0"
                                            required
                                            onChange={handleInputChange}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Quantity Used to Pack */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Quantity Used to Pack</Form.Label>
                                        <Form.Control
                                            placeholder="Enter quantity used to pack"
                                            type="number"
                                            name="quantity_pack"
                                            value={dryData.quantity_pack}
                                            min="0"                                    
                                            onChange={handleInputChange}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Product Weight (Readonly) */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Product Weight</Form.Label>
                                        <Form.Control
                                            placeholder="Product weight"
                                            type="text"
                                            name="productWeight"
                                            value={dryData.productWeight} // Assuming this value is fetched when product is selected
                                            readOnly
                                            className={`py-2 bg-light-subtle text-secondary shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Description */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Description</Form.Label>
                                        <Form.Control
                                            placeholder="Enter description"
                                            as="textarea"
                                            name="description"
                                            value={dryData.description}
                                            onChange={handleInputChange}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Total Price (Readonly) */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Total Price</Form.Label>
                                        <Form.Control
                                            placeholder="Total price"
                                            type="text"
                                            name="totalPrice"
                                            value={dryData.totalPrice} // Assuming this value is calculated or fetched
                                            readOnly
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>                             
                                </Row>
                                <div className='text-end'>
                                    <Button
                                        variant='dark'
                                        disabled={loader}
                                        className='fw-semibold py-2 px-5 mb-3'
                                        type='submit'
                                    >
                                        {loader ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Sale...
                                            </>
                                        ) : (
                                            'Add Sale'
                                        )}
                                    </Button>
                                </div>
                            </Form>}
                            {salesType === 'Fresh Fish' && <Form onSubmit={handleAddSales}>
                                <Row xxl={2} xl={2} lg={2}>  
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Product Name</Form.Label>
                                        <Form.Select
                                            name="productName"
                                            required
                                            value={freshData.productName}
                                            onChange={handleInputChangeFresh}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        >
                                            <option value="" disabled>Select Product</option>
                                            {products.map((product, index) => (
                                                <option key={index} value={product.productName} data-id={product.id}>
                                                    {product.productName || 'No Data Yet'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>

                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Stage From</Form.Label>
                                        <Form.Select
                                            name="stageId_from"
                                            required
                                            value={freshData.stageId_from}
                                            onChange={handleInputChangeFresh}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        >
                                            <option value="" disabled>Select Stage</option>
                                            {stages.map((stage, index) => (
                                                <option key={index} value={stage.id}>
                                                    {stage.title || 'No Data Yet'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>

                                    {/* Total Product Weight (Not Readonly) */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Total Product Weight</Form.Label>
                                        <Form.Control
                                            placeholder="Enter product weight"
                                            type="number"
                                            name="productWeight"
                                            value={freshData.productWeight}
                                            required
                                            onChange={handleInputChangeFresh}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Quantity */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Quantity</Form.Label>
                                        <Form.Control
                                            placeholder="Enter quantity"
                                            type="number"
                                            name="quantity"
                                            value={freshData.quantity}                                            
                                            required
                                            onChange={handleInputChangeFresh}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Description */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Description</Form.Label>
                                        <Form.Control
                                            placeholder="Enter description"
                                            as="textarea"
                                            name="description"
                                            value={freshData.description}
                                            onChange={handleInputChangeFresh}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Total Price (Readonly) */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Total Price</Form.Label>
                                        <Form.Control
                                            placeholder="Total price"
                                            type="text"
                                            name="totalPrice"
                                            value={freshData.totalPrice}
                                            readOnly
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>
                                    {salesType === 'Fingerlings Fish' && (
                                        <>
                                            {/* Product Name Select */}
                                            <Col className="mb-4">
                                                <Form.Label className="fw-semibold">Stage From</Form.Label>
                                                <Form.Select
                                                    name="stageId_from"
                                                    required
                                                    value={dryData.stageId_from}
                                                    onChange={handleInputChange}
                                                    className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                                >
                                                    <option value="" disabled>Select Stage</option>
                                                    {stages.map((stage, index) => (
                                                        <option key={index} value={stage.id}>
                                                            {stage.title || 'No Data Yet'}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>

                                            {/* Quantity */}
                                            <Col className="mb-4">
                                                <Form.Label className="fw-semibold">Quantity</Form.Label>
                                                <Form.Control
                                                    placeholder="Enter quantity"
                                                    type="number"
                                                    name="quantity"
                                                    value={dryData.quantity}
                                                    min="0"
                                                    required
                                                    onChange={handleInputChange}
                                                    className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                                />
                                            </Col>

                                            {/* Description */}
                                            <Col className="mb-4">
                                                <Form.Label className="fw-semibold">Description</Form.Label>
                                                <Form.Control
                                                    placeholder="Enter description"
                                                    as="textarea"
                                                    name="description"
                                                    value={dryData.description}
                                                    onChange={handleInputChange}
                                                    className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                                />
                                            </Col>

                                            {/* Total Price (Readonly) */}
                                            <Col className="mb-4">
                                                <Form.Label className="fw-semibold">Total Price</Form.Label>
                                                <Form.Control
                                                    placeholder="Total price"
                                                    type="text"
                                                    name="totalPrice"
                                                    value={dryData.totalPrice}
                                                    readOnly
                                                    className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                                />
                                            </Col>
                                        </>
                                    )}
                                </Row>
                                <div className='text-end'>
                                    <Button
                                        variant='dark'
                                        disabled={loader}
                                        className='fw-semibold py-2 px-5 mb-3'
                                        type='submit'
                                    >
                                        {loader ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Sale...
                                            </>
                                        ) : (
                                            'Add Sale'
                                        )}
                                    </Button>
                                </div>
                            </Form>}
                            {salesType === 'Fingerlings Fish' && <Form onSubmit={handleAddSales}>
                                <Row xxl={2} xl={2} lg={2}>  
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Product Name</Form.Label>
                                        <Form.Select
                                            name="productName"
                                            required
                                            value={fingerlingsData.productName}
                                            onChange={handleInputChangeFingerlings}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        >
                                            <option value="" disabled>Select Product</option>
                                            {products.map((product, index) => (
                                                <option key={index} value={product.productName} data-id={product.id}>
                                                    {product.productName || 'No Data Yet'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                                                                                      
                                    {/* Product Name Select */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Stage From</Form.Label>
                                        <Form.Select
                                            name="stageId_from"
                                            required
                                            value={fingerlingsData.stageId_from}
                                            onChange={handleInputChangeFingerlings}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        >
                                            <option value="" disabled>Select Stage</option>
                                            {stages.map((stage, index) => (
                                                <option key={index} value={stage.id}>
                                                    {stage.title || 'No Data Yet'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>

                                    {/* Quantity */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Quantity</Form.Label>
                                        <Form.Control
                                            placeholder="Enter quantity"
                                            type="number"
                                            name="quantity"
                                            value={fingerlingsData.quantity}
                                            min="0"
                                            required
                                            onChange={handleInputChangeFingerlings}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Description */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Description</Form.Label>
                                        <Form.Control
                                            placeholder="Enter description"
                                            as="textarea"
                                            name="description"
                                            value={fingerlingsData.description}
                                            onChange={handleInputChangeFingerlings}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                    {/* Total Price (Readonly) */}
                                    <Col className="mb-4">
                                        <Form.Label className="fw-semibold">Total Price</Form.Label>
                                        <Form.Control
                                            placeholder="Total price"
                                            type="text"
                                            name="totalPrice"
                                            value={fingerlingsData.totalPrice}
                                            readOnly
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </Col>

                                </Row>
                                <div className='text-end'>
                                    <Button
                                        variant='dark'
                                        disabled={loader}
                                        className='fw-semibold py-2 px-5 mb-3'
                                        type='submit'
                                    >
                                        {loader ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Sale...
                                            </>
                                        ) : (
                                            'Add Sale'
                                        )}
                                    </Button>
                                </div>
                            </Form>}
                    </main>
                </section>
            </div>
        </section>
    );
};

export default AddSales;
