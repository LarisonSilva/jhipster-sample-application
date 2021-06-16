import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEndereco, Endereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';
import { IPerfilUser } from 'app/entities/perfil-user/perfil-user.model';
import { PerfilUserService } from 'app/entities/perfil-user/service/perfil-user.service';

@Component({
  selector: 'jhi-endereco-update',
  templateUrl: './endereco-update.component.html',
})
export class EnderecoUpdateComponent implements OnInit {
  isSaving = false;

  perfilUsersSharedCollection: IPerfilUser[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    cep: [null, [Validators.required]],
    logradouro: [],
    bairro: [],
    numero: [],
    cidade: [],
    complemento: [],
    perfilUser: [],
  });

  constructor(
    protected enderecoService: EnderecoService,
    protected perfilUserService: PerfilUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ endereco }) => {
      this.updateForm(endereco);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const endereco = this.createFromForm();
    if (endereco.id !== undefined) {
      this.subscribeToSaveResponse(this.enderecoService.update(endereco));
    } else {
      this.subscribeToSaveResponse(this.enderecoService.create(endereco));
    }
  }

  trackPerfilUserById(index: number, item: IPerfilUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEndereco>>): void {
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

  protected updateForm(endereco: IEndereco): void {
    this.editForm.patchValue({
      id: endereco.id,
      nome: endereco.nome,
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      numero: endereco.numero,
      cidade: endereco.cidade,
      complemento: endereco.complemento,
      perfilUser: endereco.perfilUser,
    });

    this.perfilUsersSharedCollection = this.perfilUserService.addPerfilUserToCollectionIfMissing(
      this.perfilUsersSharedCollection,
      endereco.perfilUser
    );
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
  }

  protected createFromForm(): IEndereco {
    return {
      ...new Endereco(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      bairro: this.editForm.get(['bairro'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      complemento: this.editForm.get(['complemento'])!.value,
      perfilUser: this.editForm.get(['perfilUser'])!.value,
    };
  }
}
