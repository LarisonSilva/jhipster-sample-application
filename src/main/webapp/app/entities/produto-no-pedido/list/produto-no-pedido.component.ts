import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProdutoNoPedido } from '../produto-no-pedido.model';
import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';
import { ProdutoNoPedidoDeleteDialogComponent } from '../delete/produto-no-pedido-delete-dialog.component';

@Component({
  selector: 'jhi-produto-no-pedido',
  templateUrl: './produto-no-pedido.component.html',
})
export class ProdutoNoPedidoComponent implements OnInit {
  produtoNoPedidos?: IProdutoNoPedido[];
  isLoading = false;

  constructor(protected produtoNoPedidoService: ProdutoNoPedidoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.produtoNoPedidoService.query().subscribe(
      (res: HttpResponse<IProdutoNoPedido[]>) => {
        this.isLoading = false;
        this.produtoNoPedidos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProdutoNoPedido): number {
    return item.id!;
  }

  delete(produtoNoPedido: IProdutoNoPedido): void {
    const modalRef = this.modalService.open(ProdutoNoPedidoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.produtoNoPedido = produtoNoPedido;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
