package com.example.Model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "WorkoutStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class WorkoutStatus {

    @Id
    private String statusId;    
    private int distance;
    private int pushUps;
    private int weight;
    private String description;
    private String date;

}
