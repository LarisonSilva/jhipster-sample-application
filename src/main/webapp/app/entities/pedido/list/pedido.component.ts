import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';
import { PedidoDeleteDialogComponent } from '../delete/pedido-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-pedido',
  templateUrl: './pedido.component.html',
})
export class PedidoComponent implements OnInit {
  pedidos?: IPedido[];
  isLoading = false;

  constructor(protected pedidoService: PedidoService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pedidoService.query().subscribe(
      (res: HttpResponse<IPedido[]>) => {
        this.isLoading = false;
        this.pedidos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPedido): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(pedido: IPedido): void {
    const modalRef = this.modalService.open(PedidoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pedido = pedido;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
