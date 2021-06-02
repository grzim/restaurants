import {Pipe, PipeTransform} from '@angular/core';
import {identity} from '../utils/helpers';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(value: any[], f: (z: any) => boolean): any[] {
    return (value || []).filter(f || identity);
  }

}
