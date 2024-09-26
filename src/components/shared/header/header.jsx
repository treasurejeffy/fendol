import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import { GoQuestion } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { FaRegUserCircle } from 'react-icons/fa';
import styles from './header.module.scss'


export default function Header() {
    return(
        <header>
            <div className={`shadow-sm sticky-top d-flex pe-5 ps-3 aligns-items-center ${styles.header}`} style={{height:'70px'}} >
                <div className={`d-flex align-items-center mt-2 ms-1 ${styles.brand}`}>
                    <h3>FENDOL FISH</h3>
                </div>            
                <Form className={`d-flex align-items-center ${styles.search}`}>
                    <InputGroup >
                        <InputGroup.Text id="inputGroup-sizing-lg" className='rounded-start-pill border-secondary bg-white border-1 border-end-0'><FaSearch/></InputGroup.Text>
                        <Form.Control size="50"
                        aria-label="Large"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Search..."
                        className='border-start-0 rounded-end-pill border-1 border-secondary shadow-none'
                        />
                    </InputGroup>
                </Form>
                <div className={`d-flex align-items-center justify-content-end ${styles.icon}`}>
                    <IoMdNotifications size={25} className="me-3" />
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle className="bg-transparent text-dark border-0" id="dropdown-basic">
                            <FaRegUserCircle size={32} className="me-1 " /> <span>Admin</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="border border-secondary bg-light-subtle">
                            <Dropdown.Item href="#logout" className="fw-semibold">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </header>
    )
}