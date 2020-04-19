import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.models';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url ='https://identitytoolkit.googleapis.com/v1/accounts:'
  private apikey ='AIzaSyDBdopumVSXbxMzKS9FzqclkVXzF5s7GQw';


  userToken:string;
  usuarioEmail:string

  //crear
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //loguearse
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    this.leerToken()
   }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email')
  }


  login(usuario:UsuarioModel){

    const authData ={
      ...usuario,
      returnSecureToken:true
    };
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map( res=>{
        this.guardarToken( res['idToken']);
        this.guardarEmail(res['email']);
        console.log('desde auth users',res)
        return res
      })
    )

  }
  nuevoUsuario (usuario:UsuarioModel){
    console.log('recibido en auth',usuario)
    const authData ={
      ...usuario,
      returnSecureToken:true
    };
    console.log('de nuevo usuario',authData)
    return this.http.post(
      `${this.url}signUp?key=${this.apikey}`,
      authData
    ).pipe(
      map( res=>{
        //this.guardarToken( res['idToken']);
        //this.guardarEmail(res['email']);
        return res
      })
    )
  };

  private guardarToken(idToken:string){

    this.userToken = idToken;
    localStorage.setItem('token',idToken);

  };

  leerToken(){

      if(localStorage.getItem('token')){

          this.userToken = localStorage.getItem('item')

      } else{

        this.userToken ='';

      }
      return this.userToken;
  }

  estaAutenticado(): boolean {
    console.log(this.userToken)
    if (this.userToken.length>2){
      return true;
    } else{
      return false;
    }
      
  }
  private guardarEmail(email:string){
    this.usuarioEmail = email;
    localStorage.setItem('email',email);
  }
  //LEER USUARIO
  leerEmail(){
    if ( localStorage.getItem('email')){
          console.log(localStorage.getItem('email'))
          return this.usuarioEmail = localStorage.getItem('email');
    } else {
          return this.usuarioEmail = "";
    }
 }

 



}
