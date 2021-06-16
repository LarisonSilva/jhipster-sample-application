import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEndereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';
import { EnderecoDeleteDialogComponent } from '../delete/endereco-delete-dialog.component';

@Component({
  selector: 'jhi-endereco',
  templateUrl: './endereco.component.html',
})
export class EnderecoComponent implements OnInit {
  enderecos?: IEndereco[];
  isLoading = false;

  constructor(protected enderecoService: EnderecoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.enderecoService.query().subscribe(
      (res: HttpResponse<IEndereco[]>) => {
        this.isLoading = false;
        this.enderecos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEndereco): number {
    return item.id!;
  }

  delete(endereco: IEndereco): void {
    const modalRef = this.modalService.open(EnderecoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.endereco = endereco;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
