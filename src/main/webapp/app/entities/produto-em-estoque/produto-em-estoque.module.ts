import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProdutoEmEstoqueComponent } from './list/produto-em-estoque.component';
import { ProdutoEmEstoqueDetailComponent } from './detail/produto-em-estoque-detail.component';
import { ProdutoEmEstoqueUpdateComponent } from './update/produto-em-estoque-update.component';
import { ProdutoEmEstoqueDeleteDialogComponent } from './delete/produto-em-estoque-delete-dialog.component';
import { ProdutoEmEstoqueRoutingModule } from './route/produto-em-estoque-routing.module';

@NgModule({
  imports: [SharedModule, ProdutoEmEstoqueRoutingModule],
  declarations: [
    ProdutoEmEstoqueComponent,
    ProdutoEmEstoqueDetailComponent,
    ProdutoEmEstoqueUpdateComponent,
    ProdutoEmEstoqueDeleteDialogComponent,
  ],
  entryComponents: [ProdutoEmEstoqueDeleteDialogComponent],
})
export class ProdutoEmEstoqueModule {}
