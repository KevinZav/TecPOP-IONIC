import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { IUsuario } from '../../interfaces/IUsuario';
import { UsuarioService } from '../../services/usuario.service';
import { MensajesService } from '../../services/mensajes.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare const window: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {

  constructor( private actionCtrl: ActionSheetController, private modalCtrl: ModalController,
               private usuarioS: UsuarioService, private mensajeS: MensajesService,
               private navCtrl: NavController, private camera: Camera) { }
  verPassword= false;
  modificarPassword = true;
  cambioAvatar=false;
  avatarNuevo = '';
  imagenDeAvatar = '';
  @Input() usuario: IUsuario;
  @Input() accion: string;
  ngOnInit() {
    this.imagenDeAvatar = this.usuario.avatar || '';
    if(this.accion!=='nuevo') {
      this.modificarPassword = false;
    }
  }
  async cambiarImagen() {
    const buttons = [{
      text: 'Galeria',
      cssClass: 'action-dark',
      icon: 'image',
      handler: () => {
        this.galeria();
      }
    }, {
      text: 'Camara',
      cssClass: 'action-dark',
      icon: 'camera',
      handler: () => {
        this.camara();
      }
    },{
      text: 'Cancelar',
      cssClass: 'action-dark',
      icon: 'close',
      role: 'cancel',
      handler: () => {
      }
    }];
    if(this.cambioAvatar) {
      buttons.unshift({
        text: 'Quitar avatar',
        cssClass: 'action-dark quitar-avatar',
        icon: 'trash-bin',
        handler: () => {
          this.cambioAvatar= false;
          this.imagenDeAvatar = this.usuario.avatar || '';
        }
      });
    }
    const actionSheet = await this.actionCtrl.create({
      animated: true,
      buttons
    });
    await actionSheet.present();
  }
  salir() {
    this.modalCtrl.dismiss();
  }
  accionUsuario() {
    if(this.accion==='nuevo') {
      this.nuevoUsuario();
    }else {
      this.actualizar();
    }
  }
  async nuevoUsuario() {
    const registroValido: any = await this.usuarioS.registro(this.usuario);
    console.log(registroValido);
    if (registroValido.ok) {
      this.mensajeS.mensajeToast('¡Usuario creado con exito!');
      if(this.cambioAvatar) {
        await this.usuarioS.cambiarAvatar(this.avatarNuevo);
      }
      this.salir();
    } else {
      this.mensajeS.mensajeToast('No se ha podido crear el usuario, intente de nuevo');
    }
  }
  clickEnablePassword() {
    this.modificarPassword = !this.modificarPassword;
    if (!this.modificarPassword) {
      this.usuario.password = '';
    }
  }
  async actualizar() {
    if(this.usuario.password==='') {
      delete this.usuario.password;
    }
    const usuarioActualizado = await this.usuarioS.actualizar(this.usuario);
    if(usuarioActualizado) {
      if(this.cambioAvatar) {
        await this.usuarioS.cambiarAvatar(this.avatarNuevo);
      }
      this.mensajeS.mensajeToast('¡Usuario actualizado con éxito!');
        setTimeout( () => {
          this.salir();
        },1000);
    } else {
      this.mensajeS.mensajeToast('No se actualizó el usuario, intente nuevamente','danger');
    }
  }

  camara() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.procesarImagen(options);
  }
  galeria() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.procesarImagen(options);
  }
  procesarImagen(options) {
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
     //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      const img = window.Ionic.WebView.convertFileSrc( imageData );
      this.imagenDeAvatar = img;
      this.cambioAvatar = true;
      this.avatarNuevo = imageData;
    }, (err) => {
      // Handle error
    });
  }
}
