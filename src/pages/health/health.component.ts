import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateHealthEventComponent } from './components/create-health-event/create-health-event.component';
import { IHealthEvent } from 'src/model/healthEvent.model';
import { HealthEventService } from 'src/services/healthEvent.service';
import { UserService } from 'src/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { FormatDate } from 'src/Pipes/FormatDate.pipe';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { convertFromDate } from 'src/util/date';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, CreateHealthEventComponent, FormatDate],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent {
  showModal = false;
  events?: IHealthEvent[];

  constructor(
    private healthEventService: HealthEventService,
    private cookieService: CookieService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openModal(event?: IHealthEvent): void {
    const ref = this.modalService.open(CreateHealthEventComponent, {centered: true});
    if(event) {
      const data = new Date(event.data??'');
      ref.componentInstance.isNew = false;
      ref.componentInstance.editForm.patchValue({
        name: event.nome,
        date: data,
        repeatInterval: event.intervaloDeRepeticao
      });
      ref.componentInstance.firstTimeLoadCats(event.gatos);
      setTimeout(()=> {
        ref.componentInstance.firstTimeLoadDate();
      }, 200);
      ref.componentInstance.delete.subscribe(() => this.deleteEvent(event));
    }
    ref.closed.subscribe((_event: IHealthEvent) => {
      if(event !== undefined){
        _event.id = event.id;
        this.healthEventService.put(_event).subscribe(() => {
          this.events = this.events?.filter(evt => evt.id !== event.id);
          this.events?.push(_event);
        });
      } else {
        this.healthEventService.post(_event).subscribe((res) => {
          this.events?.push(res);
        });
      }
    });
  }

  deleteEvent(event: IHealthEvent) {
    if(!event.id) {
      throw new Error('Evento sem id');
    }
    this.healthEventService.delete(event.id).subscribe(() => {
      this. events = this.events?.filter(evt => evt !== event);
    });
  }

  private load(): void {
    this.healthEventService.fetch().subscribe(res => {
      this.events = res as IHealthEvent[];
    })
  }
}
