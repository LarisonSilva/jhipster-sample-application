import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEndereco, getEnderecoIdentifier } from '../endereco.model';

export type EntityResponseType = HttpResponse<IEndereco>;
export type EntityArrayResponseType = HttpResponse<IEndereco[]>;

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/enderecos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(endereco: IEndereco): Observable<EntityResponseType> {
    return this.http.post<IEndereco>(this.resourceUrl, endereco, { observe: 'response' });
  }

  update(endereco: IEndereco): Observable<EntityResponseType> {
    return this.http.put<IEndereco>(`${this.resourceUrl}/${getEnderecoIdentifier(endereco) as number}`, endereco, { observe: 'response' });
  }

  partialUpdate(endereco: IEndereco): Observable<EntityResponseType> {
    return this.http.patch<IEndereco>(`${this.resourceUrl}/${getEnderecoIdentifier(endereco) as number}`, endereco, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEndereco>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEndereco[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEnderecoToCollectionIfMissing(enderecoCollection: IEndereco[], ...enderecosToCheck: (IEndereco | null | undefined)[]): IEndereco[] {
    const enderecos: IEndereco[] = enderecosToCheck.filter(isPresent);
    if (enderecos.length > 0) {
      const enderecoCollectionIdentifiers = enderecoCollection.map(enderecoItem => getEnderecoIdentifier(enderecoItem)!);
      const enderecosToAdd = enderecos.filter(enderecoItem => {
        const enderecoIdentifier = getEnderecoIdentifier(enderecoItem);
        if (enderecoIdentifier == null || enderecoCollectionIdentifiers.includes(enderecoIdentifier)) {
          return false;
        }
        enderecoCollectionIdentifiers.push(enderecoIdentifier);
        return true;
      });
      return [...enderecosToAdd, ...enderecoCollection];
    }
    return enderecoCollection;
  }
}
