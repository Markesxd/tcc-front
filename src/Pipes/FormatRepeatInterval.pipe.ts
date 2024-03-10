import { Pipe, PipeTransform } from "@angular/core";
import { ReapeatInterval } from "src/model/healthEvent.model";

@Pipe({name: 'FormatRepeatInterval', standalone: true})
export class FormatRepeatInterval implements PipeTransform {
    transform(value: ReapeatInterval): string {
        switch(value){
            case ReapeatInterval.WEEKLY:
                return 'Semanal';
            case ReapeatInterval.DAILY:
                return 'Diario';
            case ReapeatInterval.MONTHLY:
                return 'Mensal';
            case ReapeatInterval.NO_REPEAT:
                return 'Único';
            case ReapeatInterval.YEARLY:
                return 'Anual';
        }
    }
}