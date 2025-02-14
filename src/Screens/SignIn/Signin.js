import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Key } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Signin.module.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Full response from backend:', data);

      if (!response.ok) {
        if (data.message === 'Invalid password') {
          toast.error('Password is invalid');
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error('Signin failed. Please try again.');
        }
        return;
      }

      if (data && data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem(
          'userData',
          JSON.stringify({
            email: formData.email,
            fullName: data.data.user.fullName,
          })
        );

        toast.success('Successfully signed in!');

        setTimeout(() => {
          navigate('/verify-identity', { state: { email: formData.email } });
        }, 1500);
      } else {
        toast.error('Token missing in response');
      }
    } catch (error) {
      console.error('Signin Error:', error);
      toast.error('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setForgotMessage("Enter a valid email address");
      toast.error("Enter a valid email address");  // Toaster message for invalid email
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      const response = await fetch(`https://backendchanges.onrender.com/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOtpSent(true);
      setForgotMessage("OTP sent to your email.");
      toast.success("OTP sent to your email.");  // Success toaster message
    } catch (error) {
      setForgotMessage("Error sending OTP. Try again.");
      toast.error("Error sending OTP. Try again.");  // Error toaster message
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      setForgotMessage("Please enter OTP and a new password.");
      toast.error("Please enter OTP and a new password.");  // Toaster message for missing OTP or password
      return;
    }

    if (newPassword.length < 8) {
      setForgotMessage("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters.");  // Toaster message for password length validation
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      const response = await fetch(`https://backendchanges.onrender.com/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setForgotMessage("Password reset successfully. You can now sign in.");
      toast.success("Password reset successfully. You can now sign in.");  // Success toaster message

      setForgotPasswordMode(false);
      setOtpSent(false);
    } catch (error) {
      setForgotMessage("Invalid OTP or expired. Try again.");
      toast.error("Invalid OTP or expired. Try again.");  // Error toaster message for invalid OTP
    } finally {
      setForgotLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>{forgotPasswordMode ? "Reset Your Password" : "Please sign in to continue"}</p>
        </div>
        <div className={styles.formContent}>
          {forgotPasswordMode ? (
            <form onSubmit={otpSent ? handleResetPassword : handleSendOTP} className={styles.form}>
              <div className={styles.inputGroup}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={styles.input}
                  required
                  disabled={otpSent}
                />
              </div>
              {otpSent && (
                <>
                  <div className={styles.inputGroup}>
                    <Key className={styles.inputIcon} size={20} />
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit" className={styles.submitButton} disabled={forgotLoading}>
                {forgotLoading ? "Processing..." : otpSent ? "Reset Password" : "Send OTP"}
              </button>

              <p className={styles.signupText}>
                Remembered your password?{" "}
                <button
                  type="button"
                  className={styles.signupLink}
                  onClick={() => {
                    setForgotPasswordMode(false)
                    setOtpSent(false)
                  }}
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : (<form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className={styles.forgotPassword}>
              <button type="button" className={styles.forgotPasswordLink} onClick={() => setForgotPasswordMode(true)}>
                Forgot Password
              </button>
            </p>

            <p className={styles.signupText}>
              Don't have an account?{" "}
              <a href="/" className={styles.signupLink}>
                Sign up
              </a>
            </p>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
