import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProdutoNoPedido } from '../produto-no-pedido.model';

@Component({
  selector: 'jhi-produto-no-pedido-detail',
  templateUrl: './produto-no-pedido-detail.component.html',
})
export class ProdutoNoPedidoDetailComponent implements OnInit {
  produtoNoPedido: IProdutoNoPedido | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produtoNoPedido }) => {
      this.produtoNoPedido = produtoNoPedido;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
