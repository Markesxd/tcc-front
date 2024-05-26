import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateHealthEventComponent } from './components/create-health-event/create-health-event.component';
import { IHealthEvent, ReapeatInterval } from 'src/model/healthEvent.model';
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
    const ref = this.modalService.open(CreateHealthEventComponent);
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
          this.load();
        });
      } else {
        this.healthEventService.post(_event).subscribe(() => {
          this.load();
        });
      }
    });
  }

  deleteEvent(event: IHealthEvent) {
    if(!event.id) {
      throw new Error('Evento sem id');
    }
    this.healthEventService.delete(event.id).subscribe(() => {
      this.load();
    });
  }

  private load(): void {
    this.healthEventService.fetch().subscribe(res => {
      this.events = this.futureEvents(res as IHealthEvent[]);
    })
  }

  private futureEvents(events: IHealthEvent[]): IHealthEvent[] {
    //@ts-ignore
    events.forEach(event => event.data = new Date(event.data));
    return events
      .filter((event) => this.filterEvents(event))
      .sort(this.dateSort);
  }

  private filterEvents(event: IHealthEvent): boolean {
    if(this.isEventOnFuture(event)) {
      return true;
    }

    //does the event have repetition?
    if(event.intervaloDeRepeticao !== ReapeatInterval.NO_REPEAT){
      while(!this.isEventOnFuture(event)) {
        this.incrementEventDate(event);
      }
      return true;
    }
    return false;
  }

  private isEventOnFuture(event: IHealthEvent): boolean {
    const today = new Date();
    if(!event.data) {
      return false;
    }

    if(today < event.data) {
      return true;
    }
    return false;
  }

  private incrementEventDate(event: IHealthEvent): void {
    if(!event.data) {
      return;
    }
    switch(event.intervaloDeRepeticao) {
      case ReapeatInterval.DAILY:
        event.data.setDate(event.data.getDate() + 1);
        return;
      case ReapeatInterval.WEEKLY:
        event.data.setDate(event.data.getDate() + 7);
        return;
      case ReapeatInterval.MONTHLY:
        event.data.setMonth(event.data.getMonth() + 1);
        return;
      case ReapeatInterval.YEARLY:
        event.data.setFullYear(event.data.getFullYear() + 1);    
    }
  }

  private dateSort(a: IHealthEvent, b: IHealthEvent) {
    if(a.data === undefined || b.data === undefined) {
      throw new Error("A date is undefined");
    }
    return a.data.getTime() - b.data.getTime();
  }
}
