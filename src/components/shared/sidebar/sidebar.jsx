import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Card, Collapse} from 'react-bootstrap';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { IoGridOutline } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa6";
import styles from './siderbar.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState({});

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin')) {
            setOpen(prev => ({ ...prev, admin: true }));
        } else if (path.includes('/product-stages')) {
            setOpen(prev => ({ ...prev, product_stages: true }));
        } else if (path.includes('/products')) {
            setOpen(prev => ({ ...prev, products: true }));
        } else if (path.includes('/showcase')) {
            setOpen(prev => ({ ...prev, showcase: true }));
        } else if (path.includes('/feed')) {
            setOpen(prev => ({ ...prev, feed: true }));
        }  else if (path.includes('/store')) {
            setOpen(prev => ({ ...prev, store: true }));
        } else if (path.includes('/process-control')) {
            setOpen(prev => ({ ...prev, process_control: true }));
        } else if (path.includes('/damage-loss')) {
            setOpen(prev => ({ ...prev, damage_loss: true }));
        } else if (path.includes('/sales')) {
            setOpen(prev => ({ ...prev, sales: true }));
        } else if (path.includes('/expenses')) {
            setOpen(prev => ({ ...prev, expenses: true }));
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
                            onClick={() => navigate('/dashboard')}
                            className={`${location.pathname === "/dashboard" ? styles.activeLink : styles.nonactiveLink}`}
                        >
                            <IoGridOutline size={25} className="me-1 text-dark" /> <span className={styles.title}>Dashboard</span>
                        </Nav.Link>
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

                            <Collapse in={open.admin}>
                                <div id="admin-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/admin/add-new-admin')}
                                                className={`${location.pathname === "/admin/add-new-admin" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/admin/view-all')}
                                                className={`${location.pathname === "/admin/view-all" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View All
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/admin/deactivated-admin')}
                                                className={`${location.pathname === "/admin/deactivated-admin" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Deactivated ad..
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Product stages navigation */}
                        <Card className={styles.card}>
                            <Card.Header
                                onClick={() => handleToggle('product_stages')}
                                aria-controls="product_stages-collapse-text"
                                aria-expanded={open.product_stages}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Product Stages
                                </span>
                                <span>
                                    {open.product_stages ? <FaCaretUp /> : <FaCaretDown />}
                                </span>
                            </Card.Header>

                            <Collapse in={open.product_stages}>
                                <div id="product_stages-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/product-stages/create-stages')}
                                                className={`${location.pathname === '/product-stages/create-stages' ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create Stages
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/product-stages/view-all-stages')}
                                                className={`${location.pathname === "/product-stages/view-all-stages" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View All Stages
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/product-stages/add-fish')}
                                                className={`${location.pathname === "/product-stages/add-fish" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add Fish
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/product-stages/move-fish')}
                                                className={`${location.pathname === "/product-stages/move-fish" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Move Fish
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/product-stages/view-add-fish-history')}
                                                className={`${location.pathname === "/product-stages/view-add-fish-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View Add Fish History
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('/product-stages/view-move-fish-history')}
                                                className={`${location.pathname === "/product-stages/view-move-fish-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View Move Fish Hist..
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

                            <Collapse in={open.products}>
                                <div id="products-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div
                                                onClick={() => navigate('/products/create-products')}
                                                className={`${location.pathname === "products/create-products" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create Products
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="my-3">
                                            <div
                                                onClick={() => navigate('#view-products')}
                                                className={`${location.pathname === "#view-products" ? styles.activeLink : styles.nonactiveLink}`}
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

                            <Collapse in={open.showcase}>
                                <div id="showcase-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/create-showcase')} 
                                                className={`${location.pathname === "showcase/create-showcase"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create 
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/add-new')} 
                                                className={`${location.pathname === "showcase/add-new"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/broken-showcase')} 
                                                className={`${location.pathname === "showcase/broken-showcase"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Broken Showcase
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/whole-showcase')} 
                                                className={`${location.pathname === "showcase/whole-showcase"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Whole Showcase
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/showcase/place-order')} 
                                                className={`${location.pathname === "showcase/place-order"? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Place Order
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

                            <Collapse in={open.feed}>
                                <div id="feed-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/add-new')} 
                                                className={`${location.pathname === "feed/add-new" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/update-inventory')} 
                                                className={`${location.pathname === "feed/update-inventory" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Update Inventory
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/feed/inventory-history')} 
                                                className={`${location.pathname === "feed/inventory-history" ? styles.activeLink : styles.nonactiveLink}`}
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

                            <Collapse in={open.store}>
                                <div id="feed-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/add-new')} 
                                                className={`${location.pathname === "store/add-new" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Add New
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/update-inventory')} 
                                                className={`${location.pathname === "store/update-inventory" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Update Inventory
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('/store/inventory-history')} 
                                                className={`${location.pathname === "store/inventory-history" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Inventory History
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* process control navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('process_control')} 
                                aria-controls="process_control-collapse-text" 
                                aria-expanded={open.process_control}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Process Control
                                </span>
                                <span>
                                    {open.process_control ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.process_control}>
                                <div id="feed-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#control-batch')} 
                                                className={`${location.pathname === "#control-batch" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Control Batch
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#view-summary')} 
                                                className={`${location.pathname === "#view-summary" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View Summary
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Damage/Loss navigation */}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('damage_loss')} 
                                aria-controls="damage_loss-collapse-text" 
                                aria-expanded={open.damage_loss}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Damage/Loss
                                </span>
                                <span>
                                    {open.damage_loss ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.damage_loss}>
                                <div id="damage_loss-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#create-damage')} 
                                                className={`${location.pathname === "#create-damage" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#view-damage')} 
                                                className={`${location.pathname === "#view-damage" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Sales navigation*/}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('sales')} 
                                aria-controls="sales-collapse-text" 
                                aria-expanded={open.sales}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Sales
                                </span>
                                <span>
                                    {open.sales ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.sales}>
                                <div id="sales-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#create-sales')} 
                                                className={`${location.pathname === "#create-sales" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#view-sales')} 
                                                className={`${location.pathname === "#view-sales" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Expenses navigation*/}
                        <Card className={styles.card}>
                            <Card.Header 
                                onClick={() => handleToggle('expenses')} 
                                aria-controls="expenses-collapse-text" 
                                aria-expanded={open.expenses}
                                className={`border-0 d-flex justify-content-between align-items-center ${styles.cardHeader}`}
                            >
                                <span className={`${styles.title}`}>
                                    <LuClipboardCheck size={25} className="me-1" /> Expenses
                                </span>
                                <span>
                                    {open.expenses ? <FaCaretUp/> : <FaCaretDown/>}
                                </span>
                            </Card.Header>

                            <Collapse in={open.expenses}>
                                <div id="expenses-collapse-text">
                                    <Card.Body className={styles.navigationLinks}>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#create-expenses')} 
                                                className={`${location.pathname === "#create-expenses" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> Create
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item className="mb-3">
                                            <div 
                                                onClick={() => navigate('#view-expenses')} 
                                                className={`${location.pathname === "#view-expenses" ? styles.activeLink : styles.nonactiveLink}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FaRegCircle size={20} className="me-1" /> View
                                            </div>
                                        </Nav.Item>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>

                        {/* Report navigation*/}
                        <Card className={styles.card}>
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

                            <Collapse in={open.report}>
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
                        </Card>

                        {/* Notification navigation */}
                        <Card className={styles.card}>
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

                            <Collapse in={open.notification}>
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
                        </Card>                            
                    </div>
                </Nav>
            </section>
        </aside>
    );
}

