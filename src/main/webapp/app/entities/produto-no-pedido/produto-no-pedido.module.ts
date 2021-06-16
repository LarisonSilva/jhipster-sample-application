import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProdutoNoPedidoComponent } from './list/produto-no-pedido.component';
import { ProdutoNoPedidoDetailComponent } from './detail/produto-no-pedido-detail.component';
import { ProdutoNoPedidoUpdateComponent } from './update/produto-no-pedido-update.component';
import { ProdutoNoPedidoDeleteDialogComponent } from './delete/produto-no-pedido-delete-dialog.component';
import { ProdutoNoPedidoRoutingModule } from './route/produto-no-pedido-routing.module';

@NgModule({
  imports: [SharedModule, ProdutoNoPedidoRoutingModule],
  declarations: [
    ProdutoNoPedidoComponent,
    ProdutoNoPedidoDetailComponent,
    ProdutoNoPedidoUpdateComponent,
    ProdutoNoPedidoDeleteDialogComponent,
  ],
  entryComponents: [ProdutoNoPedidoDeleteDialogComponent],
})
export class ProdutoNoPedidoModule {}
