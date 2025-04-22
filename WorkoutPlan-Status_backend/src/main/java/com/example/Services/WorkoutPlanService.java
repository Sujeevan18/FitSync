package com.example.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.example.Model.WorkoutPlan;
import com.example.Repository.WorkoutPlanRepository;

@Service
public class WorkoutPlanService {
    
  @Autowired
  private WorkoutPlanRepository workoutPlanRepository;

  public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {
    return workoutPlanRepository.save(workoutPlan);
}

  public List<WorkoutPlan> getAllWorkoutPlans() {
    return workoutPlanRepository.findAll();
  }

  public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
    return workoutPlanRepository.findById(id);
  }

  public WorkoutPlan updateWorkoutPlan(String workoutPlanId, WorkoutPlan workoutPlan) {
    if (workoutPlanRepository.existsById(workoutPlanId)) {
        workoutPlan.setWorkoutPlanId(workoutPlanId);
        workoutPlan.setWorkoutPlanName(workoutPlan.getWorkoutPlanName());
        workoutPlan.setSets(workoutPlan.getSets());
        workoutPlan.setRoutine(workoutPlan.getRoutine());
        workoutPlan.setDate(workoutPlan.getDate());
        workoutPlan.setExercises(workoutPlan.getExercises());
        workoutPlan.setRepetitions(workoutPlan.getRepetitions());
        workoutPlan.setDescription(workoutPlan.getDescription());
        return workoutPlanRepository.save(workoutPlan);
    } else {
        return null;
    }
}

public void deleteWorkoutPlan(String workoutPlanId) {
  workoutPlanRepository.deleteById(workoutPlanId);
}

}

