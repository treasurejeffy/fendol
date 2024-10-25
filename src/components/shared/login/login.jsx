import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './login.scss';
import top from '../../../assests/top.png';
import bottom from '../../../assests/bottom.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN_USER } from "../reduxForProtectingRoute/actions/types";
import 'react-toastify/dist/ReactToastify.css';

export default function LogIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
    
        // Show loading toast
        const loadingToast = toast.loading("Logging in...", { className: 'dark-toast' });
    
        try {
          const response = await axios.post('https://dev-api.fendolgroup.com/api/v1/login', loginData);
          const token = response.data.token; // Adjust according to API response structure
          const success = response.data.success; // Assuming your API sends a 'success' field
    
          if (success) {
            console.log('Login successful');
    
            // Store token in local storage
            sessionStorage.setItem('authToken',(token));
    
            // Dispatch token to Redux
            dispatch({ type: LOGIN_USER, payload: token });
    
            // Update success toast
            toast.update(loadingToast, {
              render: "Logged in successfully!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              className: 'dark-toast',
            });
    
            // Clear form data
            setLoginData({ email: '', password: '' });
    
            // Navigate to the desired page after success
            navigate('/admin/add-new-admin');
          } else {
            // Handle failure
            throw new Error("Login failed");
          }
        } catch (error) {
          // Show error toast
          toast.update(loadingToast, {
            render: error.response?.data?.message || "Error logging in. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 7000,
            className: 'dark-toast',
          });
        } finally {
          setLoader(false); // Reset loader state
        }
    };
    
    return (
        <section className="login_section">
            <div className="text-end">
                <img src={top} alt="Top Vector" className="top-img" />
            </div>
            <Container>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="form-box rounded-5">
                        <Form className="form" onSubmit={handleSubmit}>
                            <h2 className="fw-bold text-center py-4">FENDOL</h2>                           

                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                className="shadow-none input"
                                placeholder="name@example.com"
                                value={loginData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <Form.Label className="mt-4 fw-semibold">Password</Form.Label>
                            <InputGroup className="mb-4">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="shadow-none border-end-0 input"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
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
                            <Button type="submit" className="w-100 btn shadow btn-dark py-2 fs-5 mt-5 fw-semibold" disabled={loader}>
                                {loader ? 'Logging In' : "Log in"}
                            </Button>
                        </Form>
                    </div>
                </div>
            </Container>
            <div className="text-start">
                <img src={bottom} alt="Bottom Vector" className="bottom-img" />
            </div>
            <ToastContainer />
        </section>
    );
}
