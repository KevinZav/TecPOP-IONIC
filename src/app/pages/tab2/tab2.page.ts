import { Component, OnInit, ViewChild } from '@angular/core';
import { ObjetoService } from '../../services/objeto.service';
import { ModalController, ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { ObjetoComponent } from '../../components/objeto/objeto.component';
import { MensajesService } from '../../services/mensajes.service';
import { IObjeto } from '../../interfaces/IObjeto';
import { PostComponent } from '../../components/post/post.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild( IonContent, { static: false } ) content: IonContent;
  objetos = [];
  constructor(private objetoS: ObjetoService, private modalCtrl: ModalController,
              private mensaje: MensajesService, private actionSC: ActionSheetController) {}

  async ngOnInit() {
    await this.recargarObjetos();
  }
  async ionViewWillEnter() {
    this.content.scrollToTop();
  }
  async nuevo() {
    const modal = await this.modalCtrl.create({
      component: ObjetoComponent,
      mode:'ios',
      animated: true,
      swipeToClose: true,
      componentProps: {
        objeto: {nombre:'', descripcion:'', estado: 'Activo'},
        accion: 'nuevo'
      }
    });
    await modal.present();
    await modal.onDidDismiss().then( async (res) => {
      await this.recargarObjetos();
    });
  }

  async eliminar(id: string, index) {
    const buttons = [{
      text: 'Si',
      cssClass: 'action-dark',
      icon: 'checkmark',
      handler: () => {
        this.objetoS.eliminarObjeto(id).then( resp => {
          if(resp) {
            this.objetos.splice(index,1);
            this.mensaje.mensajeToast('El objeto ha sido eliminado correctamente');
          }
        });
      }
    },{
      text: 'No',
      cssClass: 'action-dark',
      icon: 'close',
      role: 'cancel',
      handler: () => {
      }
    }];
    const actionSheet = await this.actionSC.create({
      header:'¿Eliminar el objeto?',
      animated: true,
      buttons
    });
    await actionSheet.present();
  }
  async modificar(index: number) {
    const modal = await this.modalCtrl.create({
      component: ObjetoComponent,
      mode:'ios',
      animated: true,
      swipeToClose: true,
      componentProps: {
        objeto: this.objetos[index],
        accion: 'modificar'
      }
    });
    await modal.present();
    await modal.onDidDismiss().then( async (res) => {
      await this.recargarObjetos();
    });
  }
  async post( objeto: IObjeto) {
    const modal = await this.modalCtrl.create({
      component: PostComponent,
      mode:'ios',
      animated: true,
      swipeToClose: true,
      componentProps: {
        accion: 'nuevo',
        objeto
      }
    });
    await modal.present();
    await modal.onDidDismiss().then( async (res) => {
      await this.recargarObjetos();
    });
  }

  loadData(event) {
    this.obtenerObjetos(event);
  }
  async obtenerObjetos(event?:any) {
    const nuevosObjetos = await this.objetoS.obtenerMisObjetos();
    this.objetos.push(...nuevosObjetos);
    if(nuevosObjetos.length === 0 && event ) {
      this.ToggleInfiniteScroll(true);
      return;
    } else if( nuevosObjetos.length > 0 && event ) {
      this.ToggleInfiniteScroll(false);
    }
    if( event ) {
      event.target.complete();
    }
  }
  async recargarObjetos() {
    if(this.infiniteScroll) {
      this.ToggleInfiniteScroll(false);
    }
    this.objetos = await this.objetoS.obtenerMisObjetos(true);
  }
  ToggleInfiniteScroll(estado: boolean) {
    this.infiniteScroll.disabled = estado;
  }
}
