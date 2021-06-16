import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProdutoEmEstoqueComponent } from '../list/produto-em-estoque.component';
import { ProdutoEmEstoqueDetailComponent } from '../detail/produto-em-estoque-detail.component';
import { ProdutoEmEstoqueUpdateComponent } from '../update/produto-em-estoque-update.component';
import { ProdutoEmEstoqueRoutingResolveService } from './produto-em-estoque-routing-resolve.service';

const produtoEmEstoqueRoute: Routes = [
  {
    path: '',
    component: ProdutoEmEstoqueComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProdutoEmEstoqueDetailComponent,
    resolve: {
      produtoEmEstoque: ProdutoEmEstoqueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProdutoEmEstoqueUpdateComponent,
    resolve: {
      produtoEmEstoque: ProdutoEmEstoqueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProdutoEmEstoqueUpdateComponent,
    resolve: {
      produtoEmEstoque: ProdutoEmEstoqueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(produtoEmEstoqueRoute)],
  exports: [RouterModule],
})
export class ProdutoEmEstoqueRoutingModule {}
