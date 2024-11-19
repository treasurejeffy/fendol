import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import { GoQuestion } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { FaRegUserCircle } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import Logo from '../../../assests/logo.png';
import styles from './header.module.scss';


export default function Header() {
    const navigate = useNavigate();
    return(
        <header>
            <div className={`shadow-sm sticky-top d-flex pe-5 ps-3 aligns-items-center ${styles.header}`} style={{height:'70px'}} >
                <div className={`d-flex align-items-center mt-2 ${styles.brand}`}>
                    <img src={Logo} alt="logo" />
                </div>            

                <Form className={`d-flex align-items-center ${styles.search}`}>
                    <div className="position-relative w-100">
                        <Form.Control
                            size="50"
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                            placeholder="Search..."
                            readOnly
                            id={styles.input}
                            className="ps-5 border-1 shadow-none rounded-pill"
                        />
                        <FaSearch
                            className="position-absolute top-50 translate-middle-y ms-3 text-secondary"
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                </Form>

                <div className={`d-flex align-items-center justify-content-end ${styles.icon}`}>
                    <IoMdNotifications size={25} className={`me-3 ${styles.icons}`} />
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle className="bg-transparent text-dark border-0" id="dropdown-basic">
                            <FaRegUserCircle size={32} className={`me-1 ${styles.icons}`} /> <span>Admin</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="border border-secondary bg-light-subtle">
                            <Dropdown.Item className="fw-semibold" onClick={()=>{sessionStorage.clear(); navigate('/') }}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </header>
    )
}