package com.example.Model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "workoutPlans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlan {

    @Id
    private String workoutPlanId;
    private String workoutPlanName;
    private String exercises;
    private int sets;
    private int repetitions;
    private String routine;
    private String description;
    private String date;
}
