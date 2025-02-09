import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./pages/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () => import('./pages/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./pages/task-detail/task-detail.component').then(m => m.TaskDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  }
];
