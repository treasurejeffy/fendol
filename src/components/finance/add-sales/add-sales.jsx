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
        quantity: Number,
        description: "",
        quantityUsedToPack:null
    });

    const [freshData, setFreshData] = useState({        
        productName:"",
        productWeight: Number,
        quantity: Number,
        description: "",
        stageId_from: ""        
    })

    const [fingerlingsData, setFingerlingsData] = useState(
        {
            productName:"",
            quantity: Number,
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

    // Handle quantity change and update total price for dry fish
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDryData(prevData => ({
            ...prevData,
            [name]: value,
            totalPrice: name === 'quantity' && name === 'quantityUsedToPack' ? (prevData.basePrice || 0) * (parseFloat(value) || 0) : prevData.totalPrice
        }));
    };

    // freshData input changes
    const handleInputChangeFresh = (e) => {
        const { name, value } = e.target;
        setFreshData(prevData => ({
            ...prevData,
            [name]: value,
            totalPrice: name === 'productWeight' ? (prevData.basePrice || 0) * (parseFloat(value) || 0) : prevData.totalPrice
        }));
    };

    // fingerlingsData input changes, similar to dry fish calculation
    const handleInputChangeFingerlings = (e) => {
        const { name, value } = e.target;
        setFingerlingsData(prevData => ({
            ...prevData,
            [name]: value,
            totalPrice: name === 'quantity' ? (prevData.basePrice || 0) * (parseFloat(value) || 0) : prevData.totalPrice
        }));
    };

    // Fetch product details when a product is selected
    const handleProductSelect = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedProductName = e.target.value;
        const selectedProductId = selectedOption.getAttribute('data-id');

        // Update product name for all data objects
        setDryData(prevData => ({ ...prevData, productName: selectedProductName }));


        if (selectedProductId) {
            try {
                const response = await Api.get(`/product/${selectedProductId}`);
                const productData = response.data.data;

                // Update dry fish data
                setDryData(prevData => ({
                    ...prevData,
                    productWeight: productData.productWeight || '',
                    basePrice: productData.basePrice || 0,
                    totalPrice: (productData.basePrice || 0) * (prevData.quantity || 0)
                }));

                setProductDetails(productData);
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Error fetching product details.');
            }
        }
    };

    const handleProductSelectFinger = async (e) =>{
        const selectedOption = e.target.selectedOptions[0];
        const selectedProductName = e.target.value;
        const selectedProductId = selectedOption.getAttribute('data-id-finger');

        // Update product name for all data
        setFingerlingsData(prevData => ({ ...prevData, productName: selectedProductName }));

        if (selectedProductId) {
            try {
                const response = await Api.get(`/product/${selectedProductId}`);
                const productData = response.data.data;
              // Update fingerlings data
              setFingerlingsData(prevData => ({
                ...prevData,
                basePrice: productData.basePrice || 0,
                totalPrice: (productData.basePrice || 0) * (prevData.quantity || 0)
            }));

                setProductDetails(productData);
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Error fetching product details.');
            }
        }
    }

    const handleProductSelectFresh = async (e) =>{
        const selectedOption = e.target.selectedOptions[0];
        const selectedProductName = e.target.value;
        const selectedProductId = selectedOption.getAttribute('data-id-fresh');

        // Update product name for all data
        setFreshData(prevData => ({ ...prevData, productName: selectedProductName }));

        if (selectedProductId) {
            try {
                const response = await Api.get(`/product/${selectedProductId}`);
                const productData = response.data.data;
                // Update fresh fish data using productWeight for total price calculation
                setFreshData(prevData => ({
                    ...prevData,
                    basePrice: productData.basePrice || 0,
                    totalPrice: (productData.basePrice || 0) * (productData.productWeight || 0)
                }));
                setProductDetails(productData);
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Error fetching product details.');
            }
        }
    }


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
                quantity: Number,
                description: ''
            });
        
            // Reset form data for other types as needed
            setFingerlingsData({
                productName: '',
                quantity: Number,
                description: ''
            });
        
            setFreshData({
                productName: '',
                quantity: Number,
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
                            {(salesType === 'Dry Fish' || salesType === 'Fresh Fish' || salesType === 'Fingerlings Fish') && (
                                <div style={{ width: '18%' }}>
                                    <Form.Select
                                        value={salesType}
                                        onChange={(e) => setSalesType(e.target.value)}
                                        className="bg-light shadow-none border-secondary-subtle border-1"
                                    >
                                        <option value="" disabled>Select Sales Type</option>
                                        <option value="Dry Fish">Dry Fish</option>
                                        <option value="Fresh Fish">Fresh Fish</option>
                                        <option value="Fingerlings Fish">Fingerlings Fish</option>
                                    </Form.Select>
                                </div>
                            )}
                        </div>
                        
                        {salesType === 'Type' ? (
                            <div style={{height: '15vh'}} className='text-muted fs-5 d-flex gap-3 align-items-center justify-content-center fw-semibold'>
                            <p className='text-muted fs-5 fw-semibold'>
                                Please select sales type
                            </p>
                            <div  style={{width:'18%'}}>
                                <Form.Select
                                    value={salesType}
                                    onChange={(e) => setSalesType(e.target.value)}
                                    className="bg-light shadow-none border-secondary-subtle border-1 p-3"
                                >
                                    <option value="" >Select Sales Type</option>
                                    <option value="Dry Fish">Dry Fish</option>
                                    <option value="Fresh Fish">Fresh Fish</option>
                                    <option value="Fingerlings Fish">Fingerlings Fish</option>
                                </Form.Select>                    
                            </div>
                            </div>
                        ) : null}                          

                        {salesType === 'Dry Fish' && <Form onSubmit={handleAddSales}>
                            <Row xxl={2} xl={2} lg={2}>
                            <Col className="mb-4">
                                <Form.Label className="fw-semibold">Product Name</Form.Label>
                                <Form.Select
                                    name="productName"
                                    required
                                    value={dryData.productName || ''}
                                    onChange={handleProductSelect}
                                    className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                >
                                    <option value="" disabled>Select Product</option>
                                    {products
                                        .filter(product => 
                                            product.productName && 
                                            !product.productName.toLowerCase().includes('fresh fish') && 
                                            !product.productName.toLowerCase().includes('fingerlings fish')
                                        )
                                        .map(product => (
                                            <option key={product.id} value={product.productName} data-id={product.id}>
                                                {`${product.productName} - (₦ ${product.basePrice})`}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            </Col>


                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="quantity"
                                        value={dryData.quantity || ''}                                        
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
                                        name="quantityUsedToPack"
                                        value={dryData.quantityUsedToPack || ''}
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
                                        value={dryData.productWeight || ''} // Assuming this value is fetched when product is selected
                                        readOnly
                                        className={`py-2 bg-light-subtle text-secondary shadow-none border-secondary-subtle border-1 ${styles.inputs} ${styles.Pweight}`}
                                    />
                                </Col>

                                {/* Description */}
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Description</Form.Label>
                                    <Form.Control
                                        placeholder="Enter description"
                                        as="textarea"
                                        name="description"
                                        value={dryData.description || ''}
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
                                        value={dryData.totalPrice ? `₦${new Intl.NumberFormat().format(dryData.totalPrice)}` : ''}
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
                                        value={freshData.productName || ''}
                                        onChange={handleProductSelectFresh}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Select Fresh Fish Product</option>
                                        {products
                                            .filter(product => product.productName && product.productName.toLowerCase().includes('fresh'))
                                            .map((product, index) => (
                                                <option key={index} value={product.productName} data-id-fresh={product.id}>
                                                    {product.productName ? `${product.productName} - (₦ ${product.basePrice})` : 'No Data Yet'}
                                                </option>
                                            ))
                                        }
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
                                        {stages
                                            .filter(stage => !stage.title.toLowerCase().includes('fingerlings')) // Filter out "Fingerlings"
                                            .map((stage, index) => (
                                                <option key={index} value={stage.id}>
                                                    {stage.title || 'No Data Yet'}
                                                </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                {/* Total Product Weight (Not Readonly) */}
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Total Product Weight (KG)</Form.Label>
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
                                        value={freshData.totalPrice ? `₦${new Intl.NumberFormat().format(freshData.totalPrice)}` : ''}
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
                        {salesType === 'Fingerlings Fish' && <Form onSubmit={handleAddSales}>
                            <Row xxl={2} xl={2} lg={2}>  
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Product Name</Form.Label>
                                    <Form.Select
                                        name="productName"
                                        required
                                        value={fingerlingsData.productName || ''}
                                        onChange={handleProductSelectFinger}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Select Fingerlings Product</option>
                                        {products
                                            .filter(product => product.productName && product.productName.toLowerCase().includes('fingerlings'))
                                            .map((product, index) => (
                                                <option key={index} value={product.productName} data-id-finger={product.id}>
                                                    {product.productName ? `${product.productName} - (₦ ${product.basePrice})` : 'No Data Yet'}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </Col>
                                                                                                                                    
                                {/*  Name Select */}
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
                                        {stages
                                            .filter(stage => stage.title.toLowerCase().includes('fingerlings')) // Only include stages with "Fingerlings" in the title
                                            .map((stage, index) => (
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
                                        value={fingerlingsData.totalPrice ? `₦${new Intl.NumberFormat().format(fingerlingsData.totalPrice)}` : ''}
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
