import { IUser } from "./User.model";

export interface ISandbox {
    id?: number;
    nome: string;
    limpoEm: Date;
    usuario?: IUser
}