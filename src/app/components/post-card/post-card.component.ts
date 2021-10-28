import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPost } from '../../interfaces/IPost';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../interfaces/IUsuario';
import { PostService } from '../../services/post.service';
import { MensajesService } from '../../services/mensajes.service';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { ModalController, ActionSheetController, NavController } from '@ionic/angular';
import { PostComponent } from '../post/post.component';
import { ChatService } from '../../services/chat.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() post: IPost;
  @Input() accion: string;
  @Input() index: number;
  @Output() eliminado = new EventEmitter<number>();
  @Output() postModificado = new EventEmitter<IPost>();
  comentario = '';
  comentarios = [];
  whoami: IUsuario;
  reaccion = false;
  constructor(private usuarioS: UsuarioService, private postS: PostService,
              private mensajeS:MensajesService, private modalCtrl: ModalController,
              private actionSC: ActionSheetController, private navCtrl: NavController,
              private chatS: ChatService) {}
  async ngOnInit() {
    this.whoami = await this.usuarioS.getUsuario();
    if(this.accion!=='produccion') {
      this.meGusta();
      this.cargarComentarios();
    }
  }

  async reaccionar() {
    if(this.accion!=='produccion') {
      const reaccionRealizada = await this.postS.reaccionarPost(this.post._id);
      if(!reaccionRealizada) {
        this.mensajeS.mensajeToast('No se ha podido reaccionar');
      } else {
        this.post = await this.postS.obtenerPostID(this.post._id);
        this.meGusta();
      }
    }
  }
  meGusta() {
    this.reaccion = this.post.reacciones.includes(this.whoami._id);
  }
  async cargarComentarios() {
    this.comentarios = await this.postS.mostrarComentariosPost(this.post._id);
  }
  async comentar() {
    if(this.accion!=='produccion') {
      const comentarioRealizado = await this.postS.comentarPost(this.post._id,this.comentario);
      if(comentarioRealizado) {
        this.comentario = '';
        this.post = await this.postS.obtenerPostID(this.post._id);
        this.cargarComentarios();
      } else {
        this.mensajeS.mensajeToast('No se ha podido comentar la publicación');
      }
    }
  }
  async opciones() {
    if(this.accion!=='produccion') {
      let buttons = [];
      if(this.post.usuario._id === this.whoami._id){
        buttons = [{
          text: 'Eliminar publicación',
          cssClass: 'action-dark',
          icon: 'trash',
          handler: async () => {
            this.eliminado.emit(this.index);
            const postEliminado = await this.postS.eliminarPost(this.post._id);
            if(postEliminado) {
              this.mensajeS.mensajeToast('La publicación ha sido eliminada correctamente','primary');
            } else {
              this.mensajeS.mensajeToast('Ocurrió un problema, intente más tarde', 'danger');
            }
          }
        }, {
          text: 'Modificar publicación',
          cssClass: 'action-dark',
          icon: 'pencil',
          handler: async () => {
            const modal = await this.modalCtrl.create({
              component: PostComponent,
              mode:'ios',
              animated: true,
              swipeToClose: true,
              componentProps: {
                accion: 'modificar',
                post: this.post
              }
            });
            await modal.present();
            await modal.onDidDismiss().then( async (res) => {
            });
          }
        },{
          text: 'Cancelar',
          cssClass: 'action-dark',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }];
      } else {
        buttons = [{
          text: `Contactar a ${this.post.usuario.nombre}`,
          cssClass: 'action-dark',
          icon: 'chatbubbles',
          handler: async () => {
            const chat = await this.chatS.crearChat(this.post.usuario._id);
            this.navCtrl.navigateRoot('/main/tabs/tab3');
            const modal = await this.modalCtrl.create({
              component: ChatComponent,
              mode:'ios',
              animated: true,
              swipeToClose: true,
              componentProps: {
                chat: chat.chat
              }
            });
            return await modal.present();
          }
        },{
          text: 'Cancelar',
          cssClass: 'action-dark',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }];
      }
      const actionSheet = await this.actionSC.create({
        animated: true,
        buttons
      });
      await actionSheet.present();
    }
  }
  async verComentarios() {
    if(this.accion!=='produccion') {

      const modal = await this.modalCtrl.create({
        component: ComentariosComponent,
        mode:'ios',
        animated: true,
        swipeToClose: true,
        componentProps: {
          post: this.post
        }
      });
      await modal.present();
      await modal.onDidDismiss().then( async (res) => {
        this.cargarComentarios();
      });
    }
  }

}
