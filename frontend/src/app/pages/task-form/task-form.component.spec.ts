import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO'
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getTaskById', 'createTask', 'updateTask']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ToastrService, useValue: toastrService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    });

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditing).toBeFalse();
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
  });

  it('should load task data in edit mode', () => {
    taskService.getTaskById.and.returnValue(of(mockTask));
    fixture.detectChanges();

    expect(component.isEditing).toBeTrue();
    expect(component.taskForm.get('title')?.value).toBe(mockTask.title);
    expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
  });

  it('should handle error when loading task', () => {
    taskService.getTaskById.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(toastrService.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should create new task successfully', () => {
    component.taskForm.setValue({
      title: 'New Task',
      description: 'Description',
      status: 'TODO'
    });
    taskService.createTask.and.returnValue(of({ id: '1', ...component.taskForm.value }));

    component.onSubmit();

    expect(taskService.createTask).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should update task successfully', () => {
    component.isEditing = true;
    component.taskId = '1';
    taskService.updateTask.and.returnValue(of(mockTask));

    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS'
    });

    component.onSubmit();

    expect(taskService.updateTask).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
