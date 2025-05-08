package com.example.mealmanagement.controller;

import com.example.mealmanagement.model.Meal;
import com.example.mealmanagement.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:3000")
public class MealController {
    
    private static final Logger logger = LoggerFactory.getLogger(MealController.class);
    
    @Autowired
    private MealService mealService;
    
    @GetMapping("/")
    public ResponseEntity<List<Meal>> getAllMeals() {
        try {
            logger.info("Fetching all meals");
            List<Meal> meals = mealService.getAllMeals();
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching meals: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/")
    public ResponseEntity<?> createMeal(@RequestBody Meal meal) {
        try {
            logger.info("Received meal creation request: {}", meal);
            Meal savedMeal = mealService.createMeal(meal);
            logger.info("Successfully created meal: {}", savedMeal);
            return ResponseEntity.ok(savedMeal);
        } catch (Exception e) {
            logger.error("Error creating meal: ", e);
            return ResponseEntity.badRequest().body("Error creating meal: " + e.getMessage());
        }
    }

    @PutMapping("/{mealId}")
    public ResponseEntity<?> updateMeal(@PathVariable String mealId, @RequestBody Meal meal) {
        try {
            logger.info("Received meal update request for ID {}: {}", mealId, meal);
            Meal updatedMeal = mealService.updateMeal(mealId, meal);
            logger.info("Successfully updated meal: {}", updatedMeal);
            return ResponseEntity.ok(updatedMeal);
        } catch (Exception e) {
            logger.error("Error updating meal: ", e);
            return ResponseEntity.badRequest().body("Error updating meal: " + e.getMessage());
        }
    }

    @DeleteMapping("/{mealId}")
    public ResponseEntity<?> deleteMeal(@PathVariable String mealId) {
        try {
            logger.info("Received meal deletion request for ID: {}", mealId);
            mealService.deleteMeal(mealId);
            logger.info("Successfully deleted meal with ID: {}", mealId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting meal: ", e);
            return ResponseEntity.badRequest().body("Error deleting meal: " + e.getMessage());
        }
    }
} 