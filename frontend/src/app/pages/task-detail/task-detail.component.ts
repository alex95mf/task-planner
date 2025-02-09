import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  loading = true;
  error = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadTask(id);
  }

  loadTask(id: string) {
    this.loading = true;
    this.error = false;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
        const errorMessage = error.error?.message || 'Error loading task';
        this.toastr.error(errorMessage);
      }
    });
  }

  deleteTask() {
    if (this.task?.id && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.toastr.success('Task deleted successfully');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error deleting task';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }
}
