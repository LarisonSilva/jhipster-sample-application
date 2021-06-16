import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPedido, Pedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPerfilUser } from 'app/entities/perfil-user/perfil-user.model';
import { PerfilUserService } from 'app/entities/perfil-user/service/perfil-user.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

@Component({
  selector: 'jhi-pedido-update',
  templateUrl: './pedido-update.component.html',
})
export class PedidoUpdateComponent implements OnInit {
  isSaving = false;

  perfilUsersSharedCollection: IPerfilUser[] = [];
  enderecosSharedCollection: IEndereco[] = [];

  editForm = this.fb.group({
    id: [],
    efetuado: [],
    status: [],
    precoTotal: [],
    comentarios: [],
    codigoPagamento: [],
    perfilUser: [],
    endereco: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected pedidoService: PedidoService,
    protected perfilUserService: PerfilUserService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pedido }) => {
      if (pedido.id === undefined) {
        const today = dayjs().startOf('day');
        pedido.efetuado = today;
      }

      this.updateForm(pedido);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('jhipsterSampleApplicationApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pedido = this.createFromForm();
    if (pedido.id !== undefined) {
      this.subscribeToSaveResponse(this.pedidoService.update(pedido));
    } else {
      this.subscribeToSaveResponse(this.pedidoService.create(pedido));
    }
  }

  trackPerfilUserById(index: number, item: IPerfilUser): number {
    return item.id!;
  }

  trackEnderecoById(index: number, item: IEndereco): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPedido>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pedido: IPedido): void {
    this.editForm.patchValue({
      id: pedido.id,
      efetuado: pedido.efetuado ? pedido.efetuado.format(DATE_TIME_FORMAT) : null,
      status: pedido.status,
      precoTotal: pedido.precoTotal,
      comentarios: pedido.comentarios,
      codigoPagamento: pedido.codigoPagamento,
      perfilUser: pedido.perfilUser,
      endereco: pedido.endereco,
    });

    this.perfilUsersSharedCollection = this.perfilUserService.addPerfilUserToCollectionIfMissing(
      this.perfilUsersSharedCollection,
      pedido.perfilUser
    );
    this.enderecosSharedCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosSharedCollection, pedido.endereco);
  }

  protected loadRelationshipsOptions(): void {
    this.perfilUserService
      .query()
      .pipe(map((res: HttpResponse<IPerfilUser[]>) => res.body ?? []))
      .pipe(
        map((perfilUsers: IPerfilUser[]) =>
          this.perfilUserService.addPerfilUserToCollectionIfMissing(perfilUsers, this.editForm.get('perfilUser')!.value)
        )
      )
      .subscribe((perfilUsers: IPerfilUser[]) => (this.perfilUsersSharedCollection = perfilUsers));

    this.enderecoService
      .query()
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosSharedCollection = enderecos));
  }

  protected createFromForm(): IPedido {
    return {
      ...new Pedido(),
      id: this.editForm.get(['id'])!.value,
      efetuado: this.editForm.get(['efetuado'])!.value ? dayjs(this.editForm.get(['efetuado'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      precoTotal: this.editForm.get(['precoTotal'])!.value,
      comentarios: this.editForm.get(['comentarios'])!.value,
      codigoPagamento: this.editForm.get(['codigoPagamento'])!.value,
      perfilUser: this.editForm.get(['perfilUser'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
