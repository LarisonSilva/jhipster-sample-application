import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPerfilUser, getPerfilUserIdentifier } from '../perfil-user.model';

export type EntityResponseType = HttpResponse<IPerfilUser>;
export type EntityArrayResponseType = HttpResponse<IPerfilUser[]>;

@Injectable({ providedIn: 'root' })
export class PerfilUserService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/perfil-users');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(perfilUser: IPerfilUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfilUser);
    return this.http
      .post<IPerfilUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(perfilUser: IPerfilUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfilUser);
    return this.http
      .put<IPerfilUser>(`${this.resourceUrl}/${getPerfilUserIdentifier(perfilUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(perfilUser: IPerfilUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(perfilUser);
    return this.http
      .patch<IPerfilUser>(`${this.resourceUrl}/${getPerfilUserIdentifier(perfilUser) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPerfilUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPerfilUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPerfilUserToCollectionIfMissing(
    perfilUserCollection: IPerfilUser[],
    ...perfilUsersToCheck: (IPerfilUser | null | undefined)[]
  ): IPerfilUser[] {
    const perfilUsers: IPerfilUser[] = perfilUsersToCheck.filter(isPresent);
    if (perfilUsers.length > 0) {
      const perfilUserCollectionIdentifiers = perfilUserCollection.map(perfilUserItem => getPerfilUserIdentifier(perfilUserItem)!);
      const perfilUsersToAdd = perfilUsers.filter(perfilUserItem => {
        const perfilUserIdentifier = getPerfilUserIdentifier(perfilUserItem);
        if (perfilUserIdentifier == null || perfilUserCollectionIdentifiers.includes(perfilUserIdentifier)) {
          return false;
        }
        perfilUserCollectionIdentifiers.push(perfilUserIdentifier);
        return true;
      });
      return [...perfilUsersToAdd, ...perfilUserCollection];
    }
    return perfilUserCollection;
  }

  protected convertDateFromClient(perfilUser: IPerfilUser): IPerfilUser {
    return Object.assign({}, perfilUser, {
      dataNascimento: perfilUser.dataNascimento?.isValid() ? perfilUser.dataNascimento.format(DATE_FORMAT) : undefined,
      criado: perfilUser.criado?.isValid() ? perfilUser.criado.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataNascimento = res.body.dataNascimento ? dayjs(res.body.dataNascimento) : undefined;
      res.body.criado = res.body.criado ? dayjs(res.body.criado) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((perfilUser: IPerfilUser) => {
        perfilUser.dataNascimento = perfilUser.dataNascimento ? dayjs(perfilUser.dataNascimento) : undefined;
        perfilUser.criado = perfilUser.criado ? dayjs(perfilUser.criado) : undefined;
      });
    }
    return res;
  }
}
