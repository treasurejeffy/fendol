import React, {useState} from "react";
import SideBar from "../../../shared/sidebar/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, Row, InputGroup,Button } from 'react-bootstrap';
import { GoQuestion } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { FaRegUserCircle } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from '../admin-styles.module.scss';

export default function AddNew() {
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <section className="d-flex gap-2">
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <SideBar />
      </div>

      {/* Content */}
      <section className={`${styles.content} `}>
        <div className={`d-flex shadow-sm justify-content-between px-3 align-items-center ${styles.header_box}`}>
          <div className={styles.header}>
            <h3>Welcome ADMIN!</h3>
            <p>Stay informed and make data-driven decisions to keep everything running smoothly.</p>
          </div>
          <div className="d-flex align-items-center">
            <GoQuestion size={28} className="me-3" />
            <IoMdNotifications size={28} className="me-3" />
            <FaRegUserCircle size={37} />
          </div>
        </div>
        <main>
            <Form className={styles.create_form}>
                <h4 className="my-5">Create Admin</h4>
                <Row xxl={2} xl={2} lg={2} md={1} sm={1} xs={1} >
                    <Col className="mb-4">
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control placeholder="John Doe" className="py-2" type="text"/>
                    </Col>
                    <Col  className="mb-4">
                        <Form.Label className="fw-semibold">E-Mail</Form.Label>
                        <Form.Control placeholder="johndoe@gamil.com" className="py-2" type="email"/>
                    </Col>
                    <Col  className="mb-4">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <InputGroup className="mb-4">
                            <Form.Control
                            type={showPassword ? "text" : "password"}
                            className="shadow-none border-end-0 py-2"
                            placeholder="**********"
                            minLength={7}
                            maxLength={10}
                            required
                            />
                            <InputGroup.Text
                            onClick={togglePasswordVisibility}
                            className=" border-start-0 py-2"
                            style={{ cursor: "pointer" }}
                            >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col  className="mb-4">
                        <Form.Label className="fw-semibold">Role</Form.Label>
                        <Form.Control placeholder="Worker" type="text" className="py-2"/>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end">
                    <Button className=" btn shadow btn-dark py-2 px-5 fs-6 fw-semibold" disabled={loader}>
                        {loader ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        ) : (
                        "Create"
                        )}
                    </Button>
                </div>
            </Form>
        </main>        
      </section>
    </section>
  );
}
