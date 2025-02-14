import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./DeploymentHeader";

const API_URL = "https://backendchanges.onrender.com/api/deployments"; 

const CreateDeploymentProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName || !projectCategory) {
      toast.error("Project Name and Category are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const newProject = { projectName, projectCategory, description };

      // API call to create deployment project
      await axios.post(API_URL, newProject);

      toast.success("Deployment project created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/Projects/page"), 3000);
    } catch (error) {
      console.error("Error creating deployment project:", error);
      toast.error("Failed to create the deployment project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">
      <ToastContainer />
      <Header />
      <main className="flex-grow flex justify-center items-center px-4 py-6">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6">Create Project</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Project name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Project category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectCategory"
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
                placeholder="Enter project category"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your deployment project..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
                onClick={() => navigate("/home")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateDeploymentProject;
