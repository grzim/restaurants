import {identity, Observable, Subject, Subscriber, Subscription} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {ensureArray, flatten, isNotNil} from './helpers';
import {catchError} from 'rxjs/operators';

export function replicate<T>(input$: Observable<T>,
                             output: Subject<T> | EventEmitter<T> | Subscriber<T>,
                             errorOutput?: Subject<any> | EventEmitter<any> | Subscriber<any>): Subscription {
  const nextMethod = ((output as EventEmitter<any>).emit || output.next).bind(output);
  const errorMethod = isNotNil(errorOutput)
    ? ((errorOutput as EventEmitter<any>).emit || errorOutput.next).bind(errorOutput)
    : identity;

  return input$
    .pipe(catchError((err, caught) => {
      console.error(err);
      errorMethod(err);
      return caught;
    }))
    .subscribe(nextMethod, () => {}, () => {});
}


export function replicateArray(inStream, outStream, errorOutput?): Subscription[] {
  const inStreamsArray = ensureArray(inStream);
  const outStreamArray = ensureArray(outStream);

  return flatten<Subscription>(inStreamsArray
    .map(inStream$ => outStreamArray
      .map(outStream$ => replicate(inStream$, outStream$, errorOutput))));
}

export function replicatePairs(array: Array<[Observable<any>, Subject<any>]>, errorOutput?): Subscription[]  {
  return array.map(arr => replicate(arr[0], arr[1], errorOutput));
}

export function replicateOneToOne(fromArr: Observable<any>[], toArr: Subject<any>[], errorOutput?): Subscription[]  {
  return fromArr.map((from, index) => replicate(from, toArr[index], errorOutput));
}

