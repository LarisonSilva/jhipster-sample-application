import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProdutoEmEstoque } from '../produto-em-estoque.model';
import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';

@Component({
  templateUrl: './produto-em-estoque-delete-dialog.component.html',
})
export class ProdutoEmEstoqueDeleteDialogComponent {
  produtoEmEstoque?: IProdutoEmEstoque;

  constructor(protected produtoEmEstoqueService: ProdutoEmEstoqueService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.produtoEmEstoqueService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
