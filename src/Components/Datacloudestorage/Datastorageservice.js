import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Datastorageservice.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Add this line

const apiUrl = process.env.REACT_APP_API_URL;

const Datastoreservice = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  const [renameServiceName, setRenameServiceName] = useState("");
  const [renameServiceId, setRenameServiceId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
          item.organizationName.toLowerCase().includes(search.toLowerCase()) ||
          item.serviceType.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/datastore`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleCreate = () => navigate("/Datacloudcreation");

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      const selectedData = data[selectedRows[0]];
      setRenameServiceName(selectedData.serviceName);
      setRenameServiceId(selectedData._id);
    } else {
      toast.warning("Please select exactly one service to rename");
    }
  };

  const handleRenameSave = async () => {
    if (renameServiceName.trim() === "") {
      toast.warning("Please enter a valid name.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/datastore/${renameServiceId}`,
        { serviceName: renameServiceName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Service renamed successfully!");
      setRenameServiceName("");
      setRenameServiceId(null);
      fetchData();
    } catch (error) {
      console.error("Error renaming service:", error);
      toast.error("Failed to rename the service");
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Select at least one service to delete");
      return;
    }

    try {
      for (let index of selectedRows) {
        await axios.delete(`${apiUrl}/api/datastore/${data[index]._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      setData(data.filter((_, i) => !selectedRows.includes(i)));
      setSelectedRows([]);
      toast.success("Selected services deleted successfully");
    } catch (error) {
      toast.error("Failed to delete services");
    }
  };

  const handleAccess = () => toast.info("Accessing selected service...");
  const handleDownload = () => toast.info("Downloading selected service...");
  const handleDetails = () => toast.info("Showing details...");

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredData.length ? [] : filteredData.map((_, index) => index)
    );
  };

  const handleServiceNameClick = (serviceName) => {
    navigate(`/Datacloudoverview`);
  };

  return (
    <div className="cloud-data-store-container">
      <Header />
      <Sidebar />
      <header className="cloud-header">
        <h1>Data Store</h1>
        <input
          type="text"
          className="Data-overview11"
          placeholder="Search Services"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      <div className="cloud-actions">
        <button className="cloud-action-button" onClick={handleCreate}>
          <i className="fa fa-plus" /> Create
        </button>
        <button className="cloud-action-button" onClick={handleEdit} disabled={selectedRows.length !== 1}>
          <i className="fa fa-pencil" /> Edit
        </button>
        <button className="cloud-action-button" onClick={handleDelete} disabled={selectedRows.length === 0}>
          <i className="fa fa-trash" /> Delete
        </button>
        <button className="cloud-action-button" onClick={handleAccess} disabled={selectedRows.length === 0}>
          <i className="fa fa-unlock" /> Access
        </button>
        <button className="cloud-action-button" onClick={handleDownload} disabled={selectedRows.length === 0}>
          <i className="fa fa-download" /> Download
        </button>
        <button className="cloud-action-button" onClick={handleDetails} disabled={selectedRows.length === 0}>
          <i className="fa fa-info-circle" /> Details
        </button>
      </div>
      <p className="cloud-services-info1">Available {filteredData.length} services</p>
      <table className="cloud-data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectedRows.length === filteredData.length && filteredData.length > 0} onChange={handleSelectAll} />
            </th>
            <th>Service Name</th>
            <th>Service Type</th>
            <th>Project Name</th>
            <th>Project ID</th>
            <th>Subscription</th>
            <th>Organization Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" checked={selectedRows.includes(index)} onChange={() => handleSelectRow(index)} />
                </td>
                <td>
                  <button onClick={() => handleServiceNameClick(item.serviceName)}>{item.serviceName}</button>
                </td>
                <td>{item.serviceType}</td>
                <td>{item.projectName}</td>
                <td>{item.projectId}</td>
                <td>{item.subscription}</td>
                <td>{item.organizationName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">No matching results found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {renameServiceId && (
        <div className="rename-modal">
          <div className="rename-modal-content">
            <i 
              className="fa fa-times close-icon"
              onClick={() => {
                setRenameServiceName("");
                setRenameServiceId(null);
              }}
            />
            <h3>Rename a Service</h3>
            <input
              type="text"
              value={renameServiceName}
              onChange={(e) => setRenameServiceName(e.target.value)}
              placeholder="Enter new service name"
            />
            <div className="rename-actions">
              <button onClick={handleRenameSave} className="button save">
                Save
              </button>
              <button
                onClick={() => {
                  setRenameServiceName("");
                  setRenameServiceId(null);
                }}
                className="button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const DemoStoragePage = () => {
  return (
    <div>
      <h2>Welcome to Demo Storage Page</h2>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Datastoreservice />} />
        <Route path="/DemoStoragePage" element={<DemoStoragePage />} />
        <Route path="/Datacloudcreation" element={<div>Create Data Cloud Page</div>} />
      </Routes>
    </Router>
  );
};

export default Datastoreservice;
