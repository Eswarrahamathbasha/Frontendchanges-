import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import "./Organization.css";
import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
const apiUrl = process.env.REACT_APP_API_URL;
 
const OrganizationPage = () => {
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
 
  // Fetch organization data from the backend
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/org/organizations`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrganizationData(data);
        setFilteredData(data); // Initialize filtered data with fetched data
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
 
    fetchOrganizations();
  }, []);
 
  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = organizationData.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.details.toLowerCase().includes(query) ||
        org.contact.toLowerCase().includes(query) ||
        org.email.toLowerCase().includes(query) ||
        org.paymentMethod.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };
 
  return (
    <div className="App">
      <Header />
      <div className="main-container">
        {/* <Sidebar /> */}
 
      <div>
        <h2>Organization</h2>
 
        <input
          type="text"
          placeholder="Search Services"
          className="search-bar services"
          value={search}
          onChange={handleSearch}
        />
 
        <div className="organization-controls">
          <button onClick={() => navigate("/create-organization")}>
            <FaPlus /> Create
          </button>
          <button>
            <FaEdit /> Rename
          </button>
          <button>
            <FaTrash /> Delete
          </button>
          <button>
            <FaInfoCircle /> Details
          </button>
        </div>
 
        {/* Table Format */}
        <table className="organization-table">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Details</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((org, index) => (
                <tr key={index}>
                  <td>{org.organizationName}</td>
                  <td>{org.organizationDetails}</td>
                  <td>{org.contactNo}</td>
                  <td>{org.organizationEmail}</td>
                  <td>{org.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};
 
export default OrganizationPage;