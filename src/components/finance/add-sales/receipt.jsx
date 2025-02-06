import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import styles from "../finance.module.scss"; // Import SCSS module
import Logo from "../../../assests/logo.png";

const ReceiptModal = ({ receiptData, onClose, show }) => {
    const printRef = useRef();

    const handlePrint = () => {
        if (printRef.current) {
            // Create a container for printing
            const printContainer = document.createElement("div");
            printContainer.id = "printable-content";
            
            // Apply styles to ensure it fills the page and is visible
            printContainer.style.position = "fixed";
            printContainer.style.top = "0";
            printContainer.style.left = "0";
            printContainer.style.width = "100%";
            printContainer.style.minHeight = "100vh";
            printContainer.style.backgroundColor = "white";
            printContainer.style.zIndex = "9999"; // High z-index to bring it to the front
            printContainer.style.padding = "20px";
            printContainer.style.boxSizing = "border-box";
            
            // Copy the content from printRef into the container
            printContainer.innerHTML = printRef.current.innerHTML;
            
            // Append to the document body
            document.body.appendChild(printContainer);
            
            // Wait a moment to ensure the container is rendered, then print
            setTimeout(() => {
                window.print();
                // Remove the container after printing
                document.body.removeChild(printContainer);
            }, 100);
        }
    };       
    
    if (!receiptData || !receiptData.receipt) {
        return (
            <Modal show={show} centered size="md">
                <Modal.Body className="text-center">
                    <p>No receipt data available.</p>
                    <Button variant="danger" onClick={onClose}>Close</Button>
                </Modal.Body>
            </Modal>
        );
    }

    const { receipt } = receiptData;
    
    return (
        <Modal show={show} centered size="md">
            <Modal.Body className={styles.receiptModal}>
                <div ref={printRef}>
                    <img src={Logo} alt="logo"/>
                    <div className="d-flex justify-content-end">
                        <ul className="w-35 text-start text-muted">
                            <li><span>FACTORY/OFFICE:</span></li>
                            <li>Kilometer 5 Osisioma <br/> Industry Layout, </li>
                            <li>Aba, Abia State.</li>
                            <li>Tel: 08170002853</li>
                            <li>Email:<br/> fendolgroup@yahoo.com</li>                        
                        </ul>
                    </div>
                    <div className="d-flex justify-content-center">
                        <p className="w-50 rounded-4 fw-semibold bg-light border border-secondary border-3 shadow text-center py-2 text-secondary">
                            SALES RECEIPT
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-2 my-2">
                        <div className="bg-secondary p-3 shadow rounded-3 border-2 border-secondary-subtle" style={{ width: "60%" }}>
                            <p className="text-light">
                                <strong>{receiptData.receipt.customerCategory} Name:</strong> <span className=" px-3 text-decoration-underline">{receiptData.receipt.customerAddress}</span>
                            </p>
                            <p className="text-light">
                                <strong>Address:</strong> <span className="px-3 text-decoration-underline">{receiptData.receipt.customerAddress}</span>
                            </p>
                            <p className="text-light">
                                <strong>Served by:</strong> <span className=" px-3 text-decoration-underline">{receiptData.receipt.servedBy}</span>
                            </p>
                        </div>
                        <div>
                            <span style={{ 
                                display: 'inline-block', // Required for transform to work
                                transform: 'rotate(8deg)',                                 
                                margin: '20px 10px 30px',
                                fontSize: '1.4rem',
                                color: '#D2D2D2',
                                fontStyle: 'italic',
                                fontWeight: '600',
                                transformOrigin: 'center' // Ensures the text rotates around its center
                            }}>
                                {receiptData.receipt.receiptNumber}
                            </span>
                            <p><strong>Date:</strong> <span className="text-decoration-underline px-3"> {receiptData.receipt.date}</span></p>
                            <p><strong>Time:</strong> <span className="text-decoration-underline px-3">  {receiptData.receipt.time} </span> </p>
                        </div>
                    </div>                

                    <table className="table mt-4">
                        <thead className="bg-secondary">
                            <tr className='bg-secondary'>
                                <th>PRODUCT</th>
                                <th>QUANTITY</th>
                                <th>TOTAL(₦)</th>
                                <th>PRICE (₦)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.receipt.items.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.product}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.total?.toLocaleString()}</td>
                                    <td>{product.unitPrice?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-end text-muted">
                        <p><strong>Grand Total:</strong> ₦{receiptData.receipt.totalAmount?.toLocaleString()}</p>
                        <p><strong>Paid:</strong> ₦{receiptData.receipt.amountPaid?.toLocaleString()}</p>
                        <p><strong>Amount Due:</strong> ₦{receiptData.receipt.remainingBalance?.toLocaleString()}</p>
                        <p><strong>Payment Type:</strong> {receiptData.receipt.paymentMethod}</p>
                        <p><strong>Your Total Savings:</strong> ₦{receiptData.receipt.discount?.toLocaleString()}</p>
                    </div>
                    <hr className="my-4"/>
                    <p className="text-center">Thanks for your Kind Patronage!</p>
                </div>

                <div className={`d-print-none d-flex justify-content-between ${styles.receiptButtons}`}>
                    <Button variant="danger" className=' px-4 py-2' onClick={onClose}>Close</Button>
                    <Button variant="primary" className="px-4 py-2" onClick={handlePrint}>Print</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ReceiptModal;