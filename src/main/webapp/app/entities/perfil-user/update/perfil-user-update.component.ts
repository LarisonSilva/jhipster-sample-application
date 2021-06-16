import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPerfilUser, PerfilUser } from '../perfil-user.model';
import { PerfilUserService } from '../service/perfil-user.service';

@Component({
  selector: 'jhi-perfil-user-update',
  templateUrl: './perfil-user-update.component.html',
})
export class PerfilUserUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    senha: [null, [Validators.required]],
    fotoUrl: [],
    cpf: [],
    dataNascimento: [],
    criado: [],
    email: [],
    contato: [],
  });

  constructor(protected perfilUserService: PerfilUserService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ perfilUser }) => {
      if (perfilUser.id === undefined) {
        const today = dayjs().startOf('day');
        perfilUser.criado = today;
      }

      this.updateForm(perfilUser);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const perfilUser = this.createFromForm();
    if (perfilUser.id !== undefined) {
      this.subscribeToSaveResponse(this.perfilUserService.update(perfilUser));
    } else {
      this.subscribeToSaveResponse(this.perfilUserService.create(perfilUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerfilUser>>): void {
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

  protected updateForm(perfilUser: IPerfilUser): void {
    this.editForm.patchValue({
      id: perfilUser.id,
      nome: perfilUser.nome,
      senha: perfilUser.senha,
      fotoUrl: perfilUser.fotoUrl,
      cpf: perfilUser.cpf,
      dataNascimento: perfilUser.dataNascimento,
      criado: perfilUser.criado ? perfilUser.criado.format(DATE_TIME_FORMAT) : null,
      email: perfilUser.email,
      contato: perfilUser.contato,
    });
  }

  protected createFromForm(): IPerfilUser {
    return {
      ...new PerfilUser(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      senha: this.editForm.get(['senha'])!.value,
      fotoUrl: this.editForm.get(['fotoUrl'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      dataNascimento: this.editForm.get(['dataNascimento'])!.value,
      criado: this.editForm.get(['criado'])!.value ? dayjs(this.editForm.get(['criado'])!.value, DATE_TIME_FORMAT) : undefined,
      email: this.editForm.get(['email'])!.value,
      contato: this.editForm.get(['contato'])!.value,
    };
  }
}
