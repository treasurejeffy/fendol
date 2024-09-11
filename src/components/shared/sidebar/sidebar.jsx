import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Offcanvas, Button,Accordion } from 'react-bootstrap';
import { FaBars} from 'react-icons/fa'; // Importing a hamburger icon
import { IoGridOutline } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa6";
import styles from './siderbar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SideBar() {
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);


    return (
        <>
            {/* Sidebar for larger screens */}
            <section className={`position-fixed  d-none d-lg-block ${styles.sidebar}`}>
                <Nav className={`flex-column ${styles.navs}`}>
                    <div className={`shadow-sm sticky-top ${styles.header}`}>
                        <h3>FENDOL FISH</h3>
                    </div>
                    <Nav.Item className="mt-3">
                        <Nav.Link  onClick={()=>{navigate('/super-admin/dashboard')}} className={`${location.pathname === "/super-admin/dashboard"? styles.activeLink : styles.nonactiveLink}`} >
                            <IoGridOutline size={25} className="me-1 text-dark"  />  <span className={styles.title} > Dashboard</span> 
                        </Nav.Link>
                    </Nav.Item>  
                    <Accordion alwaysOpen className={`mb-4 ${styles.accordion}`}>

                        {/* admin navigations */}
                        <Accordion.Item eventKey="1" className={styles.accordion_item}>
                            <Accordion.Header className={`shadow-none ${styles.accordion_header}`}>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Admin </span>
                            </Accordion.Header>
                            <Accordion.Body className={`shadow-none ${styles.accordion_header}`} >
                                <Nav.Item>
                                    <Nav.Link onClick={()=>{navigate('/super-admin/admin/add-new-admin')}} className={`${location.pathname === "/super-admin/admin/add-new-admin"? styles.activeLink : styles.nonactiveLink}`}>
                                        <FaRegCircle size={20} className="me-1" /> Add New
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link onClick={()=>{navigate('/super-admin/admin/view-all')}} className={`${location.pathname === "/super-admin/admin/view-all"? styles.activeLink : styles.nonactiveLink}`}>
                                        <FaRegCircle size={20} className="me-1"  /> View All
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link onClick={()=>{navigate('/super-admin/admin/deactivated-admin')}} className={`${location.pathname === "/super-admin/admin/deactivated-admin"? styles.activeLink : styles.nonactiveLink}`}>
                                        <FaRegCircle size={20} className="me-1"  /> Deactivated ad..
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* pond navigations */}
                        <Accordion.Item eventKey="2" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Pond </span> 
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-pond">
                                        <FaRegCircle size={20} className="me-1"/> Create Pond
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-all-ponds">
                                        <FaRegCircle size={20} className="me-1" /> View All Ponds
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#create-pond">
                                        <FaRegCircle size={20} className="me-1" /> Add Fish
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-all-ponds">
                                        <FaRegCircle size={20} className="me-1" /> View Details
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* products navigations   */}
                        <Accordion.Item eventKey="3" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /><span className={styles.title}>Products</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-products">
                                        <FaRegCircle size={20} className="me-1" /> Create Products
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-products">
                                        <FaRegCircle size={20}  className="me-1"/> View All
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* showcase navigations */}
                        <Accordion.Item eventKey="4" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}>Showcase</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-showcase">
                                        <FaRegCircle size={20} className="me-1" /> Create 
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#add-new">
                                        <FaRegCircle size={20} className="me-1" />Add New 
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#broken-showcase">
                                        <FaRegCircle size={20} /> Broken Showcase
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#whole-showcase">
                                        <FaRegCircle size={20} className="me-1" />Whole Showcase
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#place-order">
                                        <FaRegCircle size={20}className="me-1" />Place Order
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* feed navigations */}
                        <Accordion.Item eventKey="5" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Feed </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#add-new">
                                        <FaRegCircle size={20} className="me-1" /> Add New
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-feed">
                                        <FaRegCircle size={20} className="me-1"/> View Details
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#update-inventory">
                                        <FaRegCircle size={20} className="me-1" /> Update Inventory
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* process control navigations */}
                        <Accordion.Item eventKey="6" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Process Control</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#control-batch">
                                        <FaRegCircle size={20} className="me-1" />Control Batch
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-summary">
                                        <FaRegCircle size={20}  className="me-1"/> View Summary
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* damage/loss navigations */}
                        <Accordion.Item eventKey="7" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Damage/Loss</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-damage">
                                        <FaRegCircle size={20} className="me-1" />Create
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-damage">
                                        <FaRegCircle size={20}  className="me-1"/> View 
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* sales navigations */}
                        <Accordion.Item eventKey="8" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}>Sales</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-sales">
                                        <FaRegCircle size={20} className="me-1" />Create
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-sales">
                                        <FaRegCircle size={20}  className="me-1"/> View 
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>
                        
                        {/* expenses navigations */}
                        <Accordion.Item eventKey="9" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /> <span className={styles.title}> Expenses</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#create-expenses">
                                        <FaRegCircle size={20} className="me-1" />Create
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#view-expenses">
                                        <FaRegCircle size={20}  className="me-1"/> View 
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Report navigations */}
                        <Accordion.Item eventKey="10" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /><span className={styles.title}>Report </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#report-pond">
                                        <FaRegCircle size={20} className="me-1" />Pond
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#report-product">
                                        <FaRegCircle size={20}  className="me-1"/> Product
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#report-feed">
                                        <FaRegCircle size={20} className="me-1" />Feed
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#report-showcase">
                                        <FaRegCircle size={20}  className="me-1"/> Showcase
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#report-processes">
                                        <FaRegCircle size={20} className="me-1" />Process Control
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#report-finance">
                                        <FaRegCircle size={20}  className="me-1"/> Finance Ledger
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Notification navigations */}
                        <Accordion.Item eventKey="11" className={styles.accordion_item}>
                            <Accordion.Header>
                                <LuClipboardCheck size={25} className="me-1" /><span className={styles.title}> Notification</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Nav.Item>
                                    <Nav.Link href="#low-stock">
                                        <FaRegCircle size={20} className="me-1" />Low Stock
                                    </Nav.Link>
                                </Nav.Item>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>                
                </Nav>
            </section>

            {/* Hamburger icon for medium and smaller screens */}
            <div className="d-lg-none">
                <Button  className="m-3 border-0 bg-white" onClick={handleShow}>
                    <FaBars  size={25} className="text-dark"/> {/* Hamburger icon */}
                </Button>
            </div>

            {/* Offcanvas component for medium and smaller screens */}
            <Offcanvas show={showOffCanvas} onHide={handleClose} placement="start" className='bg-light'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className={styles.md_title} >FENDOL FISH</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">                        
                        <Nav.Item>
                            <Nav.Link href="#dashboard" >
                                <IoGridOutline size={25} />   Dashboard
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="" >
                                <LuClipboardCheck size={25} />  Admin
                            </Nav.Link>
                        </Nav.Item>    
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
