import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProdutoEmEstoque } from '../produto-em-estoque.model';
import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';
import { ProdutoEmEstoqueDeleteDialogComponent } from '../delete/produto-em-estoque-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-produto-em-estoque',
  templateUrl: './produto-em-estoque.component.html',
})
export class ProdutoEmEstoqueComponent implements OnInit {
  produtoEmEstoques?: IProdutoEmEstoque[];
  isLoading = false;

  constructor(
    protected produtoEmEstoqueService: ProdutoEmEstoqueService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.produtoEmEstoqueService.query().subscribe(
      (res: HttpResponse<IProdutoEmEstoque[]>) => {
        this.isLoading = false;
        this.produtoEmEstoques = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProdutoEmEstoque): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(produtoEmEstoque: IProdutoEmEstoque): void {
    const modalRef = this.modalService.open(ProdutoEmEstoqueDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.produtoEmEstoque = produtoEmEstoque;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
