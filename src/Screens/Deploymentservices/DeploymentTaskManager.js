import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeploymentSidebar from "../../Screens/Deploymentservices/DeploymentSidebar";
 
const apiUrl = process.env.REACT_APP_API_URL;

const DeploymentTaskManager = () => {
  const navigate = useNavigate();
 
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
 
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
 
  const createTask = async () => {
    if (!taskName || !assignedTo || !area || !description) {
      alert("Please fill in all fields.");
      return;
    }
 
    const newTask = {
      taskName,
      assignedTo,
      status: taskStatus,
      area,
      description,
    };
 
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
        body: JSON.stringify(newTask),
      });
 
      if (!response.ok) throw new Error("Failed to create task");
 
      fetchTasks();
      setTaskName("");
      setAssignedTo("");
      setTaskStatus("Pending");
      setArea("");
      setDescription("");
 
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
 
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-screen bg-gray-100 shadow-lg">
        <DeploymentSidebar />
      </div>
 
      {/* Main Content */}
      <div className="flex-grow p-6 bg-white w-1000 rounded-lg ml-64">
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Tasks</h2>
 
            {/* Buttons grouped together */}
            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
                !selectedTask && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => {
                if (selectedTask) {
                  navigate("/tasks/create", { state: { task: selectedTask } });
                } else {
                  alert("Please select a task first.");
                }
              }}
              disabled={!selectedTask}
            >
              + New Task
            </button>
            <button className="text-gray-600 px-4 py-2 rounded-lg">Import</button>
          </div>
 
          {/* Search Bar (Moved to right side) */}
          <div className="flex items-center border-gray-300 rounded-lg px-3 py-2 bg-white w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              className="ml-6 outline-none w-full"
            />
          </div>
        </div>
 
        {/* Filter Section (Moved closer to buttons) */}
        <div className="mt-4 bg-white shadow-md p-4 rounded-lg border-b border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-600 font-medium flex items-center gap-1">
              Filter by:
            </span>
            <span className="text-black font-medium">✅ Task</span>
          </div>
 
          {/* Create Task Form */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold mb-3">Create a New Task</h2>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Task Name"
                className="p-2 border rounded-lg"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Assigned To"
                className="p-2 border rounded-lg"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
              <select
                className="p-2 border rounded-lg"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="Pending">Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Area"
                className="p-2 border rounded-lg"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                className="p-2 border rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={createTask}
              >
                + Create Task
              </button>
            </div>
          </div>
 
          {/* Task Table */}
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-3 text-gray-700">Select</th>
                  <th className="text-left p-3 text-gray-700">Task</th>
                  <th className="text-left p-3 text-gray-700">Assigned To</th>
                  <th className="text-left p-3 text-gray-700">Status</th>
                  <th className="text-left p-3 text-gray-700">Area</th>
                  <th className="text-left p-3 text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="text-left p-3">
                        <input
                          type="radio"
                          name="selectedTask"
                          onChange={() => setSelectedTask(task)}
                        />
                      </td>
                      <td className="text-left p-3">{task.taskName}</td>
                      <td className="text-left p-3">{task.assignedTo}</td>
                      <td className="text-left p-3">{task.status}</td>
                      <td className="text-left p-3">{task.area}</td>
                      <td className="text-left p-3">{task.description || "No description"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No tasks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DeploymentTaskManager;