import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatService } from 'src/services/cat.service';
import { ICat } from 'src/model/Cat.model';
import { IMeal, IPlan, Meal, Plan } from 'src/model/Plan.model';
import { ConfirmationModalComponent } from 'src/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class CreatePlanComponent {
  @Input()
  isNew = true;

  @Output()
  delete = new EventEmitter<void>();

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    meals: [[] as IMeal[], [Validators.required]],
    meal: '',
    cats: [[] as ICat[]]
  })
  cats?: ICat[];

  constructor(
    protected fb: FormBuilder,
    private catService: CatService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit():void {
    this.catService.get().subscribe(cats => {
      this.cats = cats.body as ICat[];
    });
  }

  catchKeyPress(event: Event): void {
    event.preventDefault();
    this.addMeal();
  }

  addMeal(): void {
    const meal = new Meal(); 
    meal.nome = this.editForm.get('meal')?.value ?? undefined;
    if(!meal.nome) {
      return;
    }
    this.pushMeal(meal);
    this.editForm.patchValue({meal: ''});
  } 

  onDelete(): void {
    const ref = this.modalService.open(ConfirmationModalComponent, {centered: true});
    ref.componentInstance. text = "Você tem certeza que quer excluir este Plano Alimentar?";
    ref.closed.subscribe(() => {
      this.delete.emit();
      this.dismiss();
    });
  }

  onChangeCat(event: Event): void {
    const input = <HTMLInputElement | null> event.target;
    if(input === null){
      return;
    }
    const id = Number(input.value);
    const cat = this.getCatById(id);
    if(!cat) {
      return;
    }
    if(input.checked) {
      this.pushCat(cat);
    } else {
      this.removeCat(cat);
    }
  }

  onSubmit(): void {
    const plan = new Plan();
    plan.createFromForm(this.editForm);
    this.activeModal.close(plan);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  get meals(): IMeal[] {
    const meals = this.editForm.get('meals')?.value;
    if(!Array.isArray(meals)) {
      throw new Error("meals is not array!");
    }
    return meals;
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

  pushMeal(meal: IMeal): void {
    const meals = this.meals;
    meals.push(meal);
    this.editForm.patchValue({meals});
  }

  removeMeal(meal: IMeal){
    const meals = this.meals;
    this.editForm.patchValue({
      meals: meals.filter(_meal => _meal !== meal)
    });
  }

  pushCat(cat: ICat): void {
    const cats = this.formCats;
    cats.push(cat);
    this.editForm.patchValue({cats});
  }

  removeCat(cat: ICat): void {
    const cats = this.formCats;
    this.editForm.patchValue({
      cats: cats.filter(_cat => _cat.id !== cat.id)
    });
  }

  checkOldCats(cats: ICat[]): void {
    cats.forEach(cat => {
      this.checkOldcat(cat);
    });
  }

  private checkOldcat(cat: ICat): void {
    const input = <HTMLInputElement | null> document.querySelector(`#i${cat.id}`);
    if(!input) {
      setTimeout(() => this.checkOldcat(cat), 100);
      return;
    }
    input.checked = true;
  }
}
