import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (statusId) {
      const fetchSinglePost = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8080/WorkoutStatus/${statusId}`);
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
    }
  }, [statusId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !distance || !pushups || !weight || !description || !date) {
      return toast.error("Please fill all the fields");
    }

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
        ? await axios.put(`http://localhost:8080/WorkoutStatus/${statusId}`, workoutStatusData)
        : await axios.post("http://localhost:8080/WorkoutStatus", workoutStatusData);

      if (res.status === 200 || res.status === 201) {
        toast.success(editStatus ? "Workout status updated" : "Workout status added");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to save workout status");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">
        {editStatus ? "Edit Workout Status" : "Create Workout Status"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label htmlFor="distance" className="block font-medium">Distance (km)</label>
          <input
            type="number"
            id="distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 5"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pushups" className="block font-medium">Push-ups</label>
          <input
            type="number"
            id="pushups"
            value={pushups}
            onChange={(e) => setPushups(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 30"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="weight" className="block font-medium">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block font-medium">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block font-medium">Workout Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows="4"
            placeholder="Describe your workout..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {editStatus ? "Update Status" : "Create Status"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-2 border py-2 rounded text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateWorkoutStatus;
