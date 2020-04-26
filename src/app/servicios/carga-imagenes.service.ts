import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {
  private CARPETA_IMAGENES= 'chats';
  public email:string;

  constructor(private db : AngularFirestore) { }

cargarImagenesFirebase(imagenes:FileItem[]){
  console.log(imagenes);

//console.log(imagenes);
this.email=localStorage.getItem('email') 
const storageRef=firebase.storage().ref();
//console.log('que email usará',this.email)

for (const item of imagenes){
   item.estado = true;
   if(item.progreso >=100){
      continue;
   }
   const uploadTask: firebase.storage.UploadTask=
            storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
                       .put( item.archivo);
   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
         (snapshot:firebase.storage.UploadTaskSnapshot ) =>
                   item.progreso =( snapshot.bytesTransferred/snapshot.totalBytes )*100,
         ( error ) => console.error('Error al subir', error),
          ()=>{
            console.log('Imagen cargada correctamente');
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
               item.url = downloadURL;
               item.estado = false;
               this.guardarImagen({
                 nombre: this.email,
                 url: item.url,
                 mensaje:'',
                 fecha:new Date().getTime()
               });
            });
          }  

      )                  
}

  

}
  private guardarImagen( imagen:{fecha:number,mensaje:string,nombre:string, url:string}){
    this.db.collection(`/${ this.CARPETA_IMAGENES}`)
            .add( imagen );
 }

}
