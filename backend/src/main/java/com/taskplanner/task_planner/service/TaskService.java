package com.taskplanner.task_planner.service;

import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taskplanner.task_planner.dto.TaskDTO;
import com.taskplanner.task_planner.exception.GlobalExceptionHandler.*;
import com.taskplanner.task_planner.exception.InvalidTaskStatusException;
import com.taskplanner.task_planner.model.Task;
import com.taskplanner.task_planner.model.TaskStatus;
import com.taskplanner.task_planner.repository.TaskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Task ID cannot be null or empty");
        }
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(TaskDTO taskDTO){
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }

    public Task updateTask(String id, TaskDTO taskDTO){
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (taskDTO.getTitle() != null) {
            task.setTitle(taskDTO.getTitle());
        }
        if(taskDTO.getDescription() != null){
            task.setDescription(taskDTO.getDescription());
        }
        if(taskDTO.getStatus() != null){
            try {
                task.setStatus(TaskStatus.valueOf(taskDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new InvalidTaskStatusException(
                    "Invalid status: " + taskDTO.getStatus() + ". Valid values are: " + 
                    Arrays.toString(TaskStatus.values())
                );
            }
        }

        return taskRepository.save(task);
    }

    public void deleteTask(String id){
        if(!taskRepository.existsById(id)){
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
}
