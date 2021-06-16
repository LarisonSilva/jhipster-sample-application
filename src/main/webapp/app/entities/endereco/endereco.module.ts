import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EnderecoComponent } from './list/endereco.component';
import { EnderecoDetailComponent } from './detail/endereco-detail.component';
import { EnderecoUpdateComponent } from './update/endereco-update.component';
import { EnderecoDeleteDialogComponent } from './delete/endereco-delete-dialog.component';
import { EnderecoRoutingModule } from './route/endereco-routing.module';

@NgModule({
  imports: [SharedModule, EnderecoRoutingModule],
  declarations: [EnderecoComponent, EnderecoDetailComponent, EnderecoUpdateComponent, EnderecoDeleteDialogComponent],
  entryComponents: [EnderecoDeleteDialogComponent],
})
export class EnderecoModule {}
