import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import styles from '../product-stages.module.scss'; 
import { toast, ToastContainer } from 'react-toastify';
import SideBar from '../../shared/sidebar/sidebar'; 
import Header from '../../shared/header/header'; 
import Api from '../../shared/api/apiLink';

export default function MoveFish() {
    const [stages, setStages] = useState([]);
    const [fishType, setFishType] = useState([]);
    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [checkStages, setCheckStages] = useState([]);    
    const [whole, setWhole] = useState(0);
    const [selectedStageName, setSelectedStageName] = useState('Move to');
    const [moveFishData, setMoveFishData] = useState({
        stageId_from: '',
        stageId_to: '',
        speciesId: '',
        actual_quantity: Number,
        remarks: '',
    });
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [loader, setLoader] = useState(false);
    const [getEndpoint, setGetEndpoint] = useState('/wash-quantity');


    useEffect(() => {
        const fetchStages = async () => {
            try {
                const response = await Api.get('/fish-stages');
                if (Array.isArray(response.data.data)) {
                    const filteredProcessStages = response.data.data.filter(
                        (stage) => stage.title !== "Smoking" && stage.title !== "Drying"
                      );
                      setStages(filteredProcessStages); // Set the filtered stages
                      const filteredStages = response.data.data
                      .filter(stage => 
                          ["WASHING", "SMOKING", "DRYING"].includes(stage.title.toUpperCase())
                      )
                      .sort((a, b) => {
                          const order = ["WASHING", "SMOKING", "DRYING"];
                          return order.indexOf(a.title.toUpperCase()) - order.indexOf(b.title.toUpperCase());
                      });
                  
                    setCheckStages(filteredStages);

                    // Set the first stage as checked by default
                    if (filteredStages.length > 0) {
                        const firstStage = filteredStages[0];
                        setMoveData((prevData) => ({
                            ...prevData,
                            stageId_from: firstStage.id, // Set the first stage ID as checked
                        }));
                        fetchQuantity(firstStage.id); // Fetch the quantity for the first stage
                    }
                } else {
                    throw new Error('Expected an array of stages');
                }
            } catch (err) {
                console.error(err.response?.data?.message || 'Failed to fetch data. Please try again.');
            }
        };
        fetchStages();
    }, []);

    useEffect(() => {
        const fetchFishType = async () => {
            try {
                const response = await Api.get('/species');
                if (Array.isArray(response.data.data)) {
                    setFishType(response.data.data);
                } else {
                    throw new Error('Expected an array of species');
                }
            } catch (err) {
                console.error(err.response?.data?.message || 'Failed to fetch data. Please try again.');
            }
        };
        fetchFishType();
    }, []);

    const handleInputChangeMoveFish = (e) => {
        const { name, value } = e.target;
        if (name === 'stageId_to') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const title = selectedOption.getAttribute('data-title');
            setSelectedTitle(title);
        }
        setMoveFishData({ 
            ...moveFishData, 
            [name]: name === 'actual_quantity' ? parseFloat(value) : value // Ensure actual_quantity is a number
        });
    };

    const handleMoveFishes = async (e) => {
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Moving fish...");
    
        try {
            const response = await Api.post('/move-fish', moveFishData);
            
            toast.update(loadingToast, {
                render: "Fish moved successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
    
            // Reset the form data
            setMoveFishData({
                stageId_from: '',
                stageId_to: '',
                speciesId: '',
                actual_quantity: 0,
                remarks: '',
            });
    
            // Toggle showSecondForm if moved to "washing"
            if (selectedTitle.toLowerCase() === "washing") {
                setShowSecondForm(!showSecondForm);
            }
            
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error moving fish. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setLoader(false);
        }
    };
    

    const [moveData, setMoveData] = useState({
        stageId_from: "",
        stageId_to: "",
        wholeFishQuantity: null,
        brokenFishQuantity: null,
        damageOrLoss: null,
    });

    const handleMoveFish = (e) => {
        const { name, value } = e.target;
        
        // Convert value to a float if it's one of the quantity fields
        setMoveData((prevData) => ({
            ...prevData,
            [name]: ["wholeFishQuantity", "brokenFishQuantity", "damageOrLoss"].includes(name) 
                ? parseFloat(value) 
                : value,
        }));
    };

    // Function to fetch wash quantity for a given stage ID
    const fetchQuantity = async (id) => {
        try {            
            const response = await Api.get(`/wash-quantity/${id}`); // Make the API call
            setWhole(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setWhole(0);
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = async (e) => {
        const { value, checked } = e.target;
        console.log('Checkbox changed:', { value, checked }); // Debugging statement
        
        setMoveData((prevData) => ({
            ...prevData,
            stageId_from: checked ? value : '', // Set to the value if checked, else empty
        }));

        // Fetch wash quantity if the checkbox is checked
        if (checked) {
            await fetchQuantity(value);
        }
    };

    const handleSelect = (event, stageId, stageName) => {
        event.preventDefault();
    
        // Update `moveData` state directly to include `stageId_to`
        setMoveData((prevData) => ({
            ...prevData,
            stageId_to: stageId,
        }));
    
        // Update `selectedStageName` for dropdown display
        setSelectedStageName(stageName);
    
        // Call form submission function with selected `stageId` and `stageName`
        onFormSubmit(stageId, stageName);
    };
    
    const onFormSubmit = async (stageId, stageName) => {
        const loadingToastId = toast.loading("Submitting data...");
    
        // Determine endpoint based on `stageName`
        let endpoint = '';
        if (stageName == "smoking") {
            endpoint = "/fish-process";
        } else if (stageName == "Drying") {
            endpoint = "/smoking-to-drying";
        } else {
            toast.update(loadingToastId, { 
                render: "Invalid stage selection.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            return;
        }
    
        try {
            // Await API call to submit `moveData`
            const response = await Api.post(endpoint, {
                ...moveData,
                stageId_to: stageId, // Ensure `stageId_to` is included in payload
            });
    
            toast.update(loadingToastId, { 
                render: "Data submitted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            
            console.log("Submitted Data:", response.data);
        } catch (error) {
            toast.update(loadingToastId, { 
                render: error.response?.data?.message || "Submission failed. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
            console.error("Error submitting data:", error);
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
                        <ToastContainer/>
                        {!showSecondForm && (<Form onSubmit={handleMoveFishes}>
                            <h4 className="my-5">Move Fish</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage From</Form.Label>
                                    <Form.Select
                                        name="stageId_from" // This should be stageFrom to match the state
                                        value={moveFishData.stageId_from}
                                        onChange={handleInputChangeMoveFish}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Choose Stage</option>
                                        {!stages ? (
                                            <option>Please wait...</option>
                                        ) : stages.length < 1 ? (
                                            <option>No data available</option>
                                        ) : (
                                            stages
                                                .filter(stage => stage.title.toLowerCase() !== "washing") // Filter out "washing"
                                                .map((stage, index) => (
                                                    <option value={stage.id} key={index}>{stage.title}</option>
                                                ))
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage To</Form.Label>
                                    <Form.Select
                                        name="stageId_to"
                                        value={moveFishData.stageId_to}
                                        onChange={handleInputChangeMoveFish}
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
                                                <option value={stage.id} key={index} data-title={stage.title} >{stage.title}</option>
                                            ))
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Fish Type</Form.Label>
                                    <Form.Select
                                        name="speciesId"
                                        value={moveFishData.speciesId}
                                        onChange={handleInputChangeMoveFish}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Choose Fish  Type</option>
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
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        placeholder="Enter quantity"
                                        type="number"
                                        name="actual_quantity"
                                        value={moveFishData.actual_quantity}
                                        min='1'
                                        required
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Remark</Form.Label>
                                    <Form.Control
                                        placeholder="Enter remark"
                                        as="textarea"
                                        name="remarks"
                                        required
                                        value={moveFishData.remarks}
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button className="btn shadow btn-dark py-2 px-5 fs-6 mb-5 fw-semibold" disabled={loader} type="submit">
                                    {loader ? 'Moving' : "Move"}
                                </Button>
                            </div>
                        </Form>)}
                        {showSecondForm &&(<Form >
                            <div className='d-flex gap-5'>
                            {checkStages.map((stage) => (
                                <Form.Check
                                    key={stage.id} // Use the unique id as the key
                                    label={stage.title} // Display the title
                                    value={stage.id} // Use the id as the value
                                    className="text-muted fw-semibold text-uppercase"
                                    name="stageId_from"
                                    checked={moveData.stageId_from === stage.id} // Check if selected
                                    onChange={handleCheckboxChange} // Handle checkbox change                                        
                                />
                            ))}
                            </div>
                            <div className='mt-5 mb-4'>
                                <div className='d-flex align-items-center mb-4'>
                                    <div className='d-flex align-items-center mt-5'>
                                        <p className='fw-semibold me-2 mb-0'>WHOLE FISH</p>
                                        <div className={styles.border_dot}></div>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Form.Group className="me-4">
                                            <Form.Label className="fw-semibold mb-3 text-dark ps-2">Before</Form.Label>
                                            <Form.Control
                                                readOnly
                                                type='number'
                                                value={whole} // Ensure this value is set correctly
                                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold mb-3 text-dark ps-2">After</Form.Label>
                                            <Form.Control
                                                name="wholeFishQuantity"
                                                value={moveData.wholeFishQuantity}
                                                onChange={handleMoveFish}
                                                type='number'
                                                required
                                                className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mb-4'>
                                    <div className='d-flex align-items-center'>
                                        <p className='fw-semibold me-2 mb-0'>BROKEN FISH</p>
                                        <div className={styles.border_dot}></div>
                                    </div>
                                    <div className="d-flex justify-content-center gap-3 align-items-center">
                                        <Form.Control
                                            readOnly
                                            type='number'
                                            value={moveData.brokenFishBefore} // Ensure this value is set correctly
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs} me-2`}
                                        />
                                        <Form.Control
                                            type='number'
                                            name="brokenFishQuantity"
                                            value={moveData.brokenFishQuantity}
                                            onChange={handleMoveFish}
                                            required
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </div>
                                </div>

                                <div className='d-flex align-items-center'>
                                    <div className='d-flex align-items-center'>
                                        <p className='fw-semibold me-2 mb-0'>DAMAGE/LOSS</p>
                                        <div className={styles.border_dot}></div>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center gap-3">
                                        <Form.Control
                                            readOnly
                                            type='number'
                                            value={moveData.damageBefore} // Ensure this value is set correctly
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                        <Form.Control
                                            required
                                            type='number'
                                            name="damageOrLoss"
                                            value={moveData.damageOrLoss}
                                            onChange={handleMoveFish}
                                            className={`py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 ${styles.inputs}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant="dark" 
                                        className="px-4 py-2 bg-dark text-white border-secondary shadow-none fw-semibold"
                                    >
                                        {selectedStageName} {/* Display the selected stage name */}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item 
                                            as="button" 
                                            disabled 
                                            className="text-uppercase"
                                        >
                                            Move to
                                        </Dropdown.Item>
                                        {checkStages.map((stage) => (
                                            <Dropdown.Item 
                                                key={stage.id} 
                                                as="button" 
                                                disabled={stage.id === moveData.stageId_from} 
                                                onClick={(event) => handleSelect(event, stage.id, stage.title)}
                                            >
                                                {stage.title}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Form>)}
                    </main>
                </section>
            </div>
        </section>
    );
}


