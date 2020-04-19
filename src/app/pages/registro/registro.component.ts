import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.models';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  usuario: UsuarioModel;
  
  constructor(private auth:AuthService,
              private router:Router) { }

  ngOnInit() { 

    this.usuario = new UsuarioModel();

    //this.usuario.email ='carlosantonioucananbarrera@gmail.com';

  }
  onSubmit(form:NgForm){
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

     
   this.auth.nuevoUsuario(this.usuario)
      .subscribe(res =>{
      console.log('enviando usuario',this.usuario)  
      console.log('responde',res)
      Swal.close();
      this.router.navigateByUrl('/login')
    },(err)=>{
      console.log(err.error.error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: err.error.error.message,
      });
    })
  }
  

  



}
