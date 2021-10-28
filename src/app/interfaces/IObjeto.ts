import { IUsuario } from './IUsuario';

export interface IObjeto{
    _id?: string;
    nombre: string;
    descripcion: string;
    usuario?: IUsuario;
    fotos?: string[];
    estado?: string;
}