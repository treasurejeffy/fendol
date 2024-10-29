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
    const [selectedStageId, setSelectedStageId] = useState(null); // State to store the selected dropdown item's ID
    const [moveFishData, setMoveFishData] = useState({
        stageId_from: '',
        stageId_to: '',
        speciesId: '',
        actual_quantity: Number,
        remarks: '',
    });
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showFirstForm, setShowFirstForm] = useState(true);
    const [loader, setLoader] = useState(false);
    
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const response = await Api.get('/fish-stages');
                if (Array.isArray(response.data.data)) {
                    const filteredProcessStages = response.data.data.filter(
                        (stage) => stage.title !== "Smoking" && stage.title !== "Drying"
                      );
                      setStages(filteredProcessStages); // Set the filtered stages
                    const filteredStages = response.data.data.filter(stage => 
                        ["WASHING", "SMOKING", "DRYING"].includes(stage.title.toUpperCase())
                    );            
                    setCheckStages(filteredStages);
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
        if (name === 'stageid_to') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const title = selectedOption.getAttribute('data-title');
            setSelectedTitle(title)
        }
        setMoveFishData({ ...moveFishData, [name]: value });
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
    
            // Reset the moveFishData state
            setMoveFishData({
                stageId_from: '',
                stageId_to: '',
                speciesId: '',
                actual_quantity: '',
                remarks: '',
            });
    
            // Check if stageId_to is "washing" to display the second form
            setTimeout(() => {
                setLoader(false);
                if (moveFishData.stageId_to === selectedTitle) {
                    setShowSecondForm(true);
                    setShowFirstForm(false);
                } else {
                    setShowSecondForm(false);
                    setShowFirstForm(true);


                }
            }, 1000);
    
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
        wholeFishQuantity: 0,
        brokenFishQuantity: 0,
        damageOrLoss: 0,
    });

    const handleMoveFish = (e) => {
        const { name, value } = e.target;
        setMoveData({ ...moveData, [name]: value });
    };
    // Effect to automatically check the first stage when showSecondForm is true
    useEffect(() => {
        if (showSecondForm) {
            const firstStage = checkStages[0]; // Get the first stage, or adapt as needed
            if (firstStage) {
                setMoveData({ stageId_from: firstStage.id });

                // Fetch wash quantity when the stage is set automatically
                fetchWashQuantity(firstStage.id);
            }
        }
    }, [showSecondForm, checkStages]);

    const fetchWashQuantity = async (id) => {
        try {            
            const response = await Api.get(`/fish-stage/${id}`); // Make the API call
            console.log('API Response:', response.data); // Debugging statement
        } catch (error) {
            console.error('Error fetching data:', error); // Handle the error
        }
    };

    const handleCheckboxChange = async (e) => {
        const { value, checked } = e.target;
        console.log('Checkbox changed:', { value, checked }); // Debugging statement
        
        setMoveData((prevData) => ({
            ...prevData,
            stageId_from: checked ? value : '', // Set to the value if checked, else empty
        }));

        // Fetch wash quantity if the checkbox is checked
        if (checked) {
            await fetchWashQuantity(value);
        }
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", moveData);
        // handleSubmit();
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
                        {showFirstForm && (<Form onSubmit={handleMoveFishes}>
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
                        <hr />
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
                                                value={moveData.wholeFishBefore} // Ensure this value is set correctly
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
                                <DropdownButton
                                    id="dropdown-button-dark-example2"
                                    variant="dark"
                                    title="Move To"
                                    className="mt-2 px-4 py-2 fw-semibold"
                                    data-bs-theme="dark"
                                >
                                    {checkStages.map((stage) => (
                                        <Dropdown.Item
                                            key={stage.id}
                                            // disabled={isDisabled(stage.title.toUpperCase())}
                                            // onClick={() => handleDropdownSelect(stage.id)} // Select the stage
                                        >
                                            <span className='text-uppercase fw-semibold'>{stage.title}</span>
                                        </Dropdown.Item>
                                    ))}

                                    <Dropdown.Divider />

                                    {/* Showcase item */}
                                    <Dropdown.Item href="#/action-showcase" className='fw-semibold'>SHOWCASE</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </Form>)}
                    </main>
                </section>
            </div>
        </section>
    );
}


