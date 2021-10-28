import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { environment } from '../../environments/environment';
import { IObjeto } from '../interfaces/IObjeto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ObjetoService {
  page=0;
  constructor(private usuarioS: UsuarioService, private htttp: HttpClient,
              // tslint:disable-next-line: deprecation
              private fileT: FileTransfer) { }

  async crearObjeto(objeto: IObjeto): Promise<any> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( (resolve) => {
      this.htttp.post(`${URL}/objeto`,objeto, {headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(resp);
        } else {
          resolve(resp || {ok: false});
        }
      });
    });
  }
  async obtenerMisObjetos(recargar?: boolean): Promise<IObjeto[]> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    if ( recargar ) {
      this.page = 0;
    }
    this.page++;
    return new Promise( (resolve) => {
      this.htttp.get(`${URL}/objeto?page=${this.page}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          if(resp.objetos.length === 0) {
            this.page--;
          }
          return resolve(resp.objetos);
        } else {
          return resolve([]);
        }
      });
    });
  }
  async eliminarObjeto(id: string) {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( (resolve) => {
      this.htttp.delete(`${URL}/objeto/eliminar/${id}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }
  async actualizarObjeto( objeto: IObjeto ) {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( (resolve) => {
      this.htttp.put(`${URL}/objeto/${objeto._id}`, objeto,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }
  subirImagenObjeto(objetoID: string, image: any) {
    return new Promise( async (resolve) => {
      const options: FileUploadOptions = {
        fileKey: 'image',
        headers: {
          'x-token': await this.usuarioS.getToken()
        },
      };
      const fileT: FileTransferObject = this.fileT.create();
      fileT.upload(image, `${URL}/objeto/imagen?id=${objetoID}`, options)
           .then( data  => {
             resolve(true);
           }).catch(err => {
            resolve(false);
          });
    });
  }
  async eliminarImagenObjeto(objetoID: string, image: string) {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( (resolve) => {
      this.htttp.post(`${URL}/objeto/imagen/eliminar`, {id: objetoID, image},{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }
}
