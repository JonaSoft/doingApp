export class FileItem{
    public archivo : File;
    public nombreArchivo : string;
    public url : string;
    public email:string;
    public estado: boolean;
    public progreso : number;
    constructor( archivo : File ){
        this.archivo = archivo;
         this.nombreArchivo = archivo.name;
        this.estado = false;
        this.progreso = 0;
    }
}
