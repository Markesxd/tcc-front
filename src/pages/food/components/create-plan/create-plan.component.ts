import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { CatService } from 'src/services/cat.service';
import { UserService } from 'src/services/user.service';
import { ICat } from 'src/model/Cat.model';
import { IMeal, IPlan, Plan } from 'src/model/Plan.model';
import { User } from 'src/model/User.model';

@Component({
  selector: 'create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class CreatePlanComponent {
  @Input()
  show = true;

  @Output()
  onClose = new EventEmitter<IPlan | undefined>();

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    meals: [[] as string[], [Validators.required]],
    meal: '',
    cats: [[] as ICat[]]
  })
  mealNextId = 0;
  cats?: ICat[];

  constructor(
    protected fb: FormBuilder,
    private cookieService: CookieService,
    private catService: CatService,
    private activeModal: NgbActiveModal
  ) {}

    ngOnInit():void {
      this.catService.get().subscribe(cats => {
        this.cats = cats.body as ICat[];
      })
    }

  close(plan?: IPlan): void {
    this.editForm.get('name')?.patchValue('');
    this.editForm.get('meals')?.patchValue([]);
    this.editForm.get('cats')?.patchValue([]);
    this.onClose.emit(plan);
  }

  catchKeyPress(event: Event): void {
    event.preventDefault();
    this.addMeal();
  }

  addMeal(): void {
    const meal = this.editForm.get('meal')?.value;
    if(!meal) {
      return;
    }
    this.pushMeal(meal);
    this.editForm.patchValue({meal: ''});
  } 

  onChangeCat(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input === null){
      return;
    }
    const id = Number(input.value);
    if(input.checked) {
      const cat = this.getCatById(id);
      if(!cat) {
        return;
      }
      this.pushCat(cat);
    } else {
      this.removeCat(id);
    }
  }

  onSubmit():void {
    const plan = new Plan;
    const user = new User;
    user.id = this.cookieService.get("id");
    plan.usuario = user;
    plan.createFromForm(this.editForm);
    this.activeModal.close(plan);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  get meals(): string[] {
    const meals = this.editForm.get('meals')?.value;
    if(!Array.isArray(meals)) {
      throw new Error("meals is not array!");
    }
    return meals
  }

  get formCats(): ICat[] {
    const cats = this.editForm.get('cats')?.value;
    if(!Array.isArray(cats)) {
      throw new Error("Cats is not an array!");
    }
    return cats;
  }

  getCatById(id: number): ICat | undefined {
    return this.cats?.find(cat => cat.id === id);
  }

  pushMeal(meal: string): void {
    const meals = this.meals;
    meals.push(meal);
    this.editForm.patchValue({meals});
  }

  removeMeal(id: number){
    const meals = this.meals;
    meals.splice(id, 1);
    this.editForm.patchValue({meals});
  }

  pushCat(cat: ICat): void {
    const cats = this.formCats;
    cats.push(cat);
    this.editForm.patchValue({cats});
  }

  removeCat(id: number): void {
    const cats = this.formCats;
    this.editForm.patchValue({
      cats: cats.filter(cat => cat.id !== id)
    })
  }
}
