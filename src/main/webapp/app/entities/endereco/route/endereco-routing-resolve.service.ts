import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEndereco, Endereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';

@Injectable({ providedIn: 'root' })
export class EnderecoRoutingResolveService implements Resolve<IEndereco> {
  constructor(protected service: EnderecoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEndereco> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((endereco: HttpResponse<Endereco>) => {
          if (endereco.body) {
            return of(endereco.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Endereco());
  }
}
