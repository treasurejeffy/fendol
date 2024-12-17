import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { IoMdNotifications } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FiDownload } from "react-icons/fi"; // Download icon
import { useNavigate } from "react-router-dom";
import Logo from "../../../assests/logo.png";
import styles from "./header.module.scss";

export default function Header() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
  
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
  

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  return (
    <header>
      <div className={`shadow-sm sticky-top py-1 ${styles.header}`}>
        <Row className="align-items-center g-0 px-3">
          {/* Logo Section */}
          <Col xs={6} lg={8} className={`d-flex align-items-center text-start ${styles.brand}`}>
            <img src={Logo} alt="logo" />
          </Col>

          {/* Icons Section */}
          <Col xs={6} lg={4} className="d-flex align-items-center justify-content-end pe-lg-4">
            {/* Notification Icon */}
            <IoMdNotifications size={25} className={`me-3 ${styles.icons}`} />

            {/* Download App Button */}
            {isInstallable && (
              <Button
                variant="outline-dark"
                onClick={handleInstallClick}
                className="me-3 d-flex align-items-center"
              >
                <FiDownload className="me-1" size={20} />
                <span className="d-none d-lg-inline">Download App</span>
              </Button>
            )}

            {/* User Dropdown */}
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle className="bg-transparent text-dark border-0" id="dropdown-basic">
                <FaRegUserCircle size={32} className={`me-1 ${styles.icons}`} />
                <span className="d-none d-lg-inline fw-semibold">
                  {sessionStorage
                    .getItem("role")
                    ?.replace(/_/g, " ") // Replace underscores with spaces
                    .replace(/\b\w/g, (char) => char.toUpperCase())} {/* Capitalize first letters */}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border border-secondary bg-light-subtle">
                <Dropdown.Item
                  className="fw-semibold"
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/");
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>
    </header>
  );
}
