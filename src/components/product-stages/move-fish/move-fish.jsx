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
    const [checkStages, setCheckStages] = useState([]);
    const [selectedStageId, setSelectedStageId] = useState(null); // State to store the selected dropdown item's ID
    const [moveFishData, setMoveFishData] = useState({
        stageId_from: '',
        stageId_to: '',
        speciesId: '',
        actual_quantity: '',
        remarks: '',
    });
    const [loader, setLoader] = useState(false);
    
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const response = await Api.get('/fish-stages');
                if (Array.isArray(response.data.data)) {
                    setStages(response.data.data);
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
            setMoveFishData({
                stageId_from: '',
                stageId_to: '',
                speciesId: '',
                actual_quantity: '',
                remarks: '',
            });
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

    const handleStageFromSelect = (stageId) => {
        setMoveData({ ...moveData, stageId_from: stageId });
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
                        <Form onSubmit={handleMoveFishes}>
                            <h4 className="my-5">Move Fish</h4>
                            <Row xxl={2} xl={2} lg={2}>
                                <Col className="mb-4">
                                    <Form.Label className="fw-semibold">Stage From</Form.Label>
                                    <Form.Select
                                        name="stageId_from"  // This should be stageFrom to match the state
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
                                            stages.map((stage, index) => (
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
                                                <option value={stage.id} key={index}>{stage.title}</option>
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
                        </Form>
                        <hr />
                        <Form onSubmit={onFormSubmit}>
            <div className='d-flex gap-5'>
                {checkStages.map((stage) => (
                    <Form.Check
                        key={stage.id}
                        label={stage.title}
                        value={stage.id}
                        className="text-muted fw-semibold text-uppercase"
                        name="stageId_from"
                        checked={moveData.stageId_from === stage.id}
                        onChange={() => handleStageFromSelect(stage.id)}
                    />
                ))}
            </div>

            <div className='mt-5 mb-4'>
                {/* Whole Fish */}
                <div className='d-flex align-items-center mb-4'>
                    <p className='fw-semibold me-2 mb-0'>WHOLE FISH</p>
                    <Form.Group className="me-4">
                        <Form.Label className="fw-semibold mb-3 text-dark ps-2">Before</Form.Label>
                        <Form.Control readOnly type='number' className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fw-semibold mb-3 text-dark ps-2">After</Form.Label>
                        <Form.Control 
                            name="wholeFishQuantity" 
                            value={moveData.wholeFishQuantity} 
                            onChange={handleMoveFish}  
                            type='number' 
                            required 
                            className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1" 
                        />
                    </Form.Group>
                </div>

                {/* Broken Fish */}
                <div className='d-flex align-items-center mb-4'>
                    <p className='fw-semibold me-2 mb-0'>BROKEN FISH</p>
                    <Form.Control readOnly className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1 me-2" />
                    <Form.Control 
                        type='number'  
                        name="brokenFishQuantity"  
                        value={moveData.brokenFishQuantity} 
                        onChange={handleMoveFish}  
                        required 
                        className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1" 
                    />
                </div>

                {/* Damage or Loss */}
                <div className='d-flex align-items-center'>
                    <p className='fw-semibold me-2 mb-0'>DAMAGE/LOSS</p>
                    <Form.Control readOnly type='number' className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1" />
                    <Form.Control 
                        required 
                        type='number'  
                        name="damageOrLoss"  
                        value={moveData.damageOrLoss} 
                        onChange={handleMoveFish}  
                        className="py-2 bg-light-subtle shadow-none border-secondary-subtle border-1" 
                    />
                </div>
            </div>

            {/* Move To Select */}
            <div className='d-flex justify-content-end'>
                <select
                    id="move-to-select"
                    className="form-select mt-2 px-4 py-2 fw-semibold"
                    name="stageId_to"
                    value={moveData.stageId_to}
                    onChange={handleMoveFish}
                    aria-label="Move To"
                    required
                >
                    <option value="" disabled>Move To</option>
                    {checkStages.map((stage) => (
                        <option 
                            key={stage.id} 
                            value={stage.id}                         
                            className="text-uppercase fw-semibold"
                        >
                            {stage.title}
                        </option>
                    ))}
                    
                    <option disabled>──────────</option>
                    <option value="showcase" className="fw-semibold">SHOWCASE</option>
                </select>
            </div>
        </Form>
                    </main>
                </section>
            </div>
        </section>
    );
}


