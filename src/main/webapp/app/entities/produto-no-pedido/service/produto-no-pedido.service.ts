import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProdutoNoPedido, getProdutoNoPedidoIdentifier } from '../produto-no-pedido.model';

export type EntityResponseType = HttpResponse<IProdutoNoPedido>;
export type EntityArrayResponseType = HttpResponse<IProdutoNoPedido[]>;

@Injectable({ providedIn: 'root' })
export class ProdutoNoPedidoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/produto-no-pedidos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(produtoNoPedido: IProdutoNoPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoNoPedido);
    return this.http
      .post<IProdutoNoPedido>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(produtoNoPedido: IProdutoNoPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoNoPedido);
    return this.http
      .put<IProdutoNoPedido>(`${this.resourceUrl}/${getProdutoNoPedidoIdentifier(produtoNoPedido) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(produtoNoPedido: IProdutoNoPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoNoPedido);
    return this.http
      .patch<IProdutoNoPedido>(`${this.resourceUrl}/${getProdutoNoPedidoIdentifier(produtoNoPedido) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProdutoNoPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProdutoNoPedido[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProdutoNoPedidoToCollectionIfMissing(
    produtoNoPedidoCollection: IProdutoNoPedido[],
    ...produtoNoPedidosToCheck: (IProdutoNoPedido | null | undefined)[]
  ): IProdutoNoPedido[] {
    const produtoNoPedidos: IProdutoNoPedido[] = produtoNoPedidosToCheck.filter(isPresent);
    if (produtoNoPedidos.length > 0) {
      const produtoNoPedidoCollectionIdentifiers = produtoNoPedidoCollection.map(
        produtoNoPedidoItem => getProdutoNoPedidoIdentifier(produtoNoPedidoItem)!
      );
      const produtoNoPedidosToAdd = produtoNoPedidos.filter(produtoNoPedidoItem => {
        const produtoNoPedidoIdentifier = getProdutoNoPedidoIdentifier(produtoNoPedidoItem);
        if (produtoNoPedidoIdentifier == null || produtoNoPedidoCollectionIdentifiers.includes(produtoNoPedidoIdentifier)) {
          return false;
        }
        produtoNoPedidoCollectionIdentifiers.push(produtoNoPedidoIdentifier);
        return true;
      });
      return [...produtoNoPedidosToAdd, ...produtoNoPedidoCollection];
    }
    return produtoNoPedidoCollection;
  }

  protected convertDateFromClient(produtoNoPedido: IProdutoNoPedido): IProdutoNoPedido {
    return Object.assign({}, produtoNoPedido, {
      criado: produtoNoPedido.criado?.isValid() ? produtoNoPedido.criado.toJSON() : undefined,
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
      res.body.forEach((produtoNoPedido: IProdutoNoPedido) => {
        produtoNoPedido.criado = produtoNoPedido.criado ? dayjs(produtoNoPedido.criado) : undefined;
      });
    }
    return res;
  }
}
