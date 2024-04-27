import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbModal, NgbModule, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
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
  imports: [CommonModule, NgbModule, NgbCarousel],
})
export class CatsPageComponent implements OnInit {
  @ViewChild('carousel') carousel!: NgbCarousel;

  pets: ICat[] = [];
  plans: IPlan[] = [];

  private touchStartX: number | null = null;
  private _currentCard = 0;

  constructor(
    private catService: CatService,
    private planService: PlanService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
  }
  
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    if(this.touchStartX === null) {
      return;
    }
    const delta = event.changedTouches[0].clientX - this.touchStartX
    if(Math.abs(delta) < 10) {
      return;
    }
    
    delta < 0 
    ? this.onNextCard()
    : this.onPreviousCard();
  }

  onNextCard(): void {
    this.currentCard++;
    this.carousel.next();
  }

  onPreviousCard(): void {
    this.currentCard--;
    this.carousel.prev();
  }

  updateBubble(event: NgbSlideEvent): void {
    this.currentCard = Number(event.current.split('-')[2]);
  }

  openModal(cat?: ICat): void {
    const ref = this.modalService.open(CreateCatComponent);
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
      this.currentCard = 0;
    });
    this.planService.fetch().subscribe(res => {
      this.plans = <IPlan[]> res;
    })
  }
}