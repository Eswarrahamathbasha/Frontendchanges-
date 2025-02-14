import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./Datacloudcreation.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const apiUrl = process.env.REACT_APP_API_URL;

const Datacloudcreation = () => {
    const [activeTab, setActiveTab] = useState("Details");
    const [name, setName] = useState("");
    const [subscriptionType, setSubscriptionType] = useState("");
    const [projectName, setProjectName] = useState("");
    const [titleName, setTitleName] = useState("");
    const [titleDetails, setTitleDetails] = useState("");
    const [status, setStatus] = useState("Running");
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (Array.isArray(projects)) {
            const filtered = projects.filter((project) =>
                project.projectName.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [search, projects]);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/proj/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setProjects(Array.isArray(data) ? data : data.data || []);
            setFilteredProjects(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Error fetching projects:", error.message);
            setProjects([]);
        }
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleNextClick = () => {
        if (activeTab === "Details") {
            setActiveTab("Title");
        } else if (activeTab === "Title") {
            setActiveTab("Preview");
        }
    };

    const handleBackClick = () => {
        if (activeTab === "Preview") {
            setActiveTab("Title");
        } else if (activeTab === "Title") {
            setActiveTab("Details");
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = {
            serviceName: name,
            subscriptionType,
            projectName,
            status,
            titleName,
            titleDetails,
        };

        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/api/datastore`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Show success message
            toast.success("Data Cloud created successfully!", { position: "top-right", autoClose: 2000 });

            // Wait for the toast message before navigating
            setTimeout(() => {
                navigate("/Datastorageservice");
            }, 2500);
        } catch (error) {
            console.error("Error creating Data Cloud:", error);
            toast.error("Failed to create Data Cloud", { position: "top-right" });
        }
    };

    return (
        <div className="Data-cloud-create-hub-container">
            <Header />
            <Sidebar />
            <h1>Create a Data Cloud Storage</h1>

            {/* Tab Navigation */}
            <div className="Data-cloud-tab-navigation">
                <button className={`Data-cloud-title-tab ${activeTab === "Details" ? "active" : ""}`} onClick={() => handleTabClick("Details")}>Details</button>
                <button className={`Data-cloud-title-tab ${activeTab === "Title" ? "active" : ""}`} onClick={() => handleTabClick("Title")}>Title</button>
                <button className={`Data-cloud-title-tab ${activeTab === "Preview" ? "active" : ""}`} onClick={() => handleTabClick("Preview")}>Preview</button>
            </div>

            {/* Details Tab */}
            {activeTab === "Details" && (
                <form className="Data-cloud-hub-form-container" onSubmit={handleFormSubmit}>
                    <div className="data-form-group">
                        <label htmlFor="serviceName">Data Storage Name *</label>
                        <input type="text" id="serviceName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type" className="data-form-group-option" required />
                    </div>
                    <div className="data-form-group">
                        <label htmlFor="subscriptionName">Subscription Name *</label>
                        <select id="subscriptionName" value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value)} className="data-form-group-option" required>
                            <option value="">Select</option>
                            <option value="Free Trial">Free Trial</option>
                            <option value="Organization">Organization</option>
                        </select>
                    </div>
                    <div className="data-form-group">
                        <label htmlFor="projectName">Project Name</label>
                        <select id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="data-form-group-option" required>
                            <option value="">Select</option>
                            {filteredProjects.map((project) => (
                                <option key={project._id} value={project.projectName}>{project.projectName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="button-group">
                        <button type="button" className="btn back" onClick={() => navigate(-1)}>Back</button>
                        <button type="button" className="btn next" onClick={handleNextClick}>Next</button>
                    </div>
                </form>
            )}

            {/* Title Tab */}
            {activeTab === "Title" && (
                <div className="hub-form-container">
                    <div className="title-form-group">
                        <div className="titlename-form-group">
                            <label htmlFor="titleName">Title Name</label>
                            <input type="text" id="titleName" value={titleName} onChange={(e) => setTitleName(e.target.value)} placeholder="Type" required />
                        </div>
                        <div className="titlename-form-group">
                            <label htmlFor="titleDetails">Title Details</label>
                            <input type="text" id="titleDetails" value={titleDetails} onChange={(e) => setTitleDetails(e.target.value)} placeholder="Type" required />
                        </div>
                    </div>
                    <button className="Data-cloud-add-button">+ Add</button>
                    <div className="button-group">
                        <button type="button" className="btn back" onClick={handleBackClick}>Back</button>
                        <button type="button" className="btn next" onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            )}

            {/* Preview Tab */}
            {activeTab === "Preview" && (
                <div className="hub-form-container">
                    <div className="preview-details">
                        <div className="section">
                            <h3>Details</h3>
                            <p>Data Storage Name: {name}</p>
                            <p>Subscription: {subscriptionType}</p>
                            <p>Project: {projectName}</p>
                        </div>
                        <div className="section">
                            <h3>Titles</h3>
                            <p>Title Name: {titleName}</p>
                            <p>Title Details: {titleDetails}</p>
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="button" className="btn back" onClick={handleBackClick}>Back</button>
                        <button type="button" className="btn create" onClick={handleFormSubmit}>Create</button>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <ToastContainer />
        </div>
    );
};

export default Datacloudcreation;
