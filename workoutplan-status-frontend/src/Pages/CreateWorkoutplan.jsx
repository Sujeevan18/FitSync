import React, { useState, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import workoutBck from '../images/workoutBck.jpg'; 
import toast from 'react-hot-toast';

// ChatBot Component
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: input,
        max_tokens: 150,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`, // Replace with your API Key
        },
      });

      const botMessage = { text: response.data.choices[0].text.trim(), sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      const errorMessage = { text: "Sorry, I couldn't process your request.", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, userMessage, errorMessage]);
    }
  };

  return (
    <div className="fixed top-0 right-0 m-4 w-96 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${message.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything!"
          className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <AiOutlineSend onClick={sendMessage} className="cursor-pointer text-blue-500" size={24} />
      </div>
    </div>
  );
};

// CreateWorkoutPlan Component
const CreateWorkoutPlan = () => {
  const [selectedWorkout, setSelectedWorkout] = useState("Chest");
  const [exercises, setExercises] = useState("");
  const [sets, setSets] = useState("");
  const [routine, setRoutine] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [editWorkoutPlans, setEditWorkoutPlans] = useState(false);

  const { workoutPlanId } = useParams();
  const location = useLocation();
  const workoutplan = location.state?.workoutplan;
  const navigate = useNavigate();

  useEffect(() => {
    if (workoutplan) {
      setSelectedWorkout(workoutplan.workoutPlanName);
      setExercises(workoutplan.exercises);
      setSets(workoutplan.sets);
      setRoutine(workoutplan.routine);
      setRepetitions(workoutplan.repetitions);
      setDescription(workoutplan.description);
      setDate(workoutplan.date);
      setEditWorkoutPlans(true);
    } else if (workoutPlanId) {
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
          console.error("Error fetching workout plan:", error.response || error);
          toast.error("Failed to fetch workout plan");
        }
      };
      fetchSingleWorkoutPlan();
    }
  }, [workoutplan, workoutPlanId]);

  const resetForm = () => {
    setSelectedWorkout("Chest");
    setExercises("");
    setSets("");
    setRoutine("");
    setRepetitions("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const validateForm = () => {
    if (!selectedWorkout.trim()) return toast.error("Workout is required");
    if (!routine.trim()) return toast.error("Routine is required");
    if (!exercises.trim()) return toast.error("Exercise name is required");
    if (!sets || isNaN(sets) || sets <= 0) return toast.error("Sets must be a positive number");
    if (!repetitions || isNaN(repetitions) || repetitions <= 0) return toast.error("Repetitions must be a positive number");
    if (!description.trim()) return toast.error("Description is required");
    if (!date) return toast.error("Date is required");
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
        navigate("/workoutplan"); // Navigate to workout plan list after submit
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

  return (
    <div
      style={{
        backgroundImage: `url(${workoutBck})`,
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
          animation: "fadeIn 0.8s ease-out",
        }}
      >
        <h1 className="mb-6 text-3xl font-semibold text-center text-indigo-600 animate__animated animate__fadeIn">
          {editWorkoutPlans ? "Confirm Edit" : "Create Workout Plan"}
        </h1>
        <div className="text-center mb-4">Please fill in your workout details</div>

        <div className="space-y-6">
          <div className="mb-6">
            <label htmlFor="routine" className="block text-sm font-medium text-gray-700">
              Routine Name
            </label>
            <input
              type="text"
              id="routine"
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Enter routine name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="exercises" className="block text-sm font-medium text-gray-700">
              Exercise Name
            </label>
            <input
              type="text"
              id="exercises"
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Enter exercise name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="sets" className="block text-sm font-medium text-gray-700">
              Sets Count
            </label>
            <input
              type="number"
              id="sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Enter sets count"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700">
              Repetitions
            </label>
            <input
              type="number"
              id="repetitions"
              value={repetitions}
              onChange={(e) => setRepetitions(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Enter repetitions count"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 sm:text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
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
              className="mt-1 block w-full px-4 py-2 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Describe your workout achievements..."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
        >
          {editWorkoutPlans ? "Confirm Edit" : "Submit Workout Plan"}
        </button>
        <button
          onClick={() => navigate("/workoutplan")}
          type="button"
          className="w-full mt-4 px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-full shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
        >
          {editWorkoutPlans ? "Remove Edit" : "Cancel"}
        </button>
      </form>
      <ChatBot /> {/* Embed ChatBot component */}
    </div>
  );
};

export default CreateWorkoutPlan;
