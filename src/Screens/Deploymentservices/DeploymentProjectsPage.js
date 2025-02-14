import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaCog, FaUserCircle } from "react-icons/fa";
import ProjectCard from "./DeploymentProjectCard";
 
// Function to map the first letter to a color
const getColorForFirstLetter = (letter) => {
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
    "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
    "bg-teal-500", "bg-cyan-500", "bg-gray-500", "bg-emerald-500",
    "bg-lime-500", "bg-fuchsia-500", "bg-violet-500", "bg-rose-500"
  ];
 
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const index = alphabet.indexOf(letter.toUpperCase());
 
  return index !== -1 ? colors[index % colors.length] : "bg-gray-500"; // Default to gray if letter not found
};
 
const DeploymentProjectsPage = () => {
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const projectsPerPage = 6; // Number of projects per page
  const navigate = useNavigate();
 
  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://backendchanges.onrender.com/api/deployments");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data); // Assuming API returns an array of projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchProjects();
  }, []);
 
  // Filter projects based on search text
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName &&
      project.projectName.toLowerCase().includes(filterText.toLowerCase())
  );
 
  // Paginate the filtered projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
 
  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-600">Loading projects...</p>;
    }
 
    switch (activeTab) {
      case "Projects":
        return currentProjects.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {currentProjects.map((project, index) => (
              <ProjectCard
                key={index}
                projectName={project.projectName}
                projectCategory={project.projectCategory}
                description={project.description}
                color={getColorForFirstLetter(project.projectName.charAt(0))}
                onClick={() => navigate(`/projects/${project.projectName}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No projects found.</p>
        );
      case "My work":
        return <p className="text-gray-600">No work assigned yet.</p>;
      case "Pull requests":
        return <p className="text-gray-600">No pull requests available.</p>;
      default:
        return null;
    }
  };
 
  // Handle next and previous page buttons
  const nextPage = () => {
    if (currentPage * projectsPerPage < filteredProjects.length) {
      setCurrentPage(currentPage + 1);
    }
  };
 
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  return (
    <div className="min-h-screen bg-white-100 flex flex-col items-center py-2">
      <header className="w-full max-w-9xl px-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-xl font-light">StatusTracker</h1>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg mr-80 pl-4 py-2 text-sm w-64"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-20">
            <span
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/work")}
            >
              <FaBriefcase className="text-gray-500 text-xl" />
            </span>
            <span
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <FaCog className="text-gray-500 text-xl" />
            </span>
            <span className="flex items-center space-x-2">
              <FaUserCircle className="text-gray-500 text-2xl" />
            </span>
          </div>
        </div>
      </header>
 
      <main className="w-full max-w-8xl px-6 mt-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="flex flex-col space-y-2 items-end">
            <button
              className="bg-blue-600 text-white px-7 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => navigate("/projects/new")}
            >
              + New Project
            </button>
            <div>
              <input
                type="text"
                placeholder="Filter Projects"
                className="border border-gray-300 rounded-lg px-10 ml-16 py-2 text-sm"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-10 border-b">
          <button
            className={`pb-1 ${activeTab === "Projects"
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-black-600"
              }`}
            onClick={() => setActiveTab("Projects")}
          >
            Projects
          </button>
          <button
            className={`pb-1 ${activeTab === "My work"
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-black-600"
              }`}
            onClick={() => setActiveTab("My work")}
          >
            My work
          </button>
          <button
            className={`pb-1 ${activeTab === "Pull requests"
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-black-600"
              }`}
            onClick={() => setActiveTab("Pull requests")}
          >
            Pull requests
          </button>
        </div>
 
        <div className="mt-6">{renderContent()}</div>
 
        <div className="flex justify-between items-center mt-6 w-full">
          {currentPage > 1 && (
            <button
              onClick={prevPage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Previous
            </button>
          )}
          <div className="flex-grow"></div> {/* This pushes the Next button to the right */}
          {currentPage * projectsPerPage < filteredProjects.length && (
            <button
              onClick={nextPage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
 
export default DeploymentProjectsPage;