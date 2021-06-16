import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PerfilUserComponent } from '../list/perfil-user.component';
import { PerfilUserDetailComponent } from '../detail/perfil-user-detail.component';
import { PerfilUserUpdateComponent } from '../update/perfil-user-update.component';
import { PerfilUserRoutingResolveService } from './perfil-user-routing-resolve.service';

const perfilUserRoute: Routes = [
  {
    path: '',
    component: PerfilUserComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PerfilUserDetailComponent,
    resolve: {
      perfilUser: PerfilUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PerfilUserUpdateComponent,
    resolve: {
      perfilUser: PerfilUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PerfilUserUpdateComponent,
    resolve: {
      perfilUser: PerfilUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(perfilUserRoute)],
  exports: [RouterModule],
})
export class PerfilUserRoutingModule {}
