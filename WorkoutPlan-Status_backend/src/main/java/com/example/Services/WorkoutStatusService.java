package com.example.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Model.WorkoutStatus;
import com.example.Repository.WorkoutStatusRepository;


@Service
public class WorkoutStatusService {


    @Autowired
    private WorkoutStatusRepository workoutStatusRepository;


    public WorkoutStatus createWorkoutStatus(WorkoutStatus workoutStatus) {
        return workoutStatusRepository.save(workoutStatus);
    }


    public List<WorkoutStatus> getAllWorkoutStatus() {
        return workoutStatusRepository.findAll();
    }


    public Optional<WorkoutStatus> getWorkoutStatsusById(String statusId) {
        try {
            return workoutStatusRepository.findById(statusId);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }


    public WorkoutStatus updateWorkoutStatus(String statusId, WorkoutStatus workoutStatus) {
        if (workoutStatusRepository.existsById(statusId)) {
            workoutStatus.setStatusId(statusId);
            workoutStatus.setDistance(workoutStatus.getDistance());
            workoutStatus.setPushUps(workoutStatus.getPushUps());
            workoutStatus.setWeight(workoutStatus.getWeight());
            workoutStatus.setDescription(workoutStatus.getDescription());
            workoutStatus.setDate(workoutStatus.getDate());
            return workoutStatusRepository.save(workoutStatus);
        } else {
            return null;
        }
    }


    public void deleteWorkoutStatus(String statusId) {
        workoutStatusRepository.deleteById(statusId);
    }
    

}

