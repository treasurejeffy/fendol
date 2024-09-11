import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, FloatingLabel, InputGroup, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './login.scss'
import top from '../../../assests/top.png';
import bottom from '../../../assests/bottom.png';

export default function LogIn() {
    const [showPassword, setShowPassword] = useState(false);
    
    const [loader, setLoader] = useState(false);
    const [feedBack, setFeedBack] = useState('')

    // Display password FUNCTION
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // submiting login FUNCTION
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            
        } catch (error) {
            
        }
    }

    return (
        <section className="login_section">
            <div className="text-end">
                <img src={top} alt="Top Vector" className="top-img" />
            </div>
            <Container>
                <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="form-box rounded-5">
                <Form className="form" onSubmit={handleSubmit}>
                    <h2 className="fw-bold text-center">FENDOL</h2>
                    <h5 className="py-3 login fw-semibold">Log in</h5>
                    
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                        type="email"
                        className="shadow-none input"
                        placeholder="name@example.com"
                        required
                    />
                    
                    <Form.Label className="mt-4 fw-semibold">Password</Form.Label>
                    <InputGroup className="mb-4">
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        className="shadow-none border-end-0 input"
                        placeholder="Password"
                        required
                        />
                        <InputGroup.Text
                        onClick={togglePasswordVisibility}
                        className="input border-white border-start-0 text-white"
                        style={{ cursor: "pointer" }}
                        >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </InputGroup>
                    
                    <a href="" className="text-white border-0 fw-semibold">Forgot Password?</a>
                    
                    <Button className="w-100 btn shadow btn-dark py-2 fs-5 mt-5 fw-semibold" disabled={loader}>
                        {loader ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        ) : (
                        "Log in"
                        )}
                    </Button>
                </Form>

                </div>
                </div>
            </Container>
            <div className="text-start">
                <img src={bottom} alt="Bottom Vector" className="bottom-img" />
            </div>
        </section>
    );
}
