import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const CreateWorkoutPlan = () => {
  const [selectedWorkout, setSelectedWorkout] = useState("Chest");
  const [exercises, setExercises] = useState("");
  const [sets, setSets] = useState("");
  const [routine, setRoutine] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [editWorkoutPlans, setEditWorkoutPlans] = useState(false);
  const [user, setUser] = useState(null);
  const { workoutPlanId } = useParams();
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchSingleWorkoutPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/workoutplan/${workoutPlanId}`
        );
        setSelectedWorkout(data.workoutPlanName);
        setExercises(data.exercises);
        setSets(data.sets);
        setRoutine(data.routine);
        setRepetitions(data.repetitions);
        setDescription(data.description);
        setDate(data.date);
        setEditWorkoutPlans(true);
      } catch (error) {
        console.error("Error fetching workout plan:", error);
      }
    };

    if (workoutPlanId) {
      fetchSingleWorkoutPlan();
    }
  }, [workoutPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (!editWorkoutPlans) {
      setDate(getTodayDate()); // Set default date to today
    }
  }, [editWorkoutPlans]);

  const resetForm = () => {
    setSelectedWorkout("Chest");
    setExercises("");
    setSets("");
    setRoutine("");
    setRepetitions("");
    setDescription("");
    setDate(getTodayDate());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedWorkout.trim()) newErrors.selectedWorkout = "Workout is required";
    if (!routine.trim()) newErrors.routine = "Routine is required";
    if (!exercises.trim()) newErrors.exercises = "Exercise name is required";
    if (!sets || isNaN(sets) || sets <= 0) newErrors.sets = "Sets must be a positive number";
    if (!repetitions || isNaN(repetitions) || repetitions <= 0)
      newErrors.repetitions = "Repetitions must be a positive number";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) {
      newErrors.date = "Date is required";
    } else if (new Date(date) < new Date(getTodayDate())) {
      newErrors.date = "Date cannot be in the past";
    }

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const workoutData = {
      sets: Number(sets),
      routine,
      date,
      exercises,
      repetitions: Number(repetitions),
      description,
      workoutPlanName: selectedWorkout,
    };

    try {
      const res = editWorkoutPlans
        ? await axios.put(
            `http://localhost:8080/workoutplan/${workoutPlanId}`,
            workoutData
          )
        : await axios.post(`http://localhost:8080/workoutplan`, workoutData);

      if (res.status >= 200 && res.status < 300) {
        toast.success(
          editWorkoutPlans
            ? "Workout Plan Updated Successfully"
            : "Workout Plan Added Successfully"
        );
        resetForm();
        navigate("/");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        editWorkoutPlans
          ? "Failed to update workout plan"
          : "Failed to add workout plan"
      );
    }
  };

  const goToWorkoutPlans = (e) => {
    e.preventDefault();
    resetForm();
    navigate("/");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w mx-auto my-6 bg-white p-12 rounded-lg shadow-md"
      >
        <h1 className="mb-4 text-3xl font-semibold text-center text-indigo-600">
          {editWorkoutPlans ? "Edit Workout Plan" : "Create Workout Plan"}
        </h1>
        <div className="text-center mb-4">Please select your Routine</div>

        <div className="space-y-8">
          <div className="mb-4">
            <label htmlFor="routine" className="block text-sm font-medium text-gray-700">
              Routine Name
            </label>
            <input
              type="text"
              id="routine"
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter routine name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="exercises" className="block text-sm font-medium text-gray-700">
              Exercise Name
            </label>
            <input
              type="text"
              id="exercises"
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter exercise name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sets" className="block text-sm font-medium text-gray-700">
              Sets Count
            </label>
            <input
              type="number"
              id="sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter sets count"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700">
              Repetitions
            </label>
            <input
              type="number"
              id="repetitions"
              value={repetitions}
              onChange={(e) => setRepetitions(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter repetitions count"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description of your workout
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your workout achievements..."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-black rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Workout Status
        </button>
        <button
          onClick={goToWorkoutPlans}
          type="button"
          className="w-full px-4 mt-2 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateWorkoutPlan;
