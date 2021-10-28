import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IUsuario } from '../interfaces/IUsuario';
import { environment } from '../../environments/environment.prod';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  token: string = null;
  usuario: IUsuario;
  constructor( private http: HttpClient, private storage: Storage,
               // tslint:disable-next-line: deprecation
               private fileT: FileTransfer, private navCtrl: NavController  ) {}

  async login(user: any) {
    const userEnv = {
      userID: user.userID,
      password: user.password
    };
    return new Promise(resolve => {
      this.http.post(`${URL}/usuario/login`, userEnv).subscribe( async (resp: any) => {
        console.log(URL);
        if (resp.ok) {
          await this.guardarToken(resp.token);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  actualizar(usuario: IUsuario) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      });
      this.http.put(`${URL}/usuario`, usuario, {headers}).subscribe(async (resp: any) => {
        if (resp.ok) {
          await this.guardarToken(resp.token);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  registro(usuario: IUsuario ) {
    return new Promise(resolve => {
      this.http.post(`${URL}/usuario`, usuario).subscribe( (resp: any) => {
        if (resp.ok) {
          this.guardarToken(resp.token);
          resolve({ok: true});
        } else {
          let message = 'Error inesperado';
          if (resp.err.keyValue.userID) {
            message = 'El ID que intenta registrar ya existe';
          }
          this.storage.clear();
          resolve({ok: false, message});
        }
      });
    });
  }
  cambiarAvatar(image) {
    return new Promise( resolve => {
      const options: FileUploadOptions = {
        fileKey: 'image',
        headers: {
          'x-token': this.token
        }
      };
      const fileT: FileTransferObject = this.fileT.create();
      fileT.upload(image, `${URL}/usuario/avatar`, options)
           .then( data  => {
             resolve(true);
           }).catch(err => {
            resolve(false);
          });
    });
  }
  async guardarToken( token: string) {
    this.token = token;

    await this.storage.set('token', token);

    await this.validaToken();
  }
  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }
  async getToken() {
    await this.cargarToken();
    return this.token || '';
  }
  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    return new Promise((resolve) => {

      if (!this.token) {
        this.navCtrl.navigateRoot('/login');
        resolve(false);
      }
      const headers = new HttpHeaders({
        'x-token': this.token
      });
      this.http.get(`${URL}/usuario/info`, {headers}).subscribe( (resp: any) => {
        if (resp.ok) {
          this.usuario = resp.usuario;
          resolve(true);
        } else {
          this.storage.clear();
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });
    });

  }
  async logout() {
    this.token = null;
    this.usuario = null;
    await this.storage.clear();
    this.navCtrl.navigateRoot('/login');
  }
  async getUsuario() {
    if (!this.usuario) {
      await this.validaToken();
    }
    return {...this.usuario};
  }
}
