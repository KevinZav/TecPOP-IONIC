import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { ObjetoComponent } from './objeto/objeto.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PostComponent } from './post/post.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    UsuarioComponent,
    ObjetoComponent,
    PostCardComponent,
    PostComponent,
    ComentariosComponent,
    ChatComponent
  ],
  exports: [
    UsuarioComponent,
    ObjetoComponent,
    PostCardComponent,
    PostComponent,
    ComentariosComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class ComponentsModule { }
