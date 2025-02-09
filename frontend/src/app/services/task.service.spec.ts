import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', () => {
      const mockTasks: Task[] = [mockTask];

      service.getAllTasks().subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/tasks`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a single task', () => {
      service.getTaskById('1').subscribe(task => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/tasks/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const newTask: Task = {
        id: '2',
        title: 'New Task',
        description: 'New Description',
        status: 'TODO' as const
      };

      service.createTask(newTask).subscribe(task => {
        expect(task).toEqual({...mockTask, ...newTask});
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/tasks`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush({...mockTask, ...newTask});
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const updatedTask = {
        ...mockTask,
        title: 'Updated Task'
      };

      service.updateTask('1', updatedTask).subscribe(task => {
        expect(task).toEqual(updatedTask);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/tasks/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTask);
      req.flush(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      service.deleteTask('1').subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/tasks/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
