import { Component, OnInit, Input } from '@angular/core';
import { IPost } from '../../interfaces/IPost';
import { PostService } from '../../services/post.service';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../interfaces/IUsuario';
import { MensajesService } from '../../services/mensajes.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit {
  @Input() post: IPost;
  comentarios = [];
  comentario = '';
  constructor( private postS: PostService, private usuarioS: UsuarioService,
               private mensajeS: MensajesService ) { }
  whoami: IUsuario;
  async ngOnInit() {
    this.obtenerComentarios();
    this.whoami = await this.usuarioS.getUsuario();
  }
  async obtenerComentarios() {
    this.comentarios = await this.postS.mostrarComentariosPost(this.post._id);
  }
  async comentar() {
    const comentarioRealizado = await this.postS.comentarPost(this.post._id,this.comentario);
      if(comentarioRealizado) {
        this.comentario = '';
        this.post = await this.postS.obtenerPostID(this.post._id);
        await this.obtenerComentarios();
      } else {
        this.mensajeS.mensajeToast('No se ha podido comentar la publicación');
      }
  }
}
