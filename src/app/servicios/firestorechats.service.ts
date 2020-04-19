import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
//import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interfaces/mensaje.interface'

@Injectable()

export class FirestorechatsService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  //public chats: Observable<any[]>;
  public chats: Mensaje[] = []; 

  constructor(private afs: AngularFirestore) { }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                                           .limit(8) );

    //retorna cambios en colecciones
    return this.itemsCollection.valueChanges().pipe(
                             map( (mensajes:Mensaje[]) =>{
                                console.log(mensajes)
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
  agregarMensajes(texto:string,usuarionombre:string){
      let datamensaje: Mensaje = {
        nombre:usuarionombre,
        mensaje:texto,
        fecha:new Date().getTime()
      }

      return this.itemsCollection.add(datamensaje);

  }
}
