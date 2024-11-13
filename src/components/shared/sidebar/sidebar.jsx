import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Card, Collapse, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { IoGridOutline } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa6";
import styles from './siderbar.module.scss';
import { useLocation, useNavigate,Link } from 'react-router-dom';

export default function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState({});

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin')) {
            setOpen(prev => ({ ...prev, admin: true }));
        } else if (path.includes('/ponds')) {
            setOpen(prev => ({ ...prev, ponds: true }));
        } else if (path.includes('/customer')) {
            setOpen(prev => ({ ...prev, customer: true }));
        } else if (path.includes('/process')) {
            setOpen(prev => ({ ...prev, process: true }));
        } else if (path.includes('/products')) {
            setOpen(prev => ({ ...prev, products: true }));
        } else if (path.includes('/showcase')) {
            setOpen(prev => ({ ...prev, showcase: true }));
        } else if (path.includes('/feed')) {
            setOpen(prev => ({ ...prev, feed: true }));
        }  else if (path.includes('/store')) {
            setOpen(prev => ({ ...prev, store: true }));
        }else if (path.includes('/finance')) {
            setOpen(prev => ({ ...prev, finance: true }));
        } else if (path.includes('/report')) {
            setOpen(prev => ({ ...prev, report: true }));
        } else if (path.includes('/notification')) {
            setOpen(prev => ({ ...prev, notification: true }));
        }
    }, [location.pathname]);

    const handleToggle = (key) => {
        setOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <aside>
            <section className={`position-fixed d-none d-lg-block ${styles.sidebar}`}>
                <Nav className={`flex-column ${styles.navs}`}>
                    <Nav.Item className="mt-3">
                        <Nav.Link
                            onClick={() => navigate('#/dashboard')}
                            className={`${location.pathname === "#/dashboard" ? styles.activeLink : styles.nonactiveLink}`}
                        >
                            <IoGridOutline size={25} className="me-1 text-dark" /> <span className={styles.title}>Dashboard</span>
                        </Nav.Link>
                        <Link to={''}></Link>
                    </Nav.Item>
                    <div className={`mb-4 ${styles.navigationDropdown}`}>

                        {/* Admin navigations */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('admin')}
                                aria-controls="admin-collapse-text"
                                aria-expanded={open.admin}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Admin
                                </span>
                                <span>
                                    {open.admin ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.admin} style={{ transitionDuration: "0s" }}>
                                <div id="admin-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-add-new">Add a new admin</Tooltip>}
                                            >
                                                <div
                                                    onClick={() => navigate('/admin/add-new-admin')}
                                                    className={`${location.pathname === "/admin/add-new-admin" ? styles.activeLink : styles.nonactiveLink}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <FaRegCircle size={20} className="me-1" /> Add New
                                                </div>
                                            </OverlayTrigger>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id="tooltip-view-all">View all admins</Tooltip>}
                                            >
                                                <div
                                                    onClick={() => navigate('/admin/view-all')}
                                                    className={`${location.pathname === "/admin/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <FaRegCircle size={20} className="me-1" /> View All
                                                </div>
                                            </OverlayTrigger>
                                        </Nav.Item>                                    
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                        
                        {/* Customer navigation */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('customer')}
                                aria-controls="customer-collapse-text"
                                aria-expanded={open.customer}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Customer
                                </span>
                                <span>
                                    {open.customer ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.customer} style={{ transitionDuration: "0s" }}>
                                <div id="customer-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/customer/add')}
                                                className={`${location.pathname === "/customer/add" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> Add Customer
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/customer/view-all')}
                                                className={`${location.pathname === "/customer/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> View All
                                            </div>
                                        </Nav.Item>      
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/customer/ledger')}
                                                className={`${location.pathname === "/customer/ledger" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> View Ledger
                                            </div>
                                        </Nav.Item>                                   
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Pond navigation */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('ponds')}
                                aria-controls="ponds-collapse-text"
                                aria-expanded={open.ponds}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Ponds
                                </span>
                                
                                <span >
                                    {open.ponds ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.ponds} style={{ transitionDuration: "0s" }}>
                                <div id="ponds-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/ponds/create')}
                                                className={`${location.pathname === '/ponds/create' ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> Create Pond
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/ponds/view-all-ponds')}
                                                className={`${location.pathname === "/ponds/view-all-ponds" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> View All Ponds
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/ponds/create-fish-type')}
                                                className={`${location.pathname === '/ponds/create-fish-type' ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> Create Fish Type
                                            </div>
                                        </Nav.Item>                                        
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/ponds/add-fish')}
                                                className={`${location.pathname === "/ponds/add-fish" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> Add Fish
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/ponds/move-fish')}
                                                className={`${location.pathname === "/ponds/move-fish" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> Move Fish
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/ponds/view-add-fish-history')}
                                                className={`${location.pathname === "/ponds/view-add-fish-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> View Add Fish History
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/ponds/view-move-fish-history')}
                                                className={`${location.pathname === "/ponds/view-move-fish-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={17} className="me-1" /> View Move Fish Hist..
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Process navigation */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('process')}
                                aria-controls="process-collapse-text"
                                aria-expanded={open.process}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Process Control
                                </span>
                                <span>
                                    {open.process ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.process} style={{ transitionDuration: "0s" }}>
                                <div id="process-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/process-control/create-process')}
                                                className={`${location.pathname === "/process-control/create-process" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" />Create Process
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/process-control/new-batch')}
                                                className={`${location.pathname === "/process-control/new-batch" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" />New Batch
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/process-control/view-summary')}
                                                className={`${location.pathname === "/process-control/view-summary" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View Summary
                                            </div>
                                        </Nav.Item>                                        
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Products navigation */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('products')}
                                aria-controls="products-collapse-text"
                                aria-expanded={open.products}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Products
                                </span>
                                <span>
                                    {open.products ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.products} style={{ transitionDuration: "0s" }}>
                                <div id="products-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/products/create-products')}
                                                className={`${location.pathname === "/products/create-products" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create Products
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/products/view-all')}
                                                className={`${location.pathname === "/products/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View All
                                            </div>
                                        </Nav.Item>                                        
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                        
                        {/* Showcase navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('showcase')} 
                                aria-controls="showcase-collapse-text" 
                                aria-expanded={open.showcase}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Showcase
                                </span> 
                                <span>
                                    {open.showcase ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.showcase} style={{ transitionDuration: "0s" }}>
                                <div id="showcase-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/add-new')} 
                                                className={`${location.pathname === "/showcase/add-new"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/broken-showcase')} 
                                                className={`${location.pathname === "/showcase/broken-showcase"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Broken Showcase
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/whole-showcase')} 
                                                className={`${location.pathname === "/showcase/whole-showcase"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Whole Showcase
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/place-order')} 
                                                className={`${location.pathname === "/sshowcase/place-order"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Package History
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Feed navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('feed')} 
                                aria-controls="feed-collapse-text" 
                                aria-expanded={open.feed}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Feed
                                </span> 
                                <span>
                                    {open.feed ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.feed} style={{ transitionDuration: "0s" }}>
                                <div id="feed-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/add-new')} 
                                                className={`${location.pathname === "/feed/add-new" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/view-all')} 
                                                className={`${location.pathname === "/feed/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View All
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/inventory-history')} 
                                                className={`${location.pathname === "/feed/inventory-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Inventory History
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* store navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('store')} 
                                aria-controls="store-collapse-text" 
                                aria-expanded={open.store}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Store
                                </span> 
                                <span>
                                    {open.store ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.store} style={{ transitionDuration: "0s" }}>
                                <div id="feed-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/add-new')} 
                                                className={`${location.pathname === "/store/add-new" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/view-all')} 
                                                className={`${location.pathname === "/store/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View All
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/inventory-history')} 
                                                className={`${location.pathname === "/store/inventory-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Inventory History
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* finance navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('finance')} 
                                aria-controls="finance-collapse-text" 
                                aria-expanded={open.finance}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Finance
                                </span> 
                                <span>
                                    {open.finance ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.finance} style={{ transitionDuration: "0s" }}>
                                <div id="finance-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/finance/add-sales')} 
                                                className={`${location.pathname === "/finance/add-sales" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add Sales
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/finance/add-expenses')} 
                                                className={`${location.pathname === "/finance/add-expenses" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add Expenses
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/finance/staff-salary')} 
                                                className={`${location.pathname === "/finance/staff-salary" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Staff Salary
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/finance/ledger')} 
                                                className={`${location.pathname === "/finance/ledger" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" />Finance Ledger
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Report navigation*/}
                        {/* <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('report')} 
                                aria-controls="report-collapse-text" 
                                aria-expanded={open.report}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Report
                                </span>
                                <span>
                                    {open.report ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.report} style={{ transitionDuration: "0s" }}>
                                <div id="report-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-pond')} 
                                                className={`${location.pathname === "#report-pond" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Pond
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-product')} 
                                                className={`${location.pathname === "#report-product" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Product
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-feed')} 
                                                className={`${location.pathname === "#report-feed" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Feed
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-showcase')} 
                                                className={`${location.pathname === "#report-showcase" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Showcase
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-processes')} 
                                                className={`${location.pathname === "#report-processes" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Process Control
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#report-finance')} 
                                                className={`${location.pathname === "#report-finance" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Finance Ledger
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card> */}

                        <Nav.Item className="mt-3">
                            <Nav.Link
                                onClick={() => navigate('/damage-loss')}
                                className={` ${location.pathname === "/damage-loss" ? styles.active: styles.nonactive}`}
                            >
                              <LuClipboardCheck size={25}  className={`${location.pathname === "/damage-loss" ? styles.activeIcon : styles.nonactiveIcon}`} /> <span className={ `me-1 fw-semibold ${location.pathname === "/damage-loss" ? styles.active : styles.nonactive}`} >Damage/Loss</span>
                            </Nav.Link>
                            <Link to={''}></Link>
                        </Nav.Item>

                        {/* Notification navigation */}
                        {/* <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('notification')} 
                                aria-controls="notification-collapse-text" 
                                aria-expanded={open.notification}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Notification
                                </span>
                                <span>
                                    {open.notification ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.notification} style={{ transitionDuration: "0s" }}>
                                <div id="notification-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#low-stock')} 
                                                className={`${location.pathname === "#low-stock" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Low Stock
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>                             */}
                    </div>
                </Nav>
            </section>
        </aside>
    );
}

