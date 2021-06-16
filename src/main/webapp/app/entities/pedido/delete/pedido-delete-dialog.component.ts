import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';

@Component({
  templateUrl: './pedido-delete-dialog.component.html',
})
export class PedidoDeleteDialogComponent {
  pedido?: IPedido;

  constructor(protected pedidoService: PedidoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pedidoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
