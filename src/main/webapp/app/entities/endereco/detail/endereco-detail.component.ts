import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEndereco } from '../endereco.model';

@Component({
  selector: 'jhi-endereco-detail',
  templateUrl: './endereco-detail.component.html',
})
export class EnderecoDetailComponent implements OnInit {
  endereco: IEndereco | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ endereco }) => {
      this.endereco = endereco;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
