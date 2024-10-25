import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../shared/sidebar/sidebar";
import Header from "../../shared/header/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../showcase.module.scss';
import { Spinner, Alert, Button } from 'react-bootstrap'; // Import Spinner and Alert from Bootstrap
import { FaExclamationTriangle } from "react-icons/fa";
import Api from "../../shared/api/apiLink";

// Fish stage number boxes
const FishStageBox = ({quantity }) => {
  return (
    <div className={`${styles.stageBox} shadow py-3`}>
      <h6>Broken</h6>
      <p>{quantity}<span> Fishes</span></p>
      <div className="text-end"><Button className='btn btn-dark px-5 py-2'>Package</Button></div>
    </div>
  );
};

export default function ViewBorkenHistory() {
  const [fishStages, setFishStages] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadingStages, setLoadingStages] = useState(true); // Loading state for fish stages
  const [loadingTable, setLoadingTable] = useState(true); // Loading state for table data
  const [errorStages, setErrorStages] = useState(''); // Error state for fish stages
  const [errorTable, setErrorTable] = useState(''); // Error state for table data


  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await Api.get('/fish/broken'); // Replace with your API endpoint
        setTableData(response.data); // Assuming the response is an array of fish history data
      } catch (error) {
        setErrorTable("Error fetching add fish history data."); // Set error message
      } finally {
        setLoadingTable(false); // Stop loading indicator
      }
    };
    fetchTableData();
  }, []);

  return (
    <section className={`d-none d-lg-block ${styles.body}`}>
      <div className="sticky-top">
        <Header />
      </div>
      <div className="d-flex gap-2">
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <SideBar className={styles.sidebarItem} />
        </div>

        {/* Content */}
        <section className={`${styles.content}`}>
          <main className={styles.create_form}>
            <h4 className="mt-3 mb-5">View Add Fish History</h4>
            
            {/* Fish Stage Numbers */}
            <div className={`d-flex mb-5 ${fishStages ? 'justify-content-between' : 'justify-content-center'}`}>
              {loadingStages && (
                <div className="text-center w-100">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
              {errorStages && (
                 <div className=" w-100">
                    <Alert variant="danger" className="text-center py-5">
                      <FaExclamationTriangle size={40}/><span className="fw-semibold">{errorStages}</span>
                    </Alert>
                  </div>
              )}
              {!loadingStages && !errorStages && fishStages.map((stage, index) => (
                <FishStageBox
                  key={index}
                  stageName={stage.name}
                  quantity={stage.quantity}
                />
              ))}
            </div>

            {/* Table */}
            {loadingTable && (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {errorTable && (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className="text-center w-50 py-5">
                  <FaExclamationTriangle size={40}/><span className="fw-semibold">{errorTable}</span>
                </Alert>
              </div>              
            )}
            {!loadingTable && !errorTable && (
              <table className={styles.styled_table}>
                <thead className={`rounded-2 ${styles.theader}`}>
                  <tr>
                    <th>DATE CREATED</th>
                    <th>STAGE</th>
                    <th>QUANTITY ADDED</th>
                    <th>FISH NAME</th>
                    <th>SPECIE</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.dateCreated}</td>
                        <td>{data.stage}</td>
                        <td>{data.quantityAdded}</td>
                        <td>{data.fishName}</td>
                        <td>{data.specie}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </main>
        </section>
      </div>
    </section>
  );
}
