import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private toast: ToastController, private alert: AlertController) { }
  async mensajeToast(message: string, color?: string, duration?: number) {
    const toast = await this.toast.create({
      mode: 'ios',
      message,
      duration: duration || 2000,
      color: color || 'dark'
    });
    toast.present();
  }

}
