import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProdutoEmEstoque, getProdutoEmEstoqueIdentifier } from '../produto-em-estoque.model';

export type EntityResponseType = HttpResponse<IProdutoEmEstoque>;
export type EntityArrayResponseType = HttpResponse<IProdutoEmEstoque[]>;

@Injectable({ providedIn: 'root' })
export class ProdutoEmEstoqueService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/produto-em-estoques');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(produtoEmEstoque: IProdutoEmEstoque): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoEmEstoque);
    return this.http
      .post<IProdutoEmEstoque>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(produtoEmEstoque: IProdutoEmEstoque): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoEmEstoque);
    return this.http
      .put<IProdutoEmEstoque>(`${this.resourceUrl}/${getProdutoEmEstoqueIdentifier(produtoEmEstoque) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(produtoEmEstoque: IProdutoEmEstoque): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoEmEstoque);
    return this.http
      .patch<IProdutoEmEstoque>(`${this.resourceUrl}/${getProdutoEmEstoqueIdentifier(produtoEmEstoque) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProdutoEmEstoque>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProdutoEmEstoque[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProdutoEmEstoqueToCollectionIfMissing(
    produtoEmEstoqueCollection: IProdutoEmEstoque[],
    ...produtoEmEstoquesToCheck: (IProdutoEmEstoque | null | undefined)[]
  ): IProdutoEmEstoque[] {
    const produtoEmEstoques: IProdutoEmEstoque[] = produtoEmEstoquesToCheck.filter(isPresent);
    if (produtoEmEstoques.length > 0) {
      const produtoEmEstoqueCollectionIdentifiers = produtoEmEstoqueCollection.map(
        produtoEmEstoqueItem => getProdutoEmEstoqueIdentifier(produtoEmEstoqueItem)!
      );
      const produtoEmEstoquesToAdd = produtoEmEstoques.filter(produtoEmEstoqueItem => {
        const produtoEmEstoqueIdentifier = getProdutoEmEstoqueIdentifier(produtoEmEstoqueItem);
        if (produtoEmEstoqueIdentifier == null || produtoEmEstoqueCollectionIdentifiers.includes(produtoEmEstoqueIdentifier)) {
          return false;
        }
        produtoEmEstoqueCollectionIdentifiers.push(produtoEmEstoqueIdentifier);
        return true;
      });
      return [...produtoEmEstoquesToAdd, ...produtoEmEstoqueCollection];
    }
    return produtoEmEstoqueCollection;
  }

  protected convertDateFromClient(produtoEmEstoque: IProdutoEmEstoque): IProdutoEmEstoque {
    return Object.assign({}, produtoEmEstoque, {
      criado: produtoEmEstoque.criado?.isValid() ? produtoEmEstoque.criado.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.criado = res.body.criado ? dayjs(res.body.criado) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((produtoEmEstoque: IProdutoEmEstoque) => {
        produtoEmEstoque.criado = produtoEmEstoque.criado ? dayjs(produtoEmEstoque.criado) : undefined;
      });
    }
    return res;
  }
}
