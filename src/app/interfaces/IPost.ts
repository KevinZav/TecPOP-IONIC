import { IObjeto } from './IObjeto';
import { IUsuario } from './IUsuario';

export interface IPost{
    _id?: string;
    created?: Date;
    mensaje: string;
    ubicacion?: string;
    objeto: IObjeto;
    usuario: IUsuario;
    reacciones?: string[];
}