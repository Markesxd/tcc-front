import { FormGroup } from "@angular/forms";
import { ICat } from "./Cat.model";
import { IUser } from "./User.model";

export interface IPlan {
    id?: number;
    nome?: string;
    usuario?: IUser;
    refeicoes?: IMeal[];
    gatos?: ICat[];
}

export class Plan implements IPlan {
    id?: number;
    nome?: string;
    usuario?: IUser;
    refeicoes?: IMeal[];
    gatos?: ICat[];

    public createFromForm(formGroup: FormGroup): void {
        this.nome = formGroup.get("name")?.value ?? "";
        this.refeicoes = deserializeMeals(formGroup.get("meals")?.value ?? []);
        this.gatos = formGroup.get("cats")?.value ?? [];
    }
}

export interface IMeal {
    id?: number;
    nome?: string;
    foiServida?: boolean;
    planoAlimentar?: IPlan;
}

export class Meal implements IMeal {
    id?: number;
    nome?: string;
    foiServida?: boolean;
    planoAlimentar?: IPlan;
}

function deserializeMeals(meals: string[]): IMeal[] {
    return meals.map(label => {
        const meal = new Meal();
        meal.nome = label;
        return meal;
    });
}