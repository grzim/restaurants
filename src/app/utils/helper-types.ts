import {Route} from '@angular/router';

export type NamedRoute = Route & { name: string, excludeFromMenuPredicate?: (x) => boolean };
