import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getTaskById', 'deleteTask']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TaskDetailComponent],
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
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task details on init', () => {
    taskService.getTaskById.and.returnValue(of(mockTask));
    fixture.detectChanges();

    expect(component.task).toEqual(mockTask);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should handle error when loading task', () => {
    taskService.getTaskById.and.returnValue(throwError(() => new Error('Test error')));
    fixture.detectChanges();

    component.loadTask('1');

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should delete task successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taskService.deleteTask.and.returnValue(of(void 0));
    component.task = mockTask;

    component.deleteTask();

    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTask.id);
    expect(toastrService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should not delete task if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.task = mockTask;

    component.deleteTask();

    expect(taskService.deleteTask).not.toHaveBeenCalled();
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('TODO')).toBe('todo');
    expect(component.getStatusClass('IN_PROGRESS')).toBe('in-progress');
    expect(component.getStatusClass('COMPLETED')).toBe('completed');
  });
});
