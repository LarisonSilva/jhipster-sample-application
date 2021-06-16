import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPedido, getPedidoIdentifier } from '../pedido.model';

export type EntityResponseType = HttpResponse<IPedido>;
export type EntityArrayResponseType = HttpResponse<IPedido[]>;

@Injectable({ providedIn: 'root' })
export class PedidoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/pedidos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pedido: IPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .post<IPedido>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pedido: IPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .put<IPedido>(`${this.resourceUrl}/${getPedidoIdentifier(pedido) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(pedido: IPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .patch<IPedido>(`${this.resourceUrl}/${getPedidoIdentifier(pedido) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPedido[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPedidoToCollectionIfMissing(pedidoCollection: IPedido[], ...pedidosToCheck: (IPedido | null | undefined)[]): IPedido[] {
    const pedidos: IPedido[] = pedidosToCheck.filter(isPresent);
    if (pedidos.length > 0) {
      const pedidoCollectionIdentifiers = pedidoCollection.map(pedidoItem => getPedidoIdentifier(pedidoItem)!);
      const pedidosToAdd = pedidos.filter(pedidoItem => {
        const pedidoIdentifier = getPedidoIdentifier(pedidoItem);
        if (pedidoIdentifier == null || pedidoCollectionIdentifiers.includes(pedidoIdentifier)) {
          return false;
        }
        pedidoCollectionIdentifiers.push(pedidoIdentifier);
        return true;
      });
      return [...pedidosToAdd, ...pedidoCollection];
    }
    return pedidoCollection;
  }

  protected convertDateFromClient(pedido: IPedido): IPedido {
    return Object.assign({}, pedido, {
      efetuado: pedido.efetuado?.isValid() ? pedido.efetuado.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.efetuado = res.body.efetuado ? dayjs(res.body.efetuado) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pedido: IPedido) => {
        pedido.efetuado = pedido.efetuado ? dayjs(pedido.efetuado) : undefined;
      });
    }
    return res;
  }
}
