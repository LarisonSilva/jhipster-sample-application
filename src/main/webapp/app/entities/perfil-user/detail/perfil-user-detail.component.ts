import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPerfilUser } from '../perfil-user.model';

@Component({
  selector: 'jhi-perfil-user-detail',
  templateUrl: './perfil-user-detail.component.html',
})
export class PerfilUserDetailComponent implements OnInit {
  perfilUser: IPerfilUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ perfilUser }) => {
      this.perfilUser = perfilUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
