import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormatRepeatInterval } from 'src/Pipes/FormatRepeatInterval.pipe';
import { CatService } from 'src/services/cat.service';
import { UserService } from 'src/services/user.service';
import { ICat } from 'src/model/Cat.model';
import { User } from 'src/model/User.model';
import { HealthEvent, IHealthEvent, ReapeatInterval } from 'src/model/healthEvent.model';

@Component({
  selector: 'create-health-event',
  templateUrl: './create-health-event.component.html',
  styleUrls: ['./create-health-event.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormatRepeatInterval],
  standalone: true
})
export class CreateHealthEventComponent {
  @Output()

  repeatIntervalValues = (Object.values(ReapeatInterval) as ReapeatInterval[]).filter(o => !isNaN(o));

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    date: [new Date, [Validators.required]],
    repeatInterval: ReapeatInterval.NO_REPEAT,
    cats: [[] as ICat[]]
  });

  cats?: ICat[];

  constructor(
    protected fb: FormBuilder,
    private cookieService: CookieService,
    private catService: CatService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit():void {
    const id = this.cookieService.get('id');
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
    const healthEvent = new HealthEvent;
    const user = new User;
    user.id = this.cookieService.get("id");
    healthEvent.usuario = user;
    healthEvent.createFromForm(this.editForm);
    this.activeModal.close(healthEvent);
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
    })
  }
}
