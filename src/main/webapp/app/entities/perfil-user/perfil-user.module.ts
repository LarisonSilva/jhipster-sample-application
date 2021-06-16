import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PerfilUserComponent } from './list/perfil-user.component';
import { PerfilUserDetailComponent } from './detail/perfil-user-detail.component';
import { PerfilUserUpdateComponent } from './update/perfil-user-update.component';
import { PerfilUserDeleteDialogComponent } from './delete/perfil-user-delete-dialog.component';
import { PerfilUserRoutingModule } from './route/perfil-user-routing.module';

@NgModule({
  imports: [SharedModule, PerfilUserRoutingModule],
  declarations: [PerfilUserComponent, PerfilUserDetailComponent, PerfilUserUpdateComponent, PerfilUserDeleteDialogComponent],
  entryComponents: [PerfilUserDeleteDialogComponent],
})
export class PerfilUserModule {}
