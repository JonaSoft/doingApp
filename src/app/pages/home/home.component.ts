import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestorechatsService } from '../../servicios/firestorechats.service'
import { AuthService} from '../../servicios/auth.service';
import { FileItem } from  '../../models/file-item'
import { CargaImagenesService } from 'src/app/servicios/carga-imagenes.service';
//para ver imagen e4n el chat
export interface Item { email:string;nombre: string; url:string}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

//archivos images sobre el input
  estaSobreInput = false;
  archivos: FileItem[]=[]


//******************************************

  mensaje:string ="";
  public elemento:any;
  public usuarionombre:string="";
  public chats: Observable<any[]>;
  public mensajes:any[]=[];
  public users: Observable<any[]>;
  public usuarios=[];
  private itemsCollection: AngularFirestoreCollection<Item>
  items: Observable<Item[]>;
  constructor(  private auth:AuthService,
                private router:Router,
                public db: AngularFirestore,
                public afs: AngularFirestore,
                public _cs: FirestorechatsService,
                public _usuario: AuthService,
                public _cargaImagenes: CargaImagenesService
             )
       {
        this.itemsCollection = afs.collection<Item>('img');
        this.items = this.itemsCollection.valueChanges(); 
        this.usuarionombre = this._usuario.leerEmail() 
        //oir cambios en collecciones de chats            
        this.chats = db.collection('chats').valueChanges();
        //console.log('chats',_cs.chats)
        //this.users = db.collection('users').valueChanges();
    
        //cargar mensajes des el servicio
        this._cs.cargarMensajes()
          .subscribe( (res)=>{
            //console.log(res.length)
            //console.log('mensajes',res[7].nombre)
            //console.log(localStorage.getItem('email'))
            let elemento = res.length
            elemento=elemento-1
            //console.log(elemento)
            if (elemento!=-1){
              if (res[elemento].nombre!=localStorage.getItem('email')){
                this.reproducir()
              }
              setTimeout(() => {
                this.elemento.scrollTop = this.elemento.scrollHeight;
                
              }, 2500);
            }
            
             
        });

        this._cs.cargarUsers()
          .subscribe(users=>{
            //console.log(users)
            let eliminauserusuario =users.filter(porborrar => porborrar.email != localStorage.getItem('email'));
            this.usuarios=eliminauserusuario;
            console.log(this.usuarios)

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
      //this._cargaImagenes.cargarImagenesFirebase(this.archivos)  
      this.elemento.scrollTop = this.elemento.scrollHeight;
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

// para cargar imagenes 
cargarImagenes(){
  this._cargaImagenes.cargarImagenesFirebase(this.archivos)
  
  
}
pruebaSobreInput( event){
  //console.log('aqui trabaja',event)
  if(!event){
    this._cargaImagenes.cargarImagenesFirebase(this.archivos)  
  }
}



}
