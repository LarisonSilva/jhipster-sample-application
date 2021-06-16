import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProdutoEmEstoque, ProdutoEmEstoque } from '../produto-em-estoque.model';
import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';

@Injectable({ providedIn: 'root' })
export class ProdutoEmEstoqueRoutingResolveService implements Resolve<IProdutoEmEstoque> {
  constructor(protected service: ProdutoEmEstoqueService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProdutoEmEstoque> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((produtoEmEstoque: HttpResponse<ProdutoEmEstoque>) => {
          if (produtoEmEstoque.body) {
            return of(produtoEmEstoque.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProdutoEmEstoque());
  }
}
