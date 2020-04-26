import { Component, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import { AuthService } from '../../servicios/auth.service'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestorechatsService } from '../../servicios/firestorechats.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public usuario:string;
  public usuarios=[];
  constructor( private router: Router,
               private afAuth: AuthService,
               public db: AngularFirestore,
               public _cs: FirestorechatsService,
               private auth:AuthService,
              ) {
                this._cs.cargarUsers()
                  .subscribe(users=>{
                    console.log(users)
                    let eliminausers = users.filter(borraruser => borraruser.email == localStorage.getItem('email'));

                    this.usuarios=eliminausers
                    console.log(this.usuarios)

                  })

               }

    
  ngOnInit() {
    this.usuario = this.afAuth.leerEmail();
    if(!localStorage.getItem('token') || (!localStorage.getItem('email'))){
      this.auth.logout();
      this.router.navigateByUrl('/login')
      //this.router.navigateByUrl('/login')
    }
  }
  
  logout(){
    this.afAuth.logout();
    this.router.navigateByUrl('/login')
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

    this.afAuth.logout();
    this.router.navigateByUrl('/login')
  }

}
