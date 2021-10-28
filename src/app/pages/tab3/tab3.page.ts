import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../interfaces/IUsuario';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  chats = [];
  whoami: IUsuario;
  constructor( private chatS: ChatService, private usuarioS: UsuarioService,
               private modalCtrl: ModalController ) {}
  async ngOnInit() {
    this.whoami = await this.usuarioS.getUsuario();
    this.chats = await this.chatS.obtenerChatsUsuario();
  }
  async ionViewWillEnter() {
    this.chats = await this.chatS.obtenerChatsUsuario();
  }
  filtrarDatosChat(chat: any) {
    return {
      yo: (chat.usuario1._id === this.whoami._id)? chat.usuario1: chat.usuario2,
      destinatario: (chat.usuario1._id !== this.whoami._id)? chat.usuario1: chat.usuario2
    };
  }
  async mostrarMensajes(chat: any) {
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      mode:'ios',
      animated: true,
      swipeToClose: true,
      componentProps: {
        chat
      }
    });
    return await modal.present();
  }
}
