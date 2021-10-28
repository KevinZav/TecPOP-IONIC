import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor( private usuarioS: UsuarioService, private http: HttpClient ) { }

  async crearChat(id: string): Promise<any> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.post(`${URL}/chat/${id}`,{},{headers}).subscribe( (resp: any) =>  {
        console.log(resp);
        if(resp.ok) {
          resolve(resp);
        } else {
          resolve(resp);
        }
      });
    });
  }
  async obtenerChatsUsuario(): Promise<any[]> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.get(`${URL}/chat`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(resp.chats);
        } else {
          resolve([]);
        }
      })
    })
  }
  async obtenerMensajesChat(chatID: string): Promise<any> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.get(`${URL}/mensaje/${chatID}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(resp.mensajes);
        } else {
          resolve([]);
        }
      });
    })
  }
  async enviarmensaje(mensaje: any): Promise<any> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.post(`${URL}/mensaje`,mensaje,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }

}
