import {from, of, partition} from 'rxjs';
import {serverUrl} from '../../utils/constants';
import {catchError, mergeMap, shareReplay, switchMap} from 'rxjs/operators';
import {not} from '../../utils/helpers';

export const parseUser = async user => {
  if (!user) {
    return;
  }
  const token = await user.getIdTokenResult();
  const type = token.claims.type || 'Regular';
  console.log(token.claims)
  return {
    ...user,
    id: user.uid,
    type
  };
};
export const addUserId = ([reviewData, userData]) => ({
  ...reviewData,
  userId: userData.id
});
export const adjustDateOfVisit = review => ({...review, dateOfVisit: review.dateOfVisit._seconds * 1000});
export const withAuthUserId = ([editSelfData, {id}]) => ({...editSelfData, id});
export const editSelfMap = (url, {id}) => url.replace(':id', id);
export const userMap = (url, {userId}) => url.replace(':id', userId);
export const restaurantUrlMap = (url, {id}) => url.replace(':id', id);
export const reviewUrlMap = (url, {restaurantId}) => url.replace(':id', restaurantId);
export const modifyReviewUrlMap = (url, {id}) => url.replace(':id', id);
export const responseUrlMap = (url, {reviewId}) => url.replace(':id', reviewId);
export const isError = (data) => data instanceof Error;
export const snackbarVisibilityTime = 3000;
export const httpCreator = (http) => verb => ({url, source$, urlMap = (urlVal, obj) => urlVal}) => partition(
  source$.pipe(
    mergeMap(
      (data) => {
        const httpCall = http[verb].bind(http, serverUrl + '/' + urlMap(url, data));
        const respPromise = (verb === 'get') ? httpCall().toPromise() : httpCall(data).toPromise();
        return respPromise.catch(err => Error(err?.error?.message || 'Server error'));
      }
    ),
    shareReplay(1)),
  not(isError));

export const partitionOnError = ({source$, projectFn}) => partition(
  source$.pipe(
    switchMap(
      (...data) => from(projectFn(...data)).pipe(catchError(err => of(new Error(err))))
    ),
    shareReplay(1)
  ),
  not(isError));

export const messageText = (message: string): { message: string } => ({message});
export const openSnackBarAndRunZone = ({snackBar, zone, initialMsg}) =>
  ({message}) => zone.run(() => {
    snackBar.open(message || initialMsg, 'Dismiss', {
      duration: snackbarVisibilityTime,
      horizontalPosition: 'right'
    });
  });
