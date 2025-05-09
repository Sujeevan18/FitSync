import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import chestImg from "../images/chestImg.png";

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
  const location = useLocation();
  const workoutStatusData = location.state?.workoutStatus;

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (workoutStatusData) {
      setDistance(workoutStatusData.distance);
      setPushups(workoutStatusData.pushups);
      setWeight(workoutStatusData.weight);
      setDescription(workoutStatusData.description);
      setDate(workoutStatusData.date);
      setEditStatus(true);
    } else if (statusId) {
      const fetchSinglePost = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/WorkoutStatus/${statusId}`
          );
          setDistance(data.distance);
          setPushups(data.pushUps);
          setWeight(data.weight);
          setDescription(data.description);
          setDate(data.date);
          setEditStatus(true);
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch workout status");
        }
      };
      fetchSinglePost();
    }
  }, [statusId, workoutStatusData]);

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
    if (!description.trim()) errors.push("Workout description is required.");
    if (!date) errors.push("Date is required.");
    else if (new Date(date) < new Date(getTodayDate())) {
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
      let res;
      if (editStatus) {
        res = await axios.put(
          `http://localhost:8080/WorkoutStatus/${statusId}`,
          workoutStatusData
        );
      } else {
        res = await axios.post("http://localhost:8080/WorkoutStatus", workoutStatusData);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(editStatus ? "Workout status updated" : "Workout status added");
        navigate("/WorkoutStatus");
      } else {
        toast.error("Failed to save workout status. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error.response || error);
      toast.error(
        `Failed to save workout status: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleCancel = () => {
    setDistance("");
    setPushups("");
    setWeight("");
    setDescription("");
    setDate("");
  };

  const handleRemoveEdit = () => {
    handleCancel();
    navigate("/WorkoutStatus");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${chestImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl transform transition-all duration-500"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          minWidth: "300px",
        }}
      >
        <h1 className="mb-6 text-3xl font-semibold text-center text-indigo-600">
          {editStatus ? "Confirm Edit" : "Create Workout Status"}
        </h1>

        <div className="mb-4">
          <label className="block text-lg font-medium">Distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g. 5"
            min="0"
            step="any"
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Push-ups</label>
          <input
            type="number"
            value={pushups}
            onChange={(e) => setPushups(e.target.value)}
            placeholder="e.g. 30"
            min="0"
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70"
            min="0"
            step="any"
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getTodayDate()}
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium">Workout Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Describe your workout..."
            className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="flex flex-col space-y-4">
          {editStatus ? (
            <>
              <button
                type="submit"
                className="w-full px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              >
                Confirm Edit
              </button>
              <button
                type="button"
                onClick={handleRemoveEdit}
                className="w-full px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              >
                Cancel Edit
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="w-full px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              >
                Create Status
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateWorkoutStatus;
