import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../interfaces/IUsuario';
import { ModalController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { UsuarioComponent } from '../../components/usuario/usuario.component';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(private usuarioS: UsuarioService, private modalCtrl: ModalController,
              private postS: PostService) { }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild( IonContent, { static: false } ) content: IonContent;
  usuario: IUsuario;
  posts = [];
  async ngOnInit() {
    this.usuario = await this.usuarioS.getUsuario();
    this.cargarMisPosts(true);
  }
  async actualizar() {
    const modal = await this.modalCtrl.create({
      component: UsuarioComponent,
      mode:'ios',
      animated: true,
      swipeToClose: true,
      componentProps: {
        usuario: this.usuario,
        accion: 'modificar'
      }
    });
    return await modal.present();
  }
  async cargarMisPosts(refresh: boolean) {
    if(refresh) {
      this.posts = await this.postS.obtenerPostsUsuario(true);
    } else {
      this.posts.push(await this.postS.obtenerPostsUsuario());
    }
  }
  ionViewWillEnter() {
    this.content.scrollToTop();
    this.cargarMisPosts(true);
    this.infiniteScroll.disabled = false;
  }
  async loadData(event: any) {
    const nuevosPosts = await this.postS.obtenerPostsUsuario();
    this.posts.push(...nuevosPosts);
    if(nuevosPosts.length<5) {
      this.toggleInfiniteScroll();
    }
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  eliminarPost(i: number) {
    console.log(i);
    this.posts.splice(i,1);
  }
  async logout() {
    await this.usuarioS.logout();
  }

}
