import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestorechatsService } from '../../servicios/firestorechats.service'
import { AuthService} from '../../servicios/auth.service'




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mensaje:string ="";
  elemento:any;
  public usuarionombre:string="";
  public chats: Observable<any[]>;
  public mensajes:any[]=[];
  public users: Observable<any[]>;
  public usuarios=[]

  constructor(  private auth:AuthService,
                private router:Router,
                public db: AngularFirestore,
                public _cs: FirestorechatsService,
                public _usuario: AuthService
                )
       {
        this.usuarionombre = this._usuario.leerEmail() 
        //oir cambios en collecciones de chats            
        this.chats = db.collection('chats').valueChanges();
        //console.log('chats',_cs.chats)
        //this.users = db.collection('users').valueChanges();
    
        //cargar mensajes des el servicio
        this._cs.cargarMensajes()
          .subscribe( (res)=>{
            console.log(res.length)
            //console.log('mensajes',res[7].nombre)
            //console.log(localStorage.getItem('email'))
            let elemento = res.length
            elemento=elemento-1
            console.log(elemento)
            if (elemento!=-1){
              if (res[elemento].nombre!=localStorage.getItem('email')){
                this.reproducir()
              }
              setTimeout(() => {
                this.elemento.scrollTop = this.elemento.scrollHeight;
                
              }, 25);
            }
            
             
        });

        this._cs.cargarUsers()
          .subscribe(users=>{
            console.log(users)
            this.usuarios=users

          })
       }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
    if(!localStorage.getItem('token') || (!localStorage.getItem('email'))){
      this.auth.logout();
      this.router.navigateByUrl('/login')
      //this.router.navigateByUrl('/login')
    }
  }
  enviarMensaje(){
    console.log(this.mensaje);
    if (this.mensaje.length === 0){
      return
    }
    this.usuarionombre = this._usuario.leerEmail() 
    console.log(this.usuarionombre)
    this._cs.agregarMensajes(this.mensaje,this.usuarionombre)
      .then(()=>{
        this.mensaje=""
        
      })
      .catch((err)=>console.log(err))
  }
  
  salir(){
    let eliminausuario = this.usuarios.filter(porborrar => porborrar.email == localStorage.getItem('email'))
    console.log('que eliminara',eliminausuario)
    //let eliminausuario=localStorage.getItem('email')
    this.db.collection("users").doc(eliminausuario[0].uid).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
  reproducir() {
    const audio = new Audio('assets/sound/iphone.mp3');
    audio.play();
}

}
