import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateCatComponent } from 'src/components/create-cat/create-cat.component';
import { CatService } from 'src/services/cat.service';
import { ICat } from 'src/model/Cat.model';
import { IPlan } from 'src/model/Plan.model';
import { PlanService } from 'src/services/plan.service';

@Component({
  selector: 'cats-page',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css'],
  standalone: true,
  imports: [CommonModule, NgbModule],
  animations: [
    trigger('cardsAnimation', [
      state('left', style({transform: 'translateX(0)'})),
      state('right', style({transform: 'translateX(0)'})),
      transition('void => right', [
        style({transform: 'translateX(100%)'}),
        animate(300)
      ]),
      transition('void => left', [
        style({transform: 'translateX(-100%)'}),
        animate(300)
      ])
    ])
  ]
})
export class CatsPageComponent implements OnInit {
  pets: ICat[] = [];
  plans: IPlan[] = [];

  direction = 'right';
  private _currentCard = 0;
  private _id = '';

  constructor(
    private catService: CatService,
    private planService: PlanService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
  }

  onNextCard(): void {
    this.currentCard++;
  }

  onPreviousCard(): void {
    this.currentCard--;
  }

  openModal(cat?: ICat): void {
    const ref = this.modalService.open(CreateCatComponent, {centered: true});
    if(cat) {
      ref.componentInstance.isNew = false;
      ref.componentInstance.editForm.patchValue({
        name: cat.nome,
        birthday: cat.aniversario
      });
      ref.componentInstance.loadDate(cat.aniversario);
      ref.componentInstance.loadGender(cat.sexo);
      ref.closed.subscribe((_cat: ICat) => {
        _cat.id = cat.id;
        this.catService.put(_cat).subscribe(() => this.load());
      });
      ref.componentInstance.delete.subscribe(() => {
        this.catService.delete(cat).subscribe(() => this.load());
      })
      return;
    }
    ref.closed.subscribe((cat: ICat) => {
      this.catService.post(cat).subscribe(res => {
        if(res.ok){
          this.load();
        }
      });
    })
  }

  set currentCard(i: number) {
    if(i < 0 || i > this.pets.length - 1) {
      return;
    }
    this.direction = i < this._currentCard ? 'left' : 'right';
    this._currentCard = i;
  }

  get currentCard(): number {
    return this._currentCard;
  }

  get hasCats(): boolean {
    return this.pets.length !== 0;
  }

  getOtherPlans(cat: ICat): IPlan[] {
    if(!this.plans) {
       throw new Error();
    }
    return this.plans.filter(plan => plan.id !== cat.planoAlimentar?.id);
  }

  getCatAge(cat: ICat): string {
    if(!cat.aniversario){
      return '';
    }
    const today = new Date();
    const birthday = new Date(cat.aniversario);
    const dif = today.getTime() - birthday.getTime();
    const yearDif = Math.floor(dif / (1000 * 60 * 60 * 24 * 365))
    return `${yearDif} anos`;
  }

  setPlan(plan: IPlan, cat: ICat): void {
    if(!plan.gatos) {
      throw new Error('plan.gatos is undefined');
    }
    const _cat = plan.gatos.find(_cat => cat.id === _cat.id);
    if(!_cat){
      plan.gatos.push(cat);
      this.planService.put(plan).subscribe(res => {
        cat.planoAlimentar = res;
      });
    }
  }

  private load(): void {
    this.catService.get().subscribe(res => {
      this.pets = res.body as ICat[];
    });
    this.planService.fetch().subscribe(res => {
      this.plans = <IPlan[]> res;
    })
  }
}