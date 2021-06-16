import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPerfilUser } from '../perfil-user.model';
import { PerfilUserService } from '../service/perfil-user.service';
import { PerfilUserDeleteDialogComponent } from '../delete/perfil-user-delete-dialog.component';

@Component({
  selector: 'jhi-perfil-user',
  templateUrl: './perfil-user.component.html',
})
export class PerfilUserComponent implements OnInit {
  perfilUsers?: IPerfilUser[];
  isLoading = false;

  constructor(protected perfilUserService: PerfilUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.perfilUserService.query().subscribe(
      (res: HttpResponse<IPerfilUser[]>) => {
        this.isLoading = false;
        this.perfilUsers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPerfilUser): number {
    return item.id!;
  }

  delete(perfilUser: IPerfilUser): void {
    const modalRef = this.modalService.open(PerfilUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.perfilUser = perfilUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
