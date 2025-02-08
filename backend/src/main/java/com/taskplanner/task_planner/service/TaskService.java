package com.taskplanner.task_planner.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskplanner.task_planner.dto.TaskDTO;
import com.taskplanner.task_planner.exception.GlobalExceptionHandler.*;
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
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(TaskDTO taskDTO){
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(TaskStatus.TODO); // Default status
        return taskRepository.save(task);
    }

    public Task updateTask(String id, TaskDTO taskDTO){
        Task task = getTaskById(id);

        if (taskDTO.getTitle() != null) {
            task.setTitle(taskDTO.getTitle());
        }
        if(taskDTO.getDescription() != null){
            task.setDescription(taskDTO.getDescription());
        }
        if(taskDTO.getStatus() != null){
            task.setStatus(Task.valueOf(taskDTO.getStatus()));
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
