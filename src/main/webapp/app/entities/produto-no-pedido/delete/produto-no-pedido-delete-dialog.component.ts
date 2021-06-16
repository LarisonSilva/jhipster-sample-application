import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProdutoNoPedido } from '../produto-no-pedido.model';
import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';

@Component({
  templateUrl: './produto-no-pedido-delete-dialog.component.html',
})
export class ProdutoNoPedidoDeleteDialogComponent {
  produtoNoPedido?: IProdutoNoPedido;

  constructor(protected produtoNoPedidoService: ProdutoNoPedidoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.produtoNoPedidoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
