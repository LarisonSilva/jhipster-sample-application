import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProdutoEmEstoque, ProdutoEmEstoque } from '../produto-em-estoque.model';
import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-produto-em-estoque-update',
  templateUrl: './produto-em-estoque-update.component.html',
})
export class ProdutoEmEstoqueUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    descricao: [],
    fotoUrl: [],
    sku: [],
    ean: [],
    criado: [],
    preco: [],
    precoPromocional: [],
    totalEstoque: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected produtoEmEstoqueService: ProdutoEmEstoqueService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produtoEmEstoque }) => {
      if (produtoEmEstoque.id === undefined) {
        const today = dayjs().startOf('day');
        produtoEmEstoque.criado = today;
      }

      this.updateForm(produtoEmEstoque);
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
    const produtoEmEstoque = this.createFromForm();
    if (produtoEmEstoque.id !== undefined) {
      this.subscribeToSaveResponse(this.produtoEmEstoqueService.update(produtoEmEstoque));
    } else {
      this.subscribeToSaveResponse(this.produtoEmEstoqueService.create(produtoEmEstoque));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProdutoEmEstoque>>): void {
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

  protected updateForm(produtoEmEstoque: IProdutoEmEstoque): void {
    this.editForm.patchValue({
      id: produtoEmEstoque.id,
      nome: produtoEmEstoque.nome,
      descricao: produtoEmEstoque.descricao,
      fotoUrl: produtoEmEstoque.fotoUrl,
      sku: produtoEmEstoque.sku,
      ean: produtoEmEstoque.ean,
      criado: produtoEmEstoque.criado ? produtoEmEstoque.criado.format(DATE_TIME_FORMAT) : null,
      preco: produtoEmEstoque.preco,
      precoPromocional: produtoEmEstoque.precoPromocional,
      totalEstoque: produtoEmEstoque.totalEstoque,
    });
  }

  protected createFromForm(): IProdutoEmEstoque {
    return {
      ...new ProdutoEmEstoque(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      fotoUrl: this.editForm.get(['fotoUrl'])!.value,
      sku: this.editForm.get(['sku'])!.value,
      ean: this.editForm.get(['ean'])!.value,
      criado: this.editForm.get(['criado'])!.value ? dayjs(this.editForm.get(['criado'])!.value, DATE_TIME_FORMAT) : undefined,
      preco: this.editForm.get(['preco'])!.value,
      precoPromocional: this.editForm.get(['precoPromocional'])!.value,
      totalEstoque: this.editForm.get(['totalEstoque'])!.value,
    };
  }
}
