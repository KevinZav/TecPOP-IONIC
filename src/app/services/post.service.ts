import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { UsuarioService } from './usuario.service';
import { environment } from '../../environments/environment';
import { IPost } from '../interfaces/IPost';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class PostService {
  page = 0;
  mipage=0;
  constructor(private http: HttpClient, private nav: NavController, private usuarioS: UsuarioService) { }

  async obtenerPosts(recargar?: boolean):Promise<IPost[]> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    if(recargar) {
      this.page = 0;
    }
    this.page++;
    return new Promise( async (resolve) => {
      this.http.get(`${URL}/posts?page=${this.page}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          if(resp.posts.length === 0) {
            this.page--;
          }
          resolve(resp.posts);
        } else {
          resolve([]);
        }
      });
    })
  }
  async obtenerPostsUsuario(recargar?: boolean):Promise<IPost[]> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    if(recargar) {
      this.mipage = 0;
    }
    this.mipage++;
    return new Promise( async (resolve) => {
      this.http.get(`${URL}/posts/usuario?page=${this.mipage}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          if(resp.posts.length === 0) {
            this.mipage--;
          }
          resolve(resp.posts);
        } else {
          resolve([]);
        }
      });
    })
  }
  async crearPost( post: any ): Promise<boolean> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise((resolve) => {
      this.http.post(`${URL}/post`,post, {headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
  async eliminarPost(id: string): Promise<boolean> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.delete(`${URL}/post/${id}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    })
  }
  async modificarPost( post: any ): Promise<boolean> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise((resolve) => {
      this.http.put(`${URL}/post/${post._id}`,post, {headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
  async reaccionarPost(id: string): Promise<boolean> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.get(`${URL}/post/reaccionar/${id}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }
  async obtenerPostID(id: string): Promise<IPost> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.get(`${URL}/post/${id}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(resp.post);
        } else {
          resolve(null);
        }
      })
    })
  }
  async comentarPost( post, texto ): Promise<boolean> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.post(`${URL}/comentario`,{post,texto},{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    })
  }
  async mostrarComentariosPost( id: string ): Promise<any> {
    const headers = new HttpHeaders({
      'x-token': await this.usuarioS.getToken()
    });
    return new Promise( resolve => {
      this.http.get(`${URL}/comentario/${id}`,{headers}).subscribe( (resp: any) => {
        if(resp.ok) {
          resolve(resp.comentarios);
        } else {
          resolve([]);
        }
      })
    })
  }
}
