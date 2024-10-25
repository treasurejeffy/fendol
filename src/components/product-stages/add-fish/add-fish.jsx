import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../product-stages.module.scss'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../../shared/sidebar/sidebar';
import Header from '../../shared/header/header';
import Api from '../../shared/api/apiLink'

const AddFish = () => {
  const [stages, setStages] = useState([]);
  const [fishType, setfishType] = useState([]);

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
    }, []);

    useEffect(() => {
        const fetchFishType = async () => {
          try {
            const response = await Api.get('/species'); // Replace with your API URL
            console.log(response.data);
            if (Array.isArray(response.data.data)) {
              setfishType(response.data.data);
            } else {
              throw new Error('Expected an array of stages');
            }
          } catch (err) {
            console.log(err.response?.data?.message || 'Failed to fetch data. Please try again.');
          } finally {
            console.log('get success')
          }
        };
    
        fetchFishType();
    }, []);

    const [formData, setFormData] = useState({
        stageId: '',
        quantity: 0,
        speciesId: ''        
    });
    const [loader, setLoader] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Check if the input is for quantity and convert the value to a number
        setFormData({
            ...formData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value, // or use parseFloat if you need decimal values
        });
    };


    const handleAddFish = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Adding fish...",{
            className: 'dark-toast'});

        try {
            const response = await Api.post('/fish', formData);

            // After a successful API call
            toast.update(loadingToast, {
                render: "Fish added successfully!",
                type: "success", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
            // Reset form or handle success as needed
            setFormData({
                stageId: '',
                quantity: 0,        
                speciesId: ''
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message ||  "Error adding fish. Please try again.",
                type: "error", // Use string for type
                isLoading: false,
                autoClose: 3000,
                className: 'dark-toast'
            });
        } finally {
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
                    <main>
                        <ToastContainer />
                        <Form className={styles.create_form} onSubmit={handleAddFish}>
                            <h4 className="mt-5 mb-5">Add Fish</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage</Form.Label>
                                    <Form.Select
                                        name="stageId"
                                        value={formData.stageId}
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Choose Stage</option>
                                        {!stages ? (
                                            <option>Please wait...</option>
                                        ) : stages.length < 1 ? (
                                            <option>No data available</option>
                                        ) : (
                                            stages.map((stage, index) => (
                                                <option value={stage.id} key={index}>{stage.title}</option>
                                            ))
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        min="1"
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Fish Type</Form.Label>
                                    <Form.Select
                                        name="speciesId"
                                        value={formData.speciesId}
                                        onChange={handleInputChange}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Choose fishType</option>
                                        {!fishType ? (
                                            <option>Please wait...</option>
                                        ) : fishType.length < 1 ? (
                                            <option>No data available</option>
                                        ) : (
                                            fishType.map((stage, index) => (
                                                <option value={stage.id} key={index}>{stage.speciesName}</option>
                                            ))
                                        )}
                                    </Form.Select>
                                </Col>         
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? (
                                      ' Adding...'
                                        
                                    ) : (
                                        "ADD"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
};

export default AddFish;
