import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CreateWorkoutPlan from "./Pages/CreateWorkoutplan";
import CreateWorkoutStatus from "./Pages/CretaeWorkoutStatus"
import WorkoutStatus from "./Pages/WorkoutStatus";
import WorkoutPlan from "./Pages/WorkoutPlan";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>

      <Route path="/"  />
        <Route path="/CreateWorkoutPlan" element={<CreateWorkoutPlan />} />
        <Route path="/CreateWorkoutPlan/:workoutPlanId" element={<CreateWorkoutPlan />} />

        <Route path="/CreateWorkoutStatus" element={<CreateWorkoutStatus />} />
        <Route path="/CreateWorkoutStatus/:statusId" element={<CreateWorkoutStatus />} />

        <Route path="/WorkoutPlan" element={<WorkoutPlan />} />
        <Route path="/WorkoutStatus" element={<WorkoutStatus />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
