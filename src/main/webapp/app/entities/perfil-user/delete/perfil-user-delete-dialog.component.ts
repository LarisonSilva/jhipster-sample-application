import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPerfilUser } from '../perfil-user.model';
import { PerfilUserService } from '../service/perfil-user.service';

@Component({
  templateUrl: './perfil-user-delete-dialog.component.html',
})
export class PerfilUserDeleteDialogComponent {
  perfilUser?: IPerfilUser;

  constructor(protected perfilUserService: PerfilUserService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.perfilUserService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
