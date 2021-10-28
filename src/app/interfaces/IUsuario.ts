
export interface IUsuario {
    _id?: string;
    userID: string;
    nombre: string;
    apellidos: string;
    carrera: string;
    avatar?: string;
    status?: boolean;
    password?: string;
}
