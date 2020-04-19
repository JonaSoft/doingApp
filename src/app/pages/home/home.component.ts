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
  public users:any[]=[];

  constructor(  private auth:AuthService,
                private router:Router,
                db: AngularFirestore,
                public _cs: FirestorechatsService,
                public _usuario: AuthService
                )
       {
        this.usuarionombre = this._usuario.leerEmail() 
        //oir cambios en collecciones de chats            
        this.chats = db.collection('chats').valueChanges();
        //console.log('chats',_cs.chats)
    
        //cargar mensajes des el servicio
        this._cs.cargarMensajes()
          .subscribe( (res)=>{
            //console.log('mensajes',res[7].nombre)
            //console.log(localStorage.getItem('email'))
            if (res[7].nombre!=localStorage.getItem('email')){
              this.reproducir()
            }
            setTimeout(() => {
              this.elemento.scrollTop = this.elemento.scrollHeight;
              
            }, 25);
             
        });

       }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
    if(!localStorage.getItem('token') || (!localStorage.getItem('email'))){
      this.salir()
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
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
  reproducir() {
    const audio = new Audio('assets/sound/iphone.mp3');
    audio.play();
}

}
