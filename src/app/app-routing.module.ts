import { NgModule, inject } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';

const canActivate: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  if(token != null && token != '') {
    return true;
  } else {
    inject(Router).navigate(['/']);
    return false;
  }
} 

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'my-page',
    canActivate: [canActivate],
    loadComponent: () => import('../pages/user-page/user-page.component').then(c => c.UserPageComponent)
  },
  {
    path: 'my-cats',
    canActivate: [canActivate],
    loadComponent: () => import('../pages/cats/cats.component').then(c => c.CatsPageComponent)
  },
  {
    path: 'food',
    canActivate: [canActivate],
    loadComponent: () => import('../pages/food/food.component').then(c => c.FoodComponent)
  },
  {
    path: 'health',
    canActivate: [canActivate],
    loadComponent: () => import('../pages/health/health.component').then(c => c.HealthComponent)
  },
  {
    path: 'sandbox',
    canActivate: [canActivate],
    loadComponent: () => import('../pages/sandboxes/sandboxes.component').then(c => c.SandboxesComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../pages/cadastro/cadastro.component').then(c => c.CadastroComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
