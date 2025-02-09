package com.taskplanner.task_planner.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.taskplanner.task_planner.dto.TaskDTO;
import com.taskplanner.task_planner.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.taskplanner.task_planner.exception.InvalidTaskStatusException;
import com.taskplanner.task_planner.model.Task;
import com.taskplanner.task_planner.model.TaskStatus;
import com.taskplanner.task_planner.repository.TaskRepository;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId("1");
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setStatus(TaskStatus.TODO);

        taskDTO = new TaskDTO();
        taskDTO.setTitle("Test Task");
        taskDTO.setDescription("Test Description");
        taskDTO.setStatus("TODO");
    }

    @Test
    void getAllTasks_ShouldReturnListOfTasks() {
        // Arrange
        when(taskRepository.findAll()).thenReturn(List.of(task));

        // Act
        List<Task> result = taskService.getAllTasks();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(taskRepository).findAll();
    }

    @Test
    void getTaskById_WithValidId_ShouldReturnTask() {
        // Arrange
        when(taskRepository.findById("1")).thenReturn(Optional.of(task));

        // Act
        Task result = taskService.getTaskById("1");

        // Assert
        assertNotNull(result);
        assertEquals("1", result.getId());
        verify(taskRepository).findById("1");
    }

    @Test
    void getTaskById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(taskRepository.findById("999")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTaskById("999");
        });
        verify(taskRepository).findById("999");
    }

    @Test
    void createTask_ShouldReturnCreatedTask() {
        // Arrange
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        // Act
        Task result = taskService.createTask(taskDTO);

        // Assert
        assertNotNull(result);
        assertEquals(TaskStatus.TODO, result.getStatus());
        assertEquals(taskDTO.getTitle(), result.getTitle());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTask_WithValidId_ShouldReturnUpdatedTask() {
        // Arrange
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setTitle("Updated Title");
        updateDTO.setStatus("IN_PROGRESS");

        when(taskRepository.findById("1")).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        // Act
        Task result = taskService.updateTask("1", updateDTO);

        // Assert
        assertNotNull(result);
        assertEquals(updateDTO.getTitle(), result.getTitle());
        verify(taskRepository).findById("1");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTask_WithInvalidStatus_ShouldThrowException() {
        // Arrange
        when(taskRepository.findById("1")).thenReturn(Optional.of(task));
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setStatus("INVALID_STATUS");

        // Act & Assert
        assertThrows(InvalidTaskStatusException.class, () -> {
            taskService.updateTask("1", updateDTO);
        });
    }

    @Test
    void deleteTask_WithValidId_ShouldDeleteTask() {
        // Arrange
        when(taskRepository.existsById("1")).thenReturn(true);
        doNothing().when(taskRepository).deleteById("1");

        // Act
        taskService.deleteTask("1");

        // Assert
        verify(taskRepository).existsById("1");
        verify(taskRepository).deleteById("1");
    }

    @Test
    void deleteTask_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(taskRepository.existsById("999")).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.deleteTask("999");
        });
        verify(taskRepository).existsById("999");
        verify(taskRepository, never()).deleteById(any());
    }
}