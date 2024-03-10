import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CreatePlanComponent } from './components/create-plan/create-plan.component';
import { IPlan } from 'src/model/Plan.model';
import { PlanService } from 'src/services/plan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, CreatePlanComponent],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  plans: IPlan[] = [];
  private _currentCard = 0;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.planService.fetch().subscribe(plans => {
      this.plans = plans as IPlan[];
    })
  }

  openModal():void {
    const ref = this.modalService.open(CreatePlanComponent, {centered: true});
    ref.closed.subscribe(plan => {
      this.planService.post(plan).subscribe(() => {
        this.plans.push(plan);
      });
    });
  }

  onPreviousCard(): void {
    this.currentCard--;
  }

  onNextCard(): void {
    this.currentCard++;
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
}
