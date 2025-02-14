import React, { useState } from "react";
import "./CreateOrganization.css";
import Header from "../../Components/Header/Header";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const CreateOrganization = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        details: "",
        contact: "",
        email: "",
        paymentMethod: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
    const [serverError, setServerError] = useState(""); // Server error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear field-specific error when user types
        setErrors({
            ...errors,
            [name]: "",
        });
        setServerError(""); // Clear server error
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Organization name is required.";
        if (!formData.details) newErrors.details = "Organization details are required.";
        if (!formData.contact || !/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = "Valid contact number is required (10 digits).";
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Valid email address is required.";
        }
        if (!formData.paymentMethod) {
            newErrors.paymentMethod = "Payment method is required.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(""); // Clear server error before submission

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true); // Disable form submission during API call
        try {
            const response = await fetch(`http://localhost:3000/api/org/organizations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationName: formData.name,
                    organizationDetails: formData.details,
                    contactNo: formData.contact,
                    organizationEmail: formData.email,
                    paymentMethod: formData.paymentMethod,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error creating organization.");
            }

            const data = await response.json();
            console.log("Organization created:", data);

            // Navigate to OrganizationPage and pass the created organization data
            navigate("/organizations", { state: { organization: data } });
        } catch (error) {
            console.error("Error creating organization:", error);
            setServerError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/organizations"); // Navigate back to organization list
    };

    return (
        <div className="App">
            <Header />
            <div className="create-organization-container">
                <h2 className="org">Create Organization</h2>
                <form onSubmit={handleSubmit} className="organization-form">
                    <div className="form-group1">
                        <label htmlFor="name">Organization Name *</label>
                        <input
                            type="text"
                            className="search-bar"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group1">
                        <label htmlFor="details">Organization Details *</label>
                        <input
                            type="text"
                            className="search-bar"
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                        />
                        {errors.details && <p className="error-message">{errors.details}</p>}
                    </div>
                    <div className="form-group1">
                        <label htmlFor="contact">Organization Contact Number *</label>
                        <input
                            type="text"
                            className="search-bar"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />
                        {errors.contact && <p className="error-message">{errors.contact}</p>}
                    </div>
                    <div className="form-group1">
                        <label htmlFor="email">Organization mail Id *</label>
                        <input
                            type="email"
                            className="search-bar"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="form-group1">
                        <label htmlFor="paymentMethod">Organization Payment Method *</label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Online">Online</option>
                            <option value="Card">Card</option>
                        </select>
                        {errors.paymentMethod && <p className="error-message">{errors.paymentMethod}</p>}
                    </div>
                    {serverError && <p className="error-message server-error">{serverError}</p>}
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="create-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrganization;