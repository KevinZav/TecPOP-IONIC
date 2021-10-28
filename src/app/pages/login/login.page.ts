import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UsuarioComponent } from '../../components/usuario/usuario.component';
import { UsuarioService } from '../../services/usuario.service';
import { MensajesService } from '../../services/mensajes.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: any = {
    userID: '',
    password: ''
  }
  verPassword=false;
  constructor( private modalCtrl: ModalController,
               private usuarioS: UsuarioService, private navCtrl: NavController, private mensajeS: MensajesService) { }

  ngOnInit() {
  }
  async nuevo() {
    const modal = await this.modalCtrl.create({
      component: UsuarioComponent,
      mode: 'ios',
      swipeToClose: true,
      animated: true,
      componentProps: {
        accion: 'nuevo',
        usuario: {userID:'',nombre:'',apellidos:'',carrera:''}
      }
    });
    return await modal.present();
  }
  async ingresar() {
      const loginValido = await this.usuarioS.login(this.usuario);
      if (loginValido) {
        this.navCtrl.navigateRoot('/main/tabs/tab4');
      } else {
        this.mensajeS.mensajeToast('Usuario o contraseña incorrectos', 'tecpop');
      }
  }
}
