package com.example.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Model.WorkoutStatus;


@Repository
public interface WorkoutStatusRepository extends MongoRepository<WorkoutStatus, String> {
}
