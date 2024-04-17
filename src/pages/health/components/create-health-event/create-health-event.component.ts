import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormatRepeatInterval } from 'src/Pipes/FormatRepeatInterval.pipe';
import { CatService } from 'src/services/cat.service';
import { ICat } from 'src/model/Cat.model';
import { User } from 'src/model/User.model';
import { HealthEvent, IHealthEvent, ReapeatInterval } from 'src/model/healthEvent.model';
import { convertFromDate } from 'src/util/date';
import { ConfirmationModalComponent } from 'src/components/confirmation-modal/confirmation-modal.component';
import { HealthEventService } from 'src/services/healthEvent.service';

@Component({
  selector: 'create-health-event',
  templateUrl: './create-health-event.component.html',
  styleUrls: ['./create-health-event.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormatRepeatInterval],
  standalone: true
})
export class CreateHealthEventComponent {
  repeatIntervalValues = (Object.values(ReapeatInterval) as ReapeatInterval[]).filter(o => !isNaN(o));
  isNew = true;

  @Output()
  delete = new EventEmitter<void>();

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    date: [new Date, [Validators.required]],
    repeatInterval: ReapeatInterval.NO_REPEAT,
    cats: [[] as ICat[]]
  });

  cats?: ICat[];

  constructor(
    protected fb: FormBuilder,
    private catService: CatService,
    private eventService: HealthEventService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit():void {
    this.catService.get().subscribe(cats => {
      this.cats = cats.body as ICat[];
    })
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

  onSubmit(): void {
    const healthEvent = new HealthEvent();
    healthEvent.createFromForm(this.editForm);
    this.activeModal.close(healthEvent);
  }

  onDelete(): void {
    const ref = this.modalService.open(ConfirmationModalComponent, {centered: true});
    ref.componentInstance.text = "Você tem certeza que deseja excluir este evento?";
    ref.closed.subscribe(() => {
      this.delete.emit();
      this.activeModal.dismiss();
    })
  }

  dismiss(): void {
    this.activeModal.dismiss();
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

  pushCat(cat: ICat): void {
    const cats = this.formCats;
    cats.push(cat);
    this.editForm.patchValue({cats});
  }

  removeCat(id: number): void {
    const cats = this.formCats;
    this.editForm.patchValue({
      cats: cats.filter(cat => cat.id !== id)
    });
  }

  firstTimeLoadCats(cats: ICat[]): void {
      for(const cat of cats) {
        this.firstTimeLoadCat(cat);
      }
  }

  firstTimeLoadDate(): void {
    const input = <HTMLInputElement> document.querySelector('#date');
    const date = this.editForm.get('date')?.value ?? new Date();
    input.value = convertFromDate(date);
  }

  firstTimeLoadCat(cat: ICat): void {
    const input = <HTMLInputElement> document.querySelector(`#i${cat.id}`);
    if(!input){
      setTimeout(() => this.firstTimeLoadCat(cat), 100);
    } else {
      input.checked = true;
    }
  }
}
