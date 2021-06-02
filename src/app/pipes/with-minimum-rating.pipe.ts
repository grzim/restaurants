import { Pipe, PipeTransform } from '@angular/core';
import {Restaurant} from '../utils/models';

@Pipe({
  name: 'withMinimumRating'
})
export class WithMinimumRatingPipe implements PipeTransform {

  transform(restaurants: Restaurant[], minValue): unknown {
    return minValue ?
      (restaurants || []).filter(({rating}) => rating >= minValue) :
      restaurants;
  }

}
