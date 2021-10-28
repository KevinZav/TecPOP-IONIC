import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Pipe({
  name: 'domSanitizer'
})
export class DomSanitizerPipe implements PipeTransform {
  constructor(private domSani: DomSanitizer) {}
  transform(img: string, source?: string, objetoID?: string): unknown {
    if ( img === '') {
      return this.domSani.bypassSecurityTrustStyle(`background-image: url('./assets/img/sinAvatar.jpg');`);
    }  else if (source==='local') {
      return this.domSani.bypassSecurityTrustStyle(`background-image: url(${img});`);
    } else if(source === 'objeto') {
      return this.domSani.bypassSecurityTrustStyle(`background-image: url(${URL}/objeto/imagen/${objetoID}/${img});`);
    } else if (source ==='imgAvatar') {
      return this.domSani.bypassSecurityTrustUrl(`${URL}/usuario/avatar/${img}`);
    }
    else {
      return this.domSani.bypassSecurityTrustStyle(`background-image: url(${URL}/usuario/avatar/${img});`);
    }
  }

}
