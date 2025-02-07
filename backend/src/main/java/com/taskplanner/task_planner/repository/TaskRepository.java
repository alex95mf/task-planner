package com.taskplanner.task_planner.repository;

import com.taskplanner.task_planner.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, String> {
    
}
