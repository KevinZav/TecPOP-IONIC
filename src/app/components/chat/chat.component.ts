import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IUsuario } from '../../interfaces/IUsuario';
import { UsuarioService } from '../../services/usuario.service';
import { ChatService } from '../../services/chat.service';
import { MensajesService } from '../../services/mensajes.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() chat: any;
  whoami: IUsuario;
  mensajes = [];
  mensaje= '';
  @ViewChild( IonContent, { static: false } ) content: IonContent;
  constructor(private usuarioS: UsuarioService, private chatS: ChatService,
              private mensajeS: MensajesService) { }

  async ngOnInit() {
    this.whoami = await this.usuarioS.getUsuario();
    await this.obtenerMensajes();
    this.content.scrollToBottom();
  }
  async obtenerMensajes() {
    this.mensajes = await this.chatS.obtenerMensajesChat(this.chat._id);
  }
  async enviar() {
    this.content.scrollToBottom();
    const chat = {
      texto: this.mensaje,
      chat: this.chat._id
    }
    const mensajeEnviado = await this.chatS.enviarmensaje(chat);
    if(mensajeEnviado) {
      this.obtenerMensajes();
      this.mensaje = '';
    } else {
      this.mensajeS.mensajeToast('Ocurrió un error, intente más tarde','danger')
    }
  }

}
