import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../interfaces/IPost';
import { ModalController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { ComentariosComponent } from '../../components/comentarios/comentarios.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild( IonContent, { static: false } ) content: IonContent;
  posts: IPost[] = [];
  constructor( private postS: PostService ) {}
  async ngOnInit() {
    this.posts = await this.postS.obtenerPosts();
  }

  scrollTop() {
    this.content.scrollToTop();
    this.infiniteScroll.disabled = false;
  }
  async cargarPosts(event: any) {
    this.posts = await this.postS.obtenerPosts(true);
    this.infiniteScroll.disabled = false;
    event.target.complete();
  }
  async loadData(event: any) {
    const nuevosPosts = await this.postS.obtenerPosts();
    this.posts.push(...nuevosPosts);
    if(nuevosPosts.length<5) {
      console.log('hay mas posts');
      this.infiniteScroll.disabled =true;
    }
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  eliminarPost(index: number) {
    this.posts.splice(index,1);
  }
}
