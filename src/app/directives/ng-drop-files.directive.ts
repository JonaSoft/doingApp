import { Directive, EventEmitter, ElementRef,
         HostListener, Input, Output} from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = []
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }
  @HostListener('dragover', ['$event'])
  public onDragEnter(event:any){
    this.mouseSobre.emit( true );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event:any){
    this.mouseSobre.emit( false );
  }
  //soltar archivo sobre elemento.
  @HostListener('drop',['$event'])
  public onDrop(event:any){
     const transferencia = this._getTransferencia( event );
     if (!transferencia){
        return;
     }
     this._extraerArchivos( transferencia.files );
     this.prevenirDetener(event);
     this.mouseSobre.emit(false);
  }

  //para extender compatibilidad de navegadores
  private _getTransferencia( event: any ){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
 }

 private _extraerArchivos( archivosLista: FileList ){
  //console.log(archivosLista);
  for (const propiedad in Object.getOwnPropertyNames( archivosLista)){
     const archivoTemporal = archivosLista[propiedad];
     //console.log(archivoTemporal)
     if ( this.archivoListoCargar( archivoTemporal)){
        const nuevoArchivo = new FileItem( archivoTemporal );
        this.archivos.push(nuevoArchivo);
        
     }
  }
  console.log( this.archivos );
   
 }
  //validaciones
  private archivoListoCargar(archivo: File):boolean{
    /*if (!this.archivoDroppeado( archivo.name )){
       return true;
    }else{
       return false;
    }*/
    return true
 }

  private prevenirDetener(event){
    event.preventDefault();
    event.stopPropagation();
  }
  private archivoDroppeado(nombreArchivo:string): boolean{
    for( const archivo of this.archivos){
       if (archivo.nombreArchivo == nombreArchivo){
          console.log('el archivo '+nombreArchivo+' ya esta agregado');
          return true;
       }
    }
    return false;
 }

  //validar archivo tipo texto o imagen
  private _esImagen( tipoArchivo: string ): boolean {
    // retorna falso si el tipo de archivo es vacio o indefinido
    // 2da condicion evalua si es una imagen o texto
    return ( tipoArchivo ==='' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('text');
 }
}
