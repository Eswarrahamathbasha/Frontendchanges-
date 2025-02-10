import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Subscription_plans.css';
import { useServiceTracking } from "../../Hooks/UseServiceTracking";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

function SubscriptionPlans() {
  const navigate = useNavigate();
  const startTracking = useServiceTracking();
  const [hasActiveFreeTrial, setHasActiveFreeTrial] = useState(false);

  useEffect(() => {
    // Track when page loads
    startTracking('Subscriptions', 'Subscription');

    // Check free trial status
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      axios.get(`/api/subscription/free-trial-status/${userEmail}`)
        .then((response) => {
          setHasActiveFreeTrial(response.data.hasActiveFreeTrial);
        })
        .catch((error) => {
          console.error('Error checking free trial status:', error.message);
        });
    }
  }, []);

  // Handler for Free Trial button click
  const handleFreeTrial = () => {
    if (hasActiveFreeTrial) {
      alert('You already have an active free trial. No need to make another payment.');
    } else {
      navigate('/payment'); // Navigate to the payment page
    }
  };

  // Handler for Organization Plan button click
  const handleOrganizationPlan = async () => {
    // Retrieve the token from localStorage (ensure you've stored it after login)
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${apiUrl}/api/subscriptions/create`,
        { subscriptionType: 'Organization' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error sending organization request:', error);
      toast.error("Error sending organization request. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <Header />

      {/* Toast Container (Required for Toasts to Work) */}
      <ToastContainer />

      {/* Main layout */}
      <div className="subs-plans-container">
        {/* Content */}
        <div className="content">
          <h1 className="subs-plan-title">Subscriptions</h1>
          <h2 className="subtitle">Choose your plan</h2>

          {/* Subscription cards */}
          <div className="cards-container">
            {/* Free Trial Card */}
            <div className="card">
              <h3 className="card-title">Free Trial</h3>
              <div className="sub">
                <p className="price">₹5</p>
                <p className="payment-info">one-time payment</p>
              </div>
              <ul className="features" id="feat">
                <li>✔ 30 days full access</li>
                <li>✔ Basic feature access</li>
                <li>✔ 24/7 support</li>
                <li>✔ Pay with Credit/Debit Card</li>
              </ul>
              <button className="button btn-primary" onClick={handleFreeTrial}>
                Start Free Trial
              </button>
            </div>

            {/* Organization Plan Card */}
            <div className="card">
              <h3 className="card-title">Organization</h3>
              <div className="tabs">
                <button className="tab active">1 month</button>
                <button className="tab">3 months</button>
                <button className="tab">6 months</button>
                <button className="tab">1 Year</button>
              </div>
              <div className="info">
                <h5 className="billing-info">Usage-Based Billing</h5>
                <p className="description">
                  Pay only for what you use at the end of your billing period.
                </p>
              </div>
              <ul className="feature">
                <li>✔ Unlimited access</li>
                <li>✔ Advanced features</li>
                <li>✔ Priority support</li>
                <li>✔ Usage-based billing</li>
              </ul>
              <p className="note">
                Billing occurs at the end of your selected period based on actual usage.
              </p>
              <button className="button1 btn-secondary" onClick={handleOrganizationPlan}>
                Choose Organization Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlans;
