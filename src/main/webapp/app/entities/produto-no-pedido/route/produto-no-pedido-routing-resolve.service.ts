import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProdutoNoPedido, ProdutoNoPedido } from '../produto-no-pedido.model';
import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';

@Injectable({ providedIn: 'root' })
export class ProdutoNoPedidoRoutingResolveService implements Resolve<IProdutoNoPedido> {
  constructor(protected service: ProdutoNoPedidoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProdutoNoPedido> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((produtoNoPedido: HttpResponse<ProdutoNoPedido>) => {
          if (produtoNoPedido.body) {
            return of(produtoNoPedido.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProdutoNoPedido());
  }
}
