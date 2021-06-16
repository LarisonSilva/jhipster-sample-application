import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProdutoNoPedidoComponent } from '../list/produto-no-pedido.component';
import { ProdutoNoPedidoDetailComponent } from '../detail/produto-no-pedido-detail.component';
import { ProdutoNoPedidoUpdateComponent } from '../update/produto-no-pedido-update.component';
import { ProdutoNoPedidoRoutingResolveService } from './produto-no-pedido-routing-resolve.service';

const produtoNoPedidoRoute: Routes = [
  {
    path: '',
    component: ProdutoNoPedidoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProdutoNoPedidoDetailComponent,
    resolve: {
      produtoNoPedido: ProdutoNoPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProdutoNoPedidoUpdateComponent,
    resolve: {
      produtoNoPedido: ProdutoNoPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProdutoNoPedidoUpdateComponent,
    resolve: {
      produtoNoPedido: ProdutoNoPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(produtoNoPedidoRoute)],
  exports: [RouterModule],
})
export class ProdutoNoPedidoRoutingModule {}
