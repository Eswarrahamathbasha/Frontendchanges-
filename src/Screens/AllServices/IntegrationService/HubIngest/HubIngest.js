import React, { useEffect, useState } from 'react';
import './HubIngest.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../Components/Header/Header';
import axios from 'axios';

// Ensure you have Font Awesome imported
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faFolderOpen, faInfoCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import React Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

library.add(faPlus, faFolderOpen, faInfoCircle, faEdit, faTrashAlt);
const apiUrl = process.env.REACT_APP_API_URL;

const Hubingest = () => {
    const navigate = useNavigate();
    const [hubIngests, setHubIngests] = useState([]);
    const [selectedHubIngests, setSelectedHubIngests] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchHubIngests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No authentication token found. Please log in.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/hubingest`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHubIngests(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Unauthorized access. Please log in again.');
                    navigate('/login');
                } else {
                    toast.error('Failed to fetch data. Please try again later.');
                }
            }
        };

        fetchHubIngests();
    }, [navigate]);

    const handleCreateClick = () => {
        navigate('/create-hub-ingest');
    };

    const handleAccess = () => {
        if (selectedHubIngests.length === 0) {
            toast.warning('Please select a Hub Ingest first.');
            return;
        }
        navigate('/access-hub-ingest', { state: { hubIngests: selectedHubIngests } });
        toast.success('Accessing selected Hub Ingest.');
    };

    const handleDetails = () => {
        if (selectedHubIngests.length === 0) {
            toast.warning('Please select a Hub Ingest first.');
            return;
        }
        navigate('/details-hub-ingest', { state: { hubIngests: selectedHubIngests } });
        toast.success('Viewing details of selected Hub Ingest.');
    };

    const handleEdit = () => {
        if (selectedHubIngests.length === 0) {
            toast.warning('Please select a Hub Ingest first.');
            return;
        }
        navigate('/edit-hub-ingest', { state: { hubIngests: selectedHubIngests } });
        toast.success('Editing selected Hub Ingest.');
    };

    const handleDelete = async () => {
        if (selectedHubIngests.length === 0) {
            toast.warning('Please select a Hub Ingest first.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await Promise.all(
                selectedHubIngests.map(async (hubIngest) => {
                    await axios.delete(`http://localhost:3000/api/hubingest/${hubIngest._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
            );
            toast.success('Hub Ingests deleted successfully!');
            setHubIngests(hubIngests.filter((hubIngest) => !selectedHubIngests.some(selected => selected._id === hubIngest._id)));
            setSelectedHubIngests([]);
        } catch (error) {
            console.error('Error deleting Hub Ingests:', error);
            toast.error('Failed to delete Hub Ingests.');
        }
    };

    const handleCheckboxChange = (hubIngest) => {
        if (selectedHubIngests.some((selected) => selected._id === hubIngest._id)) {
            setSelectedHubIngests(selectedHubIngests.filter((selected) => selected._id !== hubIngest._id));
        } else {
            setSelectedHubIngests([...selectedHubIngests, hubIngest]);
        }
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedHubIngests([]);
        } else {
            setSelectedHubIngests(hubIngests);
        }
        setSelectAll(!selectAll);
    };

    const handleNameClick = (hubIngest) => {
        navigate('/overview', { state: hubIngest });
    };

    return (
        <div className="hub-ingest_main-content">
            <Header />
            <h1 className="page-title">Hub Ingest</h1>
            <input type="text" placeholder="Search" className="search-bar" />
            <div className="toolbar">
                <button onClick={handleCreateClick}>
                    <FontAwesomeIcon icon="plus" /> Create
                </button>
                <button onClick={handleAccess}>
                    <FontAwesomeIcon icon="folder-open" /> Access
                </button>
                <button onClick={handleDetails}>
                    <FontAwesomeIcon icon="info-circle" /> Details
                </button>
                <button onClick={handleEdit}>
                    <FontAwesomeIcon icon="edit" /> Edit
                </button>
                <button onClick={handleDelete}>
                    <FontAwesomeIcon icon="trash-alt" /> Delete
                </button>
            </div>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </th>
                        <th>Hub Ingest Name</th>
                        <th>Project Name</th>
                        <th>Subscription Name</th>
                    </tr>
                </thead>
                <tbody>
                    {hubIngests.map((hubIngest, index) => (
                        <tr
                            key={index}
                            onClick={() => setSelectedHubIngests([hubIngest])}
                            className={selectedHubIngests.some((selected) => selected._id === hubIngest._id) ? 'selected-row' : ''}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedHubIngests.some((selected) => selected._id === hubIngest._id)}
                                    onChange={() => handleCheckboxChange(hubIngest)}
                                />
                            </td>
                            <td
                                className="clickable-name"
                                onClick={() => handleNameClick(hubIngest)}
                            >
                                {hubIngest.name || 'N/A'}
                            </td>
                            <td>{hubIngest.projectName?.projectName || hubIngest.projectName || 'N/A'}</td>
                            <td>{hubIngest.subscriptionType?.type || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Hubingest;