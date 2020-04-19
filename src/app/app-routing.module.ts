import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home'    , component: HomeComponent, },
  { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  //{ path:' ', pathMatch:'full', redirectTo:'login' },
  //canActivate: [AuthGuard] 
  { path: '**', redirectTo: 'login' }
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
