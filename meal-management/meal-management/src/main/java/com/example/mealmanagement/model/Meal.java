package com.example.mealmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "meals")
public class Meal {
    @Id
    private String mealId;
    private String userName;
    private String mealName;
    private Integer calories;
    private String dateEntered;
    private String cuisineType;
} 