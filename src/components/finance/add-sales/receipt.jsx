import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import styles from "../finance.module.scss"; // Import SCSS module
import Logo from "../../../assests/logo.png";

const ReceiptModal = ({ receiptData, onClose, show }) => {
    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    return (
        <Modal show={show} centered size="md">
            <Modal.Body className={styles.receiptModal}>
                <div ref={printRef}>
                    <img src={Logo} alt="logo" className="mb-3" />
                    <div className="d-flex justify-content-end">
                        <ul className="w-35 text-start text-muted">
                            <li><span>FACTORY/OFFICE</span></li>
                            <li>Kilometer 5 Osisioma</li>
                            <li>Industry Layout,</li>
                            <li>Aba, Abia State</li>
                            <li>Tel: 08170002853</li>
                            <li>Email:<br/> fendolgroup@yahoo.com</li>
                        </ul>
                    </div>
                    <div className="d-flex justify-content-center">
                        <p className="w-50 rounded-4 fw-semibold bg-light border border-secondary border-3 shadow text-center py-2 text-secondary">
                            CASH/CREDIT SALES RECEIPT
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-2 my-2">
                        <div className="bg-secondary p-3 rounded-3">
                            <p className="text-light">
                                <strong>Customer Name:</strong> <span class="text-decoration-underline">Obinna Justinet</span>
                            </p>
                        </div>
                        <div>
                            <span className="text-muted">0029</span>
                            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>                

                    <div className="text-end">
                        <p><strong>Grand Total:</strong> ₦{receiptData?.grandTotal}</p>
                        <p><strong>Paid with:</strong> {receiptData?.paymentMethod}</p>
                    </div>
                </div>

                <div className={`d-print-none ${styles.receiptButtons}`}>
                    <Button variant="primary" onClick={handlePrint}>Print</Button>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ReceiptModal;
