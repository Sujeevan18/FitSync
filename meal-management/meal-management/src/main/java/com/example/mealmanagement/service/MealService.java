package com.example.mealmanagement.service;

import com.example.mealmanagement.model.Meal;
import com.example.mealmanagement.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class MealService {
    
    @Autowired
    private MealRepository mealRepository;
    
    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }
    
    public Meal createMeal(Meal meal) {
        validateMeal(meal);
        return mealRepository.save(meal);
    }

    public Meal updateMeal(String mealId, Meal updatedMeal) {
        Optional<Meal> existingMeal = mealRepository.findById(mealId);
        if (existingMeal.isPresent()) {
            Meal meal = existingMeal.get();
            meal.setUserName(updatedMeal.getUserName());
            meal.setMealName(updatedMeal.getMealName());
            meal.setCalories(updatedMeal.getCalories());
            meal.setDateEntered(updatedMeal.getDateEntered());
            meal.setCuisineType(updatedMeal.getCuisineType());
            validateMeal(meal);
            return mealRepository.save(meal);
        }
        throw new IllegalArgumentException("Meal not found with ID: " + mealId);
    }

    public void deleteMeal(String mealId) {
        if (!mealRepository.existsById(mealId)) {
            throw new IllegalArgumentException("Meal not found with ID: " + mealId);
        }
        mealRepository.deleteById(mealId);
    }
    
    private void validateMeal(Meal meal) {
        if (meal == null) {
            throw new IllegalArgumentException("Meal cannot be null");
        }
        if (!StringUtils.hasText(meal.getMealId())) {
            throw new IllegalArgumentException("Meal ID is required");
        }
        if (!StringUtils.hasText(meal.getUserName())) {
            throw new IllegalArgumentException("User name is required");
        }
        if (!StringUtils.hasText(meal.getMealName())) {
            throw new IllegalArgumentException("Meal name is required");
        }
        if (meal.getCalories() == null || meal.getCalories() <= 0) {
            throw new IllegalArgumentException("Calories must be greater than 0");
        }
        if (!StringUtils.hasText(meal.getDateEntered())) {
            throw new IllegalArgumentException("Date entered is required");
        }
        if (!StringUtils.hasText(meal.getCuisineType())) {
            throw new IllegalArgumentException("Cuisine type is required");
        }
    }
} 