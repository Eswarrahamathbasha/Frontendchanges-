import React, { useEffect, useState } from 'react';
import { useServiceTracking } from '../../../../../Hooks/UseServiceTracking';
import './CreateHubIngest.css';
import Header from '../../../../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const apiUrl = process.env.REACT_APP_API_URL;

const CreateHubIngest = () => {
    const [name, setName] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('');
    const [projectName, setProjectName] = useState('');
    const [status, setStatus] = useState('Running');
    const [activeTab, setActiveTab] = useState('Details');
    const [titleName, setTitleName] = useState('');
    const [titleDetails, setTitleDetails] = useState('');
    const navigate = useNavigate();
    const startTracking = useServiceTracking();
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        startTracking('All Projects', 'Project');
        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter((project) =>
            project.projectName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [search, projects]);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/proj/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorText}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setProjects(data);
                setFilteredProjects(data);
            } else if (data && Array.isArray(data.data)) {
                setProjects(data.data);
                setFilteredProjects(data.data);
            } else {
                throw new Error('API response is not an array or does not contain "data" as an array.');
            }
        } catch (error) {
            console.error('Error fetching projects:', error.message);
        }
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {
                name,
                subscriptionType,
                projectName,
                status,
                titleName,
                titleDetails
            };

            const token = localStorage.getItem('token');
            const response = await axios.post(`${apiUrl}/api/hubingest`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Replace alert with toast
            toast.success('Hub Ingest created successfully!');
            setTimeout(() => navigate(-1), 3000); // Redirect after 3 seconds
        } catch (error) {
            console.error('Error creating Hub Ingest:', error);
            // Replace alert with toast
            toast.error('Failed to create Hub Ingest. Please try again.');
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="create-hub-container">
            <Header />
            <h1 className="create-hub-container-heading">Create Hub Ingest</h1>
            <hr />
            <div className="tab-navigation1">
                <button className={`tabs ${activeTab === 'Details' ? 'active' : ''}`} onClick={() => handleTabClick('Details')}>
                    Details
                </button>
                <button className={`tabs ${activeTab === 'Title' ? 'active' : ''}`} onClick={() => handleTabClick('Title')}>
                    Title
                </button>
                <button className={`tabs ${activeTab === 'Preview' ? 'active' : ''}`} onClick={() => handleTabClick('Preview')}>
                    Preview
                </button>
            </div>

            {activeTab === 'Details' && (
                <form className="form-container">
                    <div className="form-group">
                        <label htmlFor="hubIngestName">Hub Ingest Name</label>
                        <input
                            type="text"
                            id="hubIngestName"
                            placeholder="Type"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subscriptionName">Subscription Name</label>
                        <select
                            id="subscriptionName"
                            value={subscriptionType}
                            onChange={(e) => setSubscriptionType(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="FreeTrial">Free Trial</option>
                            <option value="Organization">Organization</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="projectName">Project Name</label>
                        <select
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {filteredProjects.map((project) => (
                                <option key={project._id} value={project.projectName}>
                                    {project.projectName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="button" className="btn back" onClick={handleBackClick}>
                            Back
                        </button>
                        <button type="button" className="btn next" onClick={() => handleTabClick('Title')}>
                            Next
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'Title' && (
                <form className="form-container">
                    <div className="form-group">
                        <label htmlFor="titleName">Title Name</label>
                        <input
                            type="text"
                            id="titleName"
                            placeholder="Type"
                            value={titleName}
                            onChange={(e) => setTitleName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="titleDetails">Title Details</label>
                        <input
                            type="text"
                            id="titleDetails"
                            placeholder="Type"
                            value={titleDetails}
                            onChange={(e) => setTitleDetails(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" className="btn back" onClick={() => handleTabClick('Details')}>
                            Back
                        </button>
                        <button type="button" className="btn next" onClick={() => handleTabClick('Preview')}>
                            Next
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'Preview' && (
                <div className="preview-container">
                    <div className="preview-details">
                        <div className="preview-section">
                            <h3>Details</h3>
                            <p>Hub Ingest Name: {name}</p>
                            <p>Subscription Type: {subscriptionType}</p>
                            <p>Project Name: {projectName}</p>
                            <p>Status: {status}</p>
                        </div>
                        <div className="preview-section">
                            <h3>Title</h3>
                            <p>Title Name: {titleName}</p>
                            <p>Title Details: {titleDetails}</p>
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="button" className="btn back" onClick={() => handleTabClick('Title')}>
                            Back
                        </button>
                        <button type="submit" className="btn create" onClick={handleFormSubmit}>
                            Create
                        </button>
                    </div>
                </div>
            )}

            {/* Toast container for displaying messages */}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default CreateHubIngest;
