package com.taskplanner.task_planner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskDTO {
    private String id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    private String status;
}
