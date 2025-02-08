package com.taskplanner.task_planner.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.taskplanner.task_planner.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);    
}
