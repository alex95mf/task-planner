import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: 'Description 1', status: 'TODO' },
    { id: '2', title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS' },
    { id: '3', title: 'Task 3', description: 'Description 3', status: 'COMPLETED' }
  ];

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getAllTasks', 'deleteTask']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TaskListComponent
      ],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [
      { id: '1', title: 'Task 1', description: 'Desc 1', status: 'TODO' },
      { id: '2', title: 'Task 2', description: 'Desc 2', status: 'IN_PROGRESS' }
    ];
  });

  beforeEach(() => {
    taskService.getAllTasks.and.returnValue(of(mockTasks));
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [...mockTasks];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    taskService.getAllTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();

    expect(component.tasks).toEqual(mockTasks);
    expect(taskService.getAllTasks).toHaveBeenCalled();
  });

  it('should handle error when loading tasks', () => {
    const error = { error: { message: 'Error loading tasks' } };
    taskService.getAllTasks.and.returnValue(throwError(() => error));
    component.tasks = [];

    component.loadTasks();

    expect(toastrService.error).toHaveBeenCalled();
    expect(component.tasks.length).toBe(0);
  });

  it('should delete task successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taskService.deleteTask.and.returnValue(of(void 0));
    component.tasks = [
      { id: '1', title: 'Task 1', description: 'Desc 1', status: 'TODO' },
      { id: '2', title: 'Task 2', description: 'Desc 2', status: 'IN_PROGRESS' }
    ];
    const initialLength = component.tasks.length;

    component.deleteTask('1');

    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks.length).toBe(initialLength - 1);
    expect(toastrService.success).toHaveBeenCalled();
  });

  it('should not delete task if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const initialLength = component.tasks.length;

    component.deleteTask('1');

    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialLength);
  });

  it('should handle error when deleting task', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const error = { error: { message: 'Error deleting task' } };
    taskService.deleteTask.and.returnValue(throwError(() => error));
    const initialLength = component.tasks.length;

    component.deleteTask('1');

    expect(toastrService.error).toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialLength);
  });
});
