import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEndereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';

@Component({
  templateUrl: './endereco-delete-dialog.component.html',
})
export class EnderecoDeleteDialogComponent {
  endereco?: IEndereco;

  constructor(protected enderecoService: EnderecoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.enderecoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
