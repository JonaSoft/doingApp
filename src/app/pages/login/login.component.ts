import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.models';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import  Swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { FirestorechatsService } from 'src/app/servicios/firestorechats.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //users:[]=[];  
  usuario: UsuarioModel;
  recuerdaUsuario=false;

  constructor(private auth:AuthService,
              private router:Router,
              public _cs: FirestorechatsService,
              ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

  }
  login(form:NgForm){
    if (form.invalid){
       return;
    }
    Swal.fire({
      icon: 'info',
      title: 'Espere',
      text:'Validando Informacion',
      allowOutsideClick: false
     });
     Swal.showLoading();
    console.log('envia al login',this.usuario)
    this.auth.login(this.usuario)
      .subscribe(res =>{
          console.log('que hallo',res['email'])
          Swal.close();
          this.router.navigateByUrl('/home');
          this._cs.agregarUsuario(res['email'])
      },(err)=>{
        console.log(err.error.error.message)
        Swal.fire({
          icon: 'error',
          title: 'Error de Autenticación',
          text: err.error.error.message,
        });
      })
  }
 
  


}
