import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
//import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interfaces/mensaje.interface';
import { User} from '../interfaces/user.interface';
import { Observable } from 'rxjs';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/map';

@Injectable()

export class FirestorechatsService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  private itemsUsers: AngularFirestoreCollection<User>;
  private itemsUsers1: AngularFirestoreCollection<User>;
  //public chats: Observable<any[]>;
  public chats: Mensaje[] = []; 
  public users: User[]=[];
  public users1:Observable<User[]>
  constructor(private afs: AngularFirestore,
              private afs1: AngularFirestore,
              public db: AngularFirestore) {
                this.itemsUsers1=afs1.collection<User>('users');
                this.users1=this.itemsUsers1.valueChanges();

               }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                                           .limit(15) );

    //retorna cambios en colecciones
    return this.itemsCollection.valueChanges().pipe(
                             map( (mensajes:Mensaje[]) =>{
                                //console.log(mensajes)
                                //this.chats=mensajes
                                this.chats=[];
                                for ( let mensaje of mensajes){
                                    //adiciona al inicio de la matriz
                                    this.chats.unshift(mensaje);
                                }
                                return this.chats;
                              })
            )     
                            
  }
  
  cargarUsers(){
    
    return this.users1 = this.itemsUsers1.snapshotChanges()
    .pipe(map( changes =>{
        return changes.map( action =>{
          const data  = action.payload.doc.data() as User;
          //extraer el id del registro
          data.uid = action.payload.doc.id;
          //--------------------------------
          return data
        
        });
    }))
     
       
  }
  agregarMensajes(texto:string,usuarionombre:string){
      let datamensaje: Mensaje = {
        nombre:usuarionombre,
        url:'',
        mensaje:texto,
        fecha:new Date().getTime(),

      }

      return this.itemsCollection.add(datamensaje);

  };
  agregarUsuario(email:any){
      let datauser: User = {
        email:email,
        fecha:new Date().getTime()
      }
      console.log(datauser)

      this.db.collection("users").add(datauser)
      //return this.itemsUsers.add(datauser);
  }
}
