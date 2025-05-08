package com.example.mealmanagement.repository;

import com.example.mealmanagement.model.Meal;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MealRepository extends MongoRepository<Meal, String> {
} 