import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from '../process.module.scss'; 
import { toast, ToastContainer } from 'react-toastify';
import SideBar from '../../shared/sidebar/sidebar'; 
import Header from '../../shared/header/header'; 
import Api from '../../shared/api/apiLink';
import { MdOutlineRefresh } from "react-icons/md";


export default function NewBatchFish() {
    const [stages, setStages] = useState({ harvest: null, washing: null });
    const [fishType, setFishType] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(true);
    const [checkStages, setCheckStages] = useState([]);
    const [moveFishData, setMoveFishData] = useState({
        stageId_from: '',
        stageId_to: '',
        speciesId: '',
        actual_quantity: null,
        remarks: '',
    });
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(() => {
        const savedValue = sessionStorage.getItem('showSuccessOverlay');
        return savedValue ? JSON.parse(savedValue) : false;
      });
    const [loader, setLoader] = useState(false);

    const fetchWashingStage = async () => {
        try {
            const response = await Api.get('/process-stages');
            if (Array.isArray(response.data.data)) {
                setCheckStages(response.data.data)
                const washingStage = response.data.data.find(stage => stage.title === "Washing");
                setStages((prevStages) => ({ ...prevStages, washing: washingStage }));              
                setMoveFishData(prevData => ({
                    ...prevData,
                    stageId_to: washingStage ? washingStage.id : '',
                }));
            } else {
                throw new Error('Expected an array of stages for Washing');
            }
        } catch (err) {
            console.error(err.response?.data?.message || 'Failed to fetch washing stage. Please try again.');
        }
    };

    useEffect(() => {
        sessionStorage.setItem('showSuccessOverlay', JSON.stringify(showSuccessOverlay));
      }, [showSuccessOverlay]);

    useEffect(() => {
        const fetchHarvestStage = async () => {
            try {
                const response = await Api.get('/fish-stages');
                if (Array.isArray(response.data.data)) {
                    const harvestStage = response.data.data.find(stage => stage.title === "Harvest");
                    setStages(prevStages => ({ ...prevStages, harvest: harvestStage }));
                    setMoveFishData(prevData => ({
                        ...prevData,
                        stageId_from: harvestStage ? harvestStage.id : '',
                    }));
                } else {
                    throw new Error('Expected an array of stages for Harvest');
                }
            } catch (err) {
                console.error(err.response?.data?.message || 'Failed to fetch harvest stage. Please try again.');
            }
        };

        fetchHarvestStage();
        fetchWashingStage();
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

    useEffect(()=>{
        if (stages.harvest?.id) {
            getQuantity(stages.harvest.id);
        }
    },[stages.harvest])

    const handleInputChangeMoveFish = (e) => {
        const { name, value } = e.target;
        setMoveFishData({
            ...moveFishData,
            [name]: name === 'actual_quantity' ? parseFloat(value) : value,
        });
    };

    const getQuantity = async (id) => {
        if (id) {
            setSelectedQuantity(true); // Show "Loading..." during fetch
            try {
                const response = await Api.get(`/fish-quantity/?stageId=${id}`);
                const quantity = response.data.quantity;
                setMoveFishData((prevData) => ({
                    ...prevData,
                    actual_quantity: Number(quantity), // Ensure quantity is a number
                }));
            } catch (error) {
                console.error('Failed to fetch quantity:', error);
            } finally {
                setSelectedQuantity(false); // Stop showing "Loading..." after fetch
            }
        } else {
            console.error('Stage ID from is required.');
        }
    };
    

    const handleMoveFishes = async (e) => {        
        e.preventDefault();
        setLoader(true);
        const loadingToast = toast.loading("Moving To Process Control...");
    
        try {
            const response = await Api.post('/harvest-washing', moveFishData);
            
            toast.update(loadingToast, {
                render: "Fish moved successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });            

            const newSuccessOverlay = !showSuccessOverlay;
            setShowSuccessOverlay(newSuccessOverlay || true); // Update the state            
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
        
    // process begins here 
    const [whole, setWhole] =useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
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

    const fetchQuantity = async (id, stageTitle) => {
        let endpoint;
    
        // Determine endpoint based on stageTitle
        switch (stageTitle) {
            case "Washing":
                endpoint = `/wash-quantity/${id}`;
                break;
            case "Smoking":
                endpoint = `/smoke-quantity/${id}`;
                break;
            case "Drying":
                endpoint = `/dry-quantity/${id}`;
                break;
            default:
                console.error("Invalid stage title");
                return;
        }
    
        try {            
            const response = await Api.get(endpoint);
            setWhole(response.data.data); // Set quantity with response data
        } catch (error) {
            console.error('Error fetching data:', error);
            setWhole(0); // Set default value on error
        }
    };
    
    // Define ordered stages
    const orderedStages = checkStages.sort((a, b) => {
        const stageOrder = ["Washing", "Smoking", "Drying"];
        return stageOrder.indexOf(a.title) - stageOrder.indexOf(b.title);
    });
    
    // Set the default checked stage on mount
    useEffect(() => {
        if (orderedStages.length > 0) {
            const defaultStageId = orderedStages[0].id;
            
            setMoveData((prevData) => ({
                ...prevData,
                stageId_from: defaultStageId,
                stageId_to: getNextStageId(defaultStageId),
            }));
        }
    }, [orderedStages]);

    // Fetch quantity when stageId_from changes
    useEffect(() => {
        if (moveData.stageId_from) {
            const selectedStage = orderedStages.find((stage) => stage.id === moveData.stageId_from);
            if (selectedStage) {
                fetchQuantity(moveData.stageId_from, selectedStage.title);
            }
        }
    }, [moveData.stageId_from, orderedStages]);
    
    // Function to get the next stage based on the current stage ID
    const getNextStageId = (currentStageId) => {
        const currentIndex = orderedStages.findIndex((stage) => stage.id === currentStageId);
        if (currentIndex !== -1 && currentIndex + 1 < orderedStages.length) {
            return orderedStages[currentIndex + 1].id; // Return the id of the next stage
        }
        return null; // No next stage
    };
    
    const handleCheckboxChange = async (e) => {
        const { value, checked } = e.target;
        const selectedStage = orderedStages.find((stage) => stage.id === value);
    
        setMoveData((prevData) => ({
            ...prevData,
            stageId_from: checked ? value : '',
            stageId_to: checked ? getNextStageId(value) : '', // Update stageId_to based on selected stage
        }));
    
        // Fetch quantity if the checkbox is checked and stageTitle is available
        if (checked && selectedStage) {
            await fetchQuantity(value, selectedStage.title);
        }
    };
    
    // Function to get the endpoint based on the current stage title
    const getEndpoint = (stageTitle) => {
        switch (stageTitle) {
            case "Washing":
                return "/fish-process";
            case "Smoking":
                return "/smoking-to-drying";
            case "Drying":
                return "/add-fish-to-show-glass";
            default:
                return null;
        }
    };
    
    const [currentAccordion, setCurrentAccordion] = useState(moveData.stageId_from);

    // Function to handle the Next button click
    const handleNext = async () => {
        setLoading(true);
        setMessage("Processing your request...");
        try {
            const currentStage = orderedStages.find((stage) => stage.id === moveData.stageId_from);
            const endpoint = getEndpoint(currentStage?.title);
            
            // Post data to the determined endpoint
            if (endpoint) {
                await Api.post(endpoint, moveData);

                // If the current stage is the last stage ("Drying"), hide the overlay
                setMessage("Fish moved successfully!");
                if (currentStage.title === "Drying") {
                    setShowSuccessOverlay(false);
                }else {
                    // Advance to the next stage in the order
                    const nextStageId = getNextStageId(moveData.stageId_from);
                    if (nextStageId) {
                        setMoveData((prevData) => ({
                            ...prevData,
                            stageId_from: nextStageId,
                            stageId_to: getNextStageId(nextStageId),
                            wholeFishQuantity: '',
                            brokenFishQuantity: '',
                            damageOrLoss: ''
                        }));
                        setCurrentAccordion(nextStageId); // Open the next accordion section
                        await fetchQuantity(nextStageId, orderedStages.find(stage => stage.id === nextStageId)?.title);
                    }    
                }       
            } else {
                throw new Error("Invalid stage transition.");
            }
        } catch (error) {
            console.error("Error processing fish:", error);
            setMessage("Error processing fish. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchWashingStage();
        fetchQuantity();
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(''); // Clear the message after closing
            }, 2500); // 30 seconds
    
            return () => clearTimeout(timer); // Clear timer if message changes before 30 seconds
        }
    }, [message]);
               
    return (
        <section className={`d-none d-lg-block ${styles.body}`} >
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
                        <Form onSubmit={handleMoveFishes}>
                            <h4 className="my-5">Create Batch</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Import From</Form.Label>
                                    <Form.Control
                                            value={
                                                stages.harvest === null
                                                    ? 'Loading...'          // Show "Loading..." while initially loading
                                                    : stages.harvest?.title // Show title if available
                                                    || 'No Harvest Pond Available'            // Show "No data" if title or data is missing
                                            }
                                            readOnly
                                            className={`py-2 bg-light-subtle text-muted shadow-none  border-1 ${styles.inputs}`}
                                        />
                                    <input
                                        type="hidden"
                                        name="stageId_from"
                                        value={stages.harvest ? stages.harvest?.id : 'pls wait...'}
                                        onChange={handleInputChangeMoveFish}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Process To</Form.Label>
                                    <Form.Control
                                        value={stages.washing === null ? 'Loading...' : stages.washing?.title || 'No Washing Process Available'}
                                        readOnly
                                        className={`py-2 bg-light-subtle text-muted shadow-none  border-1 ${styles.inputs}`}
                                    />
                                    <input
                                        type="hidden"
                                        name="stageId_to"
                                        value={stages.washing ? stages.washing?.id : ''}
                                        onChange={handleInputChangeMoveFish}
                                    />
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Fish Type</Form.Label>
                                    <Form.Select
                                        name="speciesId"
                                        value={moveFishData.speciesId}
                                        onChange={handleInputChangeMoveFish}
                                        required
                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                    >
                                        <option value="" disabled>Choose Fish Type</option>
                                        {fishType.length < 1 ? (
                                            <option>No data available</option>
                                        ) : (
                                            fishType.map((species, index) => (
                                                <option value={species.id} key={index}>{species.speciesName}</option>
                                            ))
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="actual_quantity"
                                        placeholder='loading...'
                                        value={selectedQuantity === false ? moveFishData.actual_quantity : 'loading...'}
                                        readOnly
                                        className={`py-2 bg-light-subtle shadow-none border-1 ${styles.inputs}`}
                                    />
                                </Col>

                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Remark</Form.Label>
                                    <Form.Control
                                        placeholder="Enter remark"
                                        as="textarea"
                                        name="remarks"
                                        value={moveFishData.remarks}
                                        onChange={handleInputChangeMoveFish}
                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-4">
                                <Button  className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`} disabled={loader} type="submit">
                                    {loader ? 'Creating' : "Create"}
                                </Button>
                            </div>
                        </Form>  
                        {showSuccessOverlay && (
                            <div className={`${styles.successOverlay}`}>
                                <div className={`${styles.successBox}`}>                                     
                                    <Form >
                                        <div className='d-flex justify-content-end'>
                                            <span className={styles.refresh} title='Refresh The Process' onClick={handleRefresh}>
                                                <MdOutlineRefresh  size={25}/>
                                            </span>
                                        </div>
                                        <h5 className={`text-end px-2 py-3 ${message ? (styles.fade_in) : (styles.fade_out)}`}>
                                            {message}
                                        </h5>
                                        <div className='d-flex gap-5'>
                                            {orderedStages.length > 0 ? (
                                                orderedStages.map((stage) => (
                                                    <Form.Check
                                                        key={stage.id}
                                                        label={stage.title}
                                                        value={stage.id}
                                                        className="text-muted fw-semibold text-uppercase"
                                                        name="stageId_from"
                                                        checked={moveData.stageId_from === stage.id}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-muted fw-semibold">Loading...</p>
                                            )}
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
                                                            type='text'  // Use 'text' to handle both numbers and the 'Loading...' text
                                                            value={whole !== null && whole !== undefined ? whole : 'Loading...'}
                                                            className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
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
                                                            className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
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
                                                        placeholder=''
                                                        value={moveData.brokenFishBefore} // Ensure this value is set correctly
                                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs} me-2`}
                                                    />
                                                    <Form.Control
                                                        type='number'
                                                        name="brokenFishQuantity"
                                                        value={moveData.brokenFishQuantity}
                                                        onChange={handleMoveFish}
                                                        required
                                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
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
                                                        placeholder=''
                                                        value={moveData.damageBefore} // Ensure this value is set correctly
                                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                                    />
                                                    <Form.Control
                                                        required
                                                        type='number'
                                                        name="damageOrLoss"
                                                        value={moveData.damageOrLoss}
                                                        onChange={handleMoveFish}
                                                        className={`py-2 bg-light-subtle shadow-none  border-1 ${styles.inputs}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-end'>
                                            <Button onClick={handleNext} disabled={loading}  className={`border-0 btn-dark shadow py-2 px-5 fs-6 mb-5 fw-semibold ${styles.submit}`}>
                                                Next
                                            </Button>
                                        </div>
                                    </Form>                                       
                                </div>
                            </div>
                        )}                 
                    </main>                    
                </section>
            </div>
        </section>
    );
}
