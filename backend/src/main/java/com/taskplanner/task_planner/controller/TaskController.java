package com.taskplanner.task_planner.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.taskplanner.task_planner.dto.TaskDTO;
import com.taskplanner.task_planner.model.Task;
import com.taskplanner.task_planner.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Tasks", description = "Task planner endpoints")
public class TaskController {
    private final TaskService taskService;

    @Operation(
        summary = "Get all tasks",
        description = "Retrieves a list of all tasks in the system"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved all tasks"
    )
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(){
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @Operation(
        summary = "Get task by ID",
        description = "Retrieves a specific task by its ID"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved the task"
    )
    @ApiResponse(
        responseCode = "404",
        description = "Task not found"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(
        @Parameter(description = "ID of the task to retrieve", required = true)
        @PathVariable String id){
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @Operation(
        summary = "Create new task",
        description = "Creates a new task in the system"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Task successfully created"
    )
    @PostMapping
    public ResponseEntity<Task> createTask(
        @Parameter(description = "Task details", required = true)
        @Valid @RequestBody TaskDTO taskDTO){
        Task created = taskService.createTask(taskDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Update task",
        description = "Updates an existing task"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Task successfully updated"
    )
    @ApiResponse(
        responseCode = "400",
        description = "Invalid task status provided"
    )
    @ApiResponse(
        responseCode = "404",
        description = "Task not found"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
        @Parameter(description = "ID of the task to update", required = true)
        @PathVariable String id,
        @Parameter(description = "Updated task details", required = true)
        @Valid @RequestBody TaskDTO taskDTO
    ){
        Task updated = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "Delete task",
        description = "Deletes a task from the system"
    )
    @ApiResponse(
        responseCode = "204",
        description = "Task successfully deleted"
    )
    @ApiResponse(
        responseCode = "404",
        description = "Task not found"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
        @Parameter(description = "ID of the task to delete", required = true)
        @PathVariable String id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
