import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EnderecoComponent } from '../list/endereco.component';
import { EnderecoDetailComponent } from '../detail/endereco-detail.component';
import { EnderecoUpdateComponent } from '../update/endereco-update.component';
import { EnderecoRoutingResolveService } from './endereco-routing-resolve.service';

const enderecoRoute: Routes = [
  {
    path: '',
    component: EnderecoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnderecoDetailComponent,
    resolve: {
      endereco: EnderecoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnderecoUpdateComponent,
    resolve: {
      endereco: EnderecoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnderecoUpdateComponent,
    resolve: {
      endereco: EnderecoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(enderecoRoute)],
  exports: [RouterModule],
})
export class EnderecoRoutingModule {}
