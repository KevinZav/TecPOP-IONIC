import { Component, OnInit, Input } from '@angular/core';
import { IObjeto } from '../../interfaces/IObjeto';
import { IPost } from '../../interfaces/IPost';
import { PostService } from '../../services/post.service';
import { MensajesService } from '../../services/mensajes.service';
import { ModalController } from '@ionic/angular';
import { ObjetoService } from '../../services/objeto.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() accion: string;
  @Input() objeto: IObjeto;
  @Input() post:IPost;
  constructor( private postS: PostService, private mensajeS: MensajesService,
               private modalCtrl: ModalController, private objetoS: ObjetoService ) { }

  ngOnInit() {
    if(this.accion==='nuevo'){
      this.post = {
        created: new Date(),
        mensaje: '',
        objeto: this.objeto,
        usuario: this.objeto.usuario
      };
    }
  }
  async accionPublicacion() {
    if(this.accion==='nuevo') {
      await this.publicar();
    } else {
      await this.actualizar();
    }
  }
  async actualizar() {
    const post = {
      _id: this.post._id,
      mensaje: this.post.mensaje,
      created: this.post.created,
      objeto: this.post.objeto._id
    }
    await this.objetoS.actualizarObjeto(this.post.objeto);
    const postActualizado = await this.postS.modificarPost(post);
    if(postActualizado) {
      this.mensajeS.mensajeToast('¡Publicación modificada!','primary')
    } else {
      this.mensajeS.mensajeToast('Ocurrió un problema, intente más tarde')
    }
    this.salir();
  }
  async publicar() {
    const post = {
      mensaje: this.post.mensaje,
      created: this.post.created,
      objeto: this.post.objeto._id
    }
    await this.objetoS.actualizarObjeto(this.post.objeto);
    const postPublicado = await this.postS.crearPost(post);
    if(postPublicado) {
      this.mensajeS.mensajeToast('¡Publicación realizada!','primary')
    } else {
      this.mensajeS.mensajeToast('Ocurrió un problema, intente más tarde')
    }
    this.salir();
  }
  salir() {
    this.modalCtrl.dismiss();
  }
}
