import React from "react";
import styles from "../finance.module.scss"; // Import SCSS module

const ReceiptModal = ({ receiptData, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className={styles.receiptModal}>
            <div className={styles.receiptContent}>
                <h2>FENDOL LIMITED</h2>
                <p><strong>Customer Name:</strong> {receiptData.fullName}</p>
                <p><strong>Address:</strong> {receiptData.address || "N/A"}</p>
                <p><strong>Served by:</strong> {receiptData.servedBy || "N/A"}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>

                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total (₦)</th>
                            <th>Price (₦)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receiptData.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td>{item.quantity} Pck</td>
                                <td>{item.totalPrice}</td>
                                <td>{item.pricePerUnit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p><strong>Grand Total:</strong> ₦{receiptData.grandTotal}</p>
                <p><strong>Paid with:</strong> {receiptData.paymentMethod}</p>

                <div className={styles.receiptButtons}>
                    <button onClick={handlePrint}>Print</button>
                    <button onClick={onClose} className={styles.closeButton}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
