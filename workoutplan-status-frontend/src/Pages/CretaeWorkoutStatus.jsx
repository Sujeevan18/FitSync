import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import chestImg from "../images/chestImg.png"; // Background image for full UI

const CreateWorkoutStatus = () => {
  const [distance, setDistance] = useState("");
  const [pushups, setPushups] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editStatus, setEditStatus] = useState(false);

  const { statusId } = useParams();
  const navigate = useNavigate();

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (statusId) {
      const fetchSinglePost = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/WorkoutStatus/${statusId}`
          );
          setWeight(data.weight);
          setDistance(data.distance);
          setPushups(data.pushUps);
          setDescription(data.description);
          setDate(data.date);
          setEditStatus(true);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSinglePost();
    } else {
      setDate(getTodayDate());
    }
  }, [statusId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const validateForm = () => {
    const errors = [];

    if (!distance || isNaN(distance) || Number(distance) < 0)
      errors.push("Please enter a valid non-negative distance.");
    if (!pushups || isNaN(pushups) || Number(pushups) < 0)
      errors.push("Please enter a valid non-negative push-up count.");
    if (!weight || isNaN(weight) || Number(weight) < 0)
      errors.push("Please enter a valid non-negative weight.");
    if (!description.trim())
      errors.push("Workout description is required.");
    if (!date) {
      errors.push("Date is required.");
    } else if (new Date(date) < new Date(getTodayDate())) {
      errors.push("Date cannot be in the past.");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const workoutStatusData = {
      userId: user.id,
      distance,
      pushUps: pushups,
      weight,
      description,
      date,
    };

    try {
      const res = editStatus
        ? await axios.put(
            `http://localhost:8080/WorkoutStatus/${statusId}`,
            workoutStatusData
          )
        : await axios.post("http://localhost:8080/WorkoutStatus", workoutStatusData);

      if (res.status === 200 || res.status === 201) {
        toast.success(editStatus ? "Workout status updated" : "Workout status added");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to save workout status");
    }
  };

  const handleCancel = () => {
    setDistance("");
    setPushups("");
    setWeight("");
    setDescription("");
    setDate(getTodayDate());
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${chestImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "20px",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          animation: "slideUp 0.5s ease-out",
        }}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          {editStatus ? "Edit Workout Status" : "Create Workout Status"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="e.g. 5"
              min="0"
              step="any"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pushups" className="block text-sm font-medium">
              Push-ups
            </label>
            <input
              type="number"
              id="pushups"
              value={pushups}
              onChange={(e) => setPushups(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="e.g. 30"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="weight" className="block text-sm font-medium">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="e.g. 50"
              min="0"
              step="any"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium">
              Workout Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              rows="4"
              placeholder="Describe your workout..."
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
            >
              {editStatus ? "Update Status" : "Create Status"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutStatus;
