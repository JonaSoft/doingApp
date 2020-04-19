import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth:AuthService,
              private router:Router){

  }
  canActivate():  boolean  {
    console.log('Guard')
    if(this.auth.estaAutenticado() ){
      //this.router.navigateByUrl('home');
      return true;
    } else {
        this.router.navigateByUrl('login');
        return false;
    }
    //return this.auth.estaAutenticado();
    
    
  }
  
}
