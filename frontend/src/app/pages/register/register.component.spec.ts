import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        RegisterComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should be invalid with short password', () => {
    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['password'].setValue('123');
    expect(component.registerForm.valid).toBeFalsy();
    expect(component.registerForm.controls['password'].errors?.['minlength']).toBeTruthy();
  });

  it('should be valid with proper data', () => {
    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.controls['username'].setValue('');
    component.registerForm.controls['password'].setValue('123');

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should trim whitespace from username', () => {
    const credentials = {
      username: '  testuser  ',
      password: 'password123'
    };
    authService.register.and.returnValue(of({ token: 'fake-token' }));

    component.registerForm.setValue(credentials);
    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });
});
