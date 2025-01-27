import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import Api from '../../shared/api/apiLink'; // Adjust based on your API import path
import styles from '../finance.module.scss'; // Adjust the import as needed
import { BsExclamationTriangleFill } from 'react-icons/bs';

const SalesForm = ({ customers, stages, products }) => {
    const [dryData, setDryData] = useState({
        products: [],
        category: '',
        fullName: '',
        discount: 0,
        description: '',
        paymentType: '',
        amountPaid: null
    });
    const [checkedProducts, setCheckedProducts] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [loader, setLoader] = useState(false);
    const [filteredCustomer, setFilteredCustomer] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        setCustomer(customers);
    }, [customers]);

    useEffect(() => {
        const total = dryData.products.reduce((total, product) => {
            if (checkedProducts[product.productName]) {
                const quantity = product?.quantity || 0;
                const basePrice = products.find(p => p.productName === product.productName).basePrice;
                return total + (quantity * basePrice);
            }
            return total;
        }, 0);
        setTotalPrice(total);
    }, [dryData.products, checkedProducts, products]);

    const handleInputChange = (e, productName) => {
        const { name, value } = e.target;
        setDryData(prevState => {
            const updatedProducts = prevState.products.map(product =>
                product.productName === productName ? { ...product, [name]: value } : product
            );
            return { ...prevState, products: updatedProducts };
        });
    };

    const handleCheckChange = (e, productName) => {
        const { checked } = e.target;
        setCheckedProducts(prevState => ({
            ...prevState,
            [productName]: checked
        }));
        if (checked) {
            setDryData(prevState => ({
                ...prevState,
                products: [...prevState.products, { productName, quantity: 0, quantityUsedToPack: 0 }]
            }));
        } else {
            setDryData(prevState => ({
                ...prevState,
                products: prevState.products.filter(product => product.productName !== productName)
            }));
        }
    };

    const calculateSubtotal = (productName) => {
        const product = dryData.products.find(product => product.productName === productName);
        const quantity = product?.quantity || 0;
        const basePrice = products.find(product => product.productName === productName).basePrice;
        return quantity * basePrice;
    };

    const calculateDiscountedPrice = () => {
        let discountedPrice = totalPrice;
        if (dryData.category === 'Marketer') {
            discountedPrice -= (totalPrice * 0.1);
        } else {
            discountedPrice -= (dryData.discount || 0);
        }
        return discountedPrice;
    };

    const calculateTotalBalance = () => {
        const discountedPrice = calculateDiscountedPrice();
        return discountedPrice - (dryData.amountPaid || 0);
    };

    const handleNextStep = () => {
        setFormSubmitted(true);
        if (isNextButtonDisabled()) {
            toast.error("Please fill in all required fields for the selected products.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                className: 'dark-toast'
            });
        } else {
            setCurrentStep(2);
        }
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setDryData(prevData => ({ ...prevData, fullName: value }));

        const filtered = customer.filter(c =>
            c.fullName?.toLowerCase().includes(value.toLowerCase()) &&
            (!dryData.category || c.category === dryData.category)
        );

        setFilteredCustomer(filtered.length ? filtered : []);
    };

    const handleSelectCustomer = (name) => {
        setDryData(prevData => ({ ...prevData, fullName: name }));
        setFilteredCustomer([]); // Clear suggestions after selection
    };

    const handleAddSales = async (e) => {
        e.preventDefault();

        // Show confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to add this sale?");
        
        if (!isConfirmed) {
            return; // If the user cancels, exit the function
        }

        setLoader(true);
        const loadingToast = toast.loading("Adding sale...", { className: 'dark-toast' });

        try {
            const response = await Api.post('/sales', dryData);

            toast.update(loadingToast, {
                render: "Sale added successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });

            setDryData({
                products: [],
                category: '',
                fullName: '',
                discount: '',
                description: '',
                paymentType: '',
                amountPaid: ''
            });
            setCheckedProducts({});
            setCurrentStep(1);
            setFormSubmitted(false);
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response ? error.response.data.message : 'Something went wrong',
                type: "error",
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
        } finally {
            setLoader(false);
        }
    };

    const isNextButtonDisabled = () => {
        const hasCheckedProduct = Object.values(checkedProducts).some(checked => checked);
        if (!hasCheckedProduct) {
            return true;
        }
        return Object.keys(checkedProducts).some(productName => {
            if (checkedProducts[productName]) {
                const product = dryData.products.find(p => p.productName === productName);
                return !product || !product.quantity || !product.quantityUsedToPack;
            }
            return false;
        });
    };

    return (
        <div>
            {currentStep === 1 && (
                products.length > 0 ? (
                    <>
                        <Table className={`bg-light px-2 ${styles.styled_table}`}>
                            <thead className={`rounded-2 px-2`}>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>PRODUCT WEIGHT</th>
                                    <th>PRICE</th>
                                    <th>QUANTITY</th>
                                    <th>QUANTITY USED TO PACK <br /> QUANTITY IN KG FOR BROKEN</th>
                                    <th>SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products
                                    .filter(product => {
                                        const lowerProductName = product.productName?.toLowerCase() || '';
                                        return (
                                            product.productName &&
                                            !lowerProductName.includes('fresh fish') &&
                                            !lowerProductName.includes('fingerlings fish')
                                        );
                                    })
                                    .map((product, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={product.productName}
                                                    value={product.productName}
                                                    data-id={product.id}
                                                    className='border text-uppercase py-2'
                                                    onChange={(e) => handleCheckChange(e, product.productName)}
                                                    checked={checkedProducts[product.productName] || false}
                                                />
                                            </td>
                                            <td><p className='py-2'>{product.productWeight}{product.unit}</p></td>
                                            <td><p className='py-2'>₦ {new Intl.NumberFormat().format(product.basePrice)}</p></td>
                                            <td>
                                                <Form.Control
                                                    placeholder="Enter quantity"
                                                    type="number"
                                                    name="quantity"
                                                    value={dryData.products.find(p => p.productName === product.productName)?.quantity || ''}
                                                    required
                                                    min={1}
                                                    onChange={(e) => handleInputChange(e, product.productName)}
                                                    className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                                                    disabled={!checkedProducts[product.productName]}
                                                />
                                            </td>
                                            <td className='px-2'>
                                                <Form.Control
                                                    placeholder={!product.productName?.toLowerCase().includes("broken") ? `Enter quantity used to pack` : `Enter quantity in to Kg`}
                                                    type="number"
                                                    name="quantityUsedToPack"
                                                    value={dryData.products.find(p => p.productName === product.productName)?.quantityUsedToPack || ''}
                                                    min="0"
                                                    onChange={(e) => handleInputChange(e, product.productName)}
                                                    className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                                                    disabled={!checkedProducts[product.productName]}
                                                />
                                            </td>
                                            <td><p className="text-muted py-2">
                                                ₦ {new Intl.NumberFormat().format(calculateSubtotal(product.productName))}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        <div className="mt-3">
                            <h5 className='fw-semibold mt-3'>Total Price: ₦ {new Intl.NumberFormat().format(totalPrice)}</h5>
                        </div>
                        <div className='text-end'>
                            <Button 
                                onClick={handleNextStep} 
                                className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`}
                                disabled={isNextButtonDisabled()}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="d-flex justify-content-center">
                        <Alert variant="info" className="text-center w-50 py-5">
                            <BsExclamationTriangleFill size={40} /> <span className="fw-semibold">No Product yet.</span>
                        </Alert>
                    </div>
                )
            )}
            {currentStep === 2 && (
                <Form onSubmit={handleAddSales}>
                    <Row xxl={2} xl={2} lg={2}>
                        {/* Buyer Category */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Buyer Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={dryData.category || ''}
                                onChange={(e) => setDryData({ ...dryData, category: e.target.value })}
                                required
                                className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs} pe-5`}
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Marketer">Marketer</option>
                                <option value="Customer">Customer</option>
                            </Form.Select>
                        </Col>

                        {/* Customer Name with Suggestions */}
                        <Col className="mb-4">
                            <Form.Group controlId="searchCustomer">
                                <Form.Label className="fw-semibold">Name</Form.Label>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Name..."
                                        name="fullName"
                                        value={dryData.fullName || ''}
                                        onChange={handleSearchChange}
                                        style={{ width: '100%' }}
                                        className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs} pe-5`}
                                    />
                                    {dryData.fullName && filteredCustomer.length > 0 && (
                                        <div className={`${styles.suggestions_box}`}>
                                            <ul>
                                                {filteredCustomer.map((customer, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleSelectCustomer(customer.fullName)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {customer.fullName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Form.Group>
                        </Col>

                        {/* Discount Input */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Discount (₦)</Form.Label>
                            <div className={`${styles.inputContainer} position-relative`}>
                                <Form.Control
                                    placeholder="Enter discount"
                                    type="text"
                                    name="discount"
                                    value={dryData.category === 'Marketer' ? '10%' : dryData.discount || ''}
                                    onChange={(e) => setDryData({ ...dryData, discount: e.target.value })}
                                    className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs} pe-5`}
                                    readOnly={dryData.category === 'Marketer'}
                                />
                            </div>
                        </Col>

                        {/* Description Textarea */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Description</Form.Label>
                            <Form.Control
                                placeholder="Enter description"
                                as="textarea"
                                name="description"
                                value={dryData.description || ''}
                                onChange={(e) => setDryData({ ...dryData, description: e.target.value })}
                                className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                            />
                        </Col>

                        {/* Payment Type */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Payment Type</Form.Label>
                            <Form.Select
                                name="paymentType"
                                value={dryData.paymentType || ''}
                                onChange={(e) => setDryData({ ...dryData, paymentType: e.target.value })}
                                required
                                className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                            >
                                <option value="" disabled>Select Payment Type</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit">Credit</option>
                                <option value="Transfer">Transfer</option>
                                <option value="Pos">Pos</option>
                            </Form.Select>
                        </Col>

                        {/* Amount Paid Input (only if paymentType is Credit) */}
                        {dryData.paymentType === 'Credit' && (
                            <Col className="mb-4">
                                <Form.Label className="fw-semibold">Amount Paid (₦)</Form.Label>
                                <Form.Control
                                    placeholder="Enter amount paid"
                                    type="text"
                                    name="amountPaid"
                                    value={dryData.amountPaid ? new Intl.NumberFormat().format(dryData.amountPaid) : ''}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/,/g, ''); // Remove commas for proper number parsing
                                        setDryData({ ...dryData, amountPaid: value });
                                    }}
                                    className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                                />
                            </Col>
                        )}

                        {/* Total Price (Readonly) */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Total Price (₦)</Form.Label>
                            <Form.Control
                                placeholder="Total price"
                                type="text"
                                name="totalPrice"
                                value={new Intl.NumberFormat().format(totalPrice)}
                                readOnly
                                className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                            />
                        </Col>

                        {/* Discounted Price (Readonly) */}
                        <Col className="mb-4">
                            <Form.Label className="fw-semibold">Total Balance (₦)</Form.Label>
                            <Form.Control
                                placeholder="Total balance"
                                type="text"
                                name="totalBalance"
                                value={new Intl.NumberFormat().format(calculateTotalBalance())}
                                readOnly
                                className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                            />
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-between">
                        <Button
                            variant="secondary"
                            className={`border-0 shadow py-2 px-5 fs-6 mb-5 fw-semibold`}
                            onClick={() => setCurrentStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            variant="dark"
                            disabled={loader}
                            className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`}
                            type="submit"
                        >
                            {loader ? 'Adding Sale...' : 'Add Sale'}
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    );
};

export default SalesForm;