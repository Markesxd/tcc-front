import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'formatDate', standalone: true})
export class FormatDate implements PipeTransform{
    transform(date?: Date | string): string {
        if(typeof date === 'string') {
            date = new Date(date);
        }
        return date ? `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` : '';
    }
}