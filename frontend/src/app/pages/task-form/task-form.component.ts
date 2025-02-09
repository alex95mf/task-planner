import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  taskId?: string;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['TODO']
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    if (this.taskId) {
      this.isEditing = true;
      this.loadTask();
    }
  }

  loadTask() {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.taskForm.patchValue(task);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error loading task';
          this.toastr.error(errorMessage);
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;

      if (this.isEditing && this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe({
          next: () => {
            this.toastr.success('Task updated successfully');
            this.router.navigate(['/tasks'])
          },
          error: (error) => this.toastr.error(error.error.message || 'Error updating task')
        });
      } else {
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.toastr.success('Task created successfully');
            this.router.navigate(['/tasks'])
          },
          error: (error) => this.toastr.error(error.error.message || 'Error creating task')
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
