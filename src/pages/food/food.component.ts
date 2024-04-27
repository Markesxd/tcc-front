import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePlanComponent } from './components/create-plan/create-plan.component';
import { IPlan, Meal } from 'src/model/Plan.model';
import { PlanService } from 'src/services/plan.service';
import { NgbCarousel, NgbCarouselModule, NgbModal, NgbModule, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, CreatePlanComponent, NgbModule, NgbCarouselModule],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  @ViewChild('carousel') carousel!: NgbCarousel;

  plans: IPlan[] = [];
  private _currentCard = 0;

  private touchStartX: number | null = null;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal
  ) {}

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
  
  updateBubble(event: NgbSlideEvent) {
    this.currentCard = Number(event.current.split('-')[2]);
  }

  ngOnInit(): void {
    this.load();
  }

  openModal(plan?: IPlan): void {
    const ref = this.modalService.open(CreatePlanComponent);
    if(plan) {
      ref.componentInstance.isNew = false;
      ref.componentInstance.editForm.patchValue({
        name: plan.nome,
        cats: plan.gatos
      });
      ref.componentInstance.checkOldCats(plan.gatos);
      plan.refeicoes?.forEach(meal => {
        ref.componentInstance.pushMeal(meal);
      });
      ref.closed.subscribe(_plan => {
        _plan.id = plan.id;
        return this.planService.put(_plan).subscribe(() => this.load());
      });
      ref.componentInstance.delete.subscribe(() => {
        this.planService.delete(plan).subscribe(() => {
          this.load();
        });
      });
      return;
    }
    ref.closed.subscribe(_plan => {
      this.planService.post(_plan).subscribe(() => this.load());
    });
  }

  deletePlan(plan: IPlan): void {
    this.planService.delete(plan).subscribe();
    this.load();
  }

  onPreviousCard(): void {
    this.currentCard--;
    this.carousel.prev();
  }

  onNextCard(): void {
    this.currentCard++;
    this.carousel.next();
  }

  onBubbleClick(): void {
    this.carousel.select("slide-ngb-slide-" + this.currentCard);
  }

  onServingMeal(event: any): void {
    const meal = new Meal();
    meal.id = Number(event.target.value);
    meal.foiServida = event.target?.checked
    this.planService.serve(meal).subscribe();
  }

  getGats(plan: IPlan): string {
    if(!plan.gatos || plan.gatos.length === 0) {
      return 'sem gatos';
    }
    return plan.gatos?.map(cat => cat.nome).join(', ');
  }

  get currentCard(): number {
    return this._currentCard;
  }

  set currentCard(i: number) {
    if(i < 0 || i > this.plans.length -1) {
      return;
    }
    this._currentCard = i;
  }

  private load(): void {
    this.planService.fetch().subscribe(plans => {
      this.plans = plans as IPlan[];
      this.currentCard = 0;
    });
  }
}
