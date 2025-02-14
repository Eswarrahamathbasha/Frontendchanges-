import React, { useState, useEffect } from 'react';
import './CreateProject.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../../Components/Header/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const apiUrl = process.env.REACT_APP_API_URL;
 
function CreateProjectForm() {
    const navigate = useNavigate();
 
    const [projectName, setProjectName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [subscriptionName, setSubscriptionName] = useState('');
    const [organizations, setOrganizations] = useState([]);
 
    // Fetch organizations on component mount
    useEffect(() => {
        const fetchOrganizations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You need to log in first!");
                return;
            }
 
            try {
                const response = await fetch(`http://localhost:3000/api/org/organizations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
 
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch organizations');
                }
 
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrganizations(data);
                } else if (data && Array.isArray(data.data)) {
                    setOrganizations(data.data);
                } else {
                    console.error("Unexpected response format:", data);
                    setOrganizations([]);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
                toast.error('Failed to load organizations. Please try again.');
            }
        };
 
        fetchOrganizations();
    }, []);
 
    // Automatically set organization name for FreeTrial subscription
    useEffect(() => {
        if (subscriptionName === 'FreeTrial') {
            setOrganizationName('Free Trial Organization');
        } else if (subscriptionName === 'Organization') {
            setOrganizationName('');
        }
    }, [subscriptionName]);
 
    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        // Validate organization name based on subscription type
        if (subscriptionName === 'FreeTrial' && organizationName !== 'Free Trial Organization') {
            alert("You must select 'Free Trial Organization' for FreeTrial subscription.");
            return;
        }
 
        if (subscriptionName === 'Organization' && !organizationName) {
            alert("Please select an organization.");
            return;
        }
 
        const newProject = {
            projectName,
            organizationName,
            subscriptionName,
        };
 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authorization token is missing.");
            }
 
            const response = await fetch(`http://localhost:3000/api/proj/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newProject),
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error response:', errorData);
                throw new Error(errorData.message || 'Failed to create project');
            }
 
            const createdProject = await response.json();
            console.log('Project created successfully:', createdProject);
 
            // Show success toast message
            toast.success('Project created successfully!');
 
            // Clear form fields
            setProjectName('');
            setOrganizationName('');
            setSubscriptionName('');
 
            // Navigate to the projects page after a delay
            setTimeout(() => navigate('/projects', { state: { project: createdProject } }), 3000);
        } catch (error) {
            console.error('Error creating project:', error.message);
            toast.error(`Failed to create the project: ${error.message}`);
        }
    };
 
    return (
        <div className="projects-page">
            <Header />
 
            <div className="create-project-container">
                <h2>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="projectName">Project Name *</label>
                        <input
                            type="text"
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </div>
 
                    {subscriptionName === 'Organization' ? (
                        <div className="input-group">
                            <label htmlFor="organizationName">Organization Name *</label>
                            <select
                                id="organizationName"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                required
                            >
                                <option value="">Select an Organization</option>
                                {organizations.map((org) => (
                                    <option key={org._id} value={org.organizationName}>
                                        {org.organizationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : subscriptionName === 'FreeTrail' && (
                        <div className="input-group">
                            <label htmlFor="organizationName">Organization Name *</label>
                            <input
                                type="text"
                                id="organizationName"
                                value="Free Trial Organization"
                                readOnly
                            />
                        </div>
                    )}
 
                    <div className="input-group">
                        <label htmlFor="subscriptionName">Subscription Type *</label>
                        <select
                            id="subscriptionName"
                            value={subscriptionName}
                            onChange={(e) => setSubscriptionName(e.target.value)}
                            required
                        >
                            <option value="">Select a Subscription</option>
                            <option value="FreeTrail">FreeTrial</option>
                            <option value="Organization">Organization</option>
                        </select>
                    </div>
 
                    <div className="button-group1">
                        <button type="button" className="cancel-button" onClick={() => navigate('/projects')}>
                            Cancel
                        </button>
                        <button type="submit" className="create-button">
                            Create
                        </button>
                    </div>
                </form>
            </div>
 
            {/* Toast container for displaying messages */}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}
 
export default CreateProjectForm;