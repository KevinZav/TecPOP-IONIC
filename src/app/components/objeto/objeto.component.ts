import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IObjeto } from '../../interfaces/IObjeto';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, IonSlides, ModalController } from '@ionic/angular';
import { ObjetoService } from '../../services/objeto.service';
import { MensajesService } from '../../services/mensajes.service';

declare const window: any;

@Component({
  selector: 'app-objeto',
  templateUrl: './objeto.component.html',
  styleUrls: ['./objeto.component.scss'],
})
export class ObjetoComponent implements OnInit {
  @ViewChild('slidePrincipal', {static: true}) slides: IonSlides;
  @Input() objeto: IObjeto;
  @Input() accion;
  fotos = [];
  slideSoloOpts = {
    allowSlideNext: false,
    allowSlidePrev: false
  };
  verBotones = false;
  constructor(private camera: Camera, private actionSC: ActionSheetController,
              private modalCtrl: ModalController, private objetoS: ObjetoService,
              private mensajeS: MensajesService) { }

  ngOnInit() {
    if(this.accion!=='nuevo' && this.objeto.fotos && this.objeto.fotos.length > 0) {
      this.objeto.fotos.forEach((foto,index) => {
        this.fotos.push({
          img: foto,
          tipo: 'objeto',
          accion:'',
          index
        });
      });
    }
  }
  async nuevaImagen() {
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
    const actionSheet = await this.actionSC.create({
      animated: true,
      buttons
    });
    await actionSheet.present();
  }
  getFotosFiltradas(): any[] {
    return this.fotos.filter(foto => foto.accion !=='eliminar');
  }
  eliminarImagen(index: any){
    console.log(index);
    if(this.fotos[index].tipo === 'objeto') {
      this.fotos[index].accion = 'eliminar';
    } else {
      this.fotos.splice(index,1);
    }
  }
  accionObjeto() {
    if(this.accion==='nuevo') {
      this.agregar();
    } else {
      this.modificar();
    }
  }
  async agregar() {
    const objetoCreado = await this.objetoS.crearObjeto(this.objeto);
    console.log(objetoCreado);
    if(objetoCreado.ok) {
      if(this.fotos.length > 0 ) {
        this.fotos.forEach( async (foto) => {
          await this.objetoS.subirImagenObjeto(objetoCreado.objeto._id,foto.imageData);
        });
      }
      this.mensajeS.mensajeToast('¡El objeto ha sido creado correctamente!','primary');
      this.salir();
    }
  }
  async modificar() {
    const objetoModificado = await this.objetoS.actualizarObjeto(this.objeto);
    if(objetoModificado) {
      this.fotos.forEach( async (foto) => {
        if(foto.accion==='eliminar') {
          await this.objetoS.eliminarImagenObjeto(this.objeto._id,foto.img);
        } else if(foto.tipo==='local') {
          await this.objetoS.subirImagenObjeto(this.objeto._id,foto.imageData);
        }
      });
      this.mensajeS.mensajeToast('¡Objeto modificado con exito!', 'primary');
      this.salir();
    }
  }
  salir() {
    this.modalCtrl.dismiss();
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
      this.fotos.unshift({
        img,
        imageData,
        tipo: 'local',
        accion: ''
      });
    }, (err) => {
      // Handle error
    });
  }

}
