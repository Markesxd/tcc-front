import { FormGroup } from "@angular/forms";
import { IUser } from "./User.model";
import { IPlan } from "./Plan.model";

export interface ICat {
    id?: number;
    nome?: string;
    aniversario?: Date;
    sexo?: TypeSex;
    dono?: IUser;
    planoAlimentar?: IPlan;
}

export enum TypeSex {
    FEMALE,
    MALE,
}

export class Cat implements ICat {
    id?: number;
    nome?: string;
    aniversario?: Date;
    sexo?: TypeSex;
    dono?: IUser;
    planoAlimentar?: IPlan;
    
    public createFromForm(formGroup: FormGroup, owner: IUser): Cat {
        this.nome = formGroup.get('name')?.value;
        this.aniversario = formGroup.get('birthday')?.value;
        this.sexo = formGroup.get('gender')?.value;
        this.dono = owner;
        return this;
    }
}