import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPerfilUser, PerfilUser } from '../perfil-user.model';
import { PerfilUserService } from '../service/perfil-user.service';

@Injectable({ providedIn: 'root' })
export class PerfilUserRoutingResolveService implements Resolve<IPerfilUser> {
  constructor(protected service: PerfilUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPerfilUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((perfilUser: HttpResponse<PerfilUser>) => {
          if (perfilUser.body) {
            return of(perfilUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PerfilUser());
  }
}
