import { FormGroup } from "@angular/forms";
import { ICat } from "./Cat.model";
import { IUser } from "./User.model";

export interface IHealthEvent {
    id?: number;
    nome?: string;
    data?: Date;
    intervaloDeRepeticao?: ReapeatInterval
    usuario?: IUser;
    gatos?: ICat[];
}

export class HealthEvent implements IHealthEvent {
    id?: number;
    nome?: string;
    data?: Date;
    intervaloDeRepeticao?: ReapeatInterval;
    usuario?: IUser;
    gatos?: ICat[];

    createFromForm(formGroup: FormGroup): void {
        this.nome = formGroup.get('name')?.value;
        this.data = formGroup.get('date')?.value;
        this.gatos = formGroup.get('cats')?.value;
        this.intervaloDeRepeticao = Number(formGroup.get('repeatInterval')?.value);
    }
}

export enum ReapeatInterval {
    NO_REPEAT,
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY
}