import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify
import styles from './Signup.module.css';

// Backend API URL
const apiUrl = process.env.REACT_APP_API_URL;

// Designation Options
const DESIGNATIONS = [
  'Software Developer',
  'Data Analyst',
  'Product Manager',
  'UI/UX Designer',
  'System Analyst',
  'Project Manager',
  'Business Analyst',
  'Others',
];

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    country: '',
    state: '',
    companyName: '',
    designation: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.designation) newErrors.designation = 'Please select a designation';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success toast
        toast.success('Account created successfully!');

        setTimeout(() => {
          navigate('/signin'); // Redirect to sign-in page
        }, 2000);

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobile: '',
          country: '',
          state: '',
          companyName: '',
          designation: '',
        });
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Signup failed' });

        // Show error toast
        toast.error(data.message || 'Signup failed', {
        });
      }
    } catch (error) {
      setErrors({ submit: 'Network error occurred' });

      // Show error toast for network error
      toast.error('Network error occurred', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors for the current field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create Account</h2>

        {[ // Reusable input fields
          { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Full Name' },
          { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Email Address' },
          { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
          { label: 'Mobile Number', name: 'mobile', type: 'tel', placeholder: 'Mobile Number' },
          { label: 'Country', name: 'country', type: 'text', placeholder: 'Country' },
          { label: 'State', name: 'state', type: 'text', placeholder: 'State' },
          { label: 'Company Name', name: 'companyName', type: 'text', placeholder: 'Company Name' },
        ].map(({ label, name, type, placeholder }) => (
          <div className={styles.inputGroup} key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              name={name}
              id={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={errors[name] ? styles.error : ''}
            />
            {errors[name] && <span className={styles.errorText}>{errors[name]}</span>}
          </div>
        ))}

        {/* Designation Dropdown */}
        <div className={styles.inputGroup}>
          <label htmlFor="designation">Designation</label>
          <select
            name="designation"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            className={errors.designation ? styles.error : ''}
          >
            <option value="">Select Designation</option>
            {DESIGNATIONS.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
          {errors.designation && <span className={styles.errorText}>{errors.designation}</span>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {errors.submit && (
          <div className={styles.submitError}>
            <AlertCircle size={16} />
            {errors.submit}
          </div>
        )}

        <p className={styles.signupText}>
          Already have an account?{' '}
          <a href="/signin" className={styles.signupLink}>
            Sign In
          </a>
        </p>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
