import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPerfilUser, PerfilUser } from '../perfil-user.model';

import { PerfilUserService } from './perfil-user.service';

describe('Service Tests', () => {
  describe('PerfilUser Service', () => {
    let service: PerfilUserService;
    let httpMock: HttpTestingController;
    let elemDefault: IPerfilUser;
    let expectedResult: IPerfilUser | IPerfilUser[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PerfilUserService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        senha: 'AAAAAAA',
        fotoUrl: 'AAAAAAA',
        cpf: 'AAAAAAA',
        dataNascimento: currentDate,
        criado: currentDate,
        email: 'AAAAAAA',
        contato: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataNascimento: currentDate.format(DATE_FORMAT),
            criado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PerfilUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataNascimento: currentDate.format(DATE_FORMAT),
            criado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
            criado: currentDate,
          },
          returnedFromService
        );

        service.create(new PerfilUser()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PerfilUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            senha: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            cpf: 'BBBBBB',
            dataNascimento: currentDate.format(DATE_FORMAT),
            criado: currentDate.format(DATE_TIME_FORMAT),
            email: 'BBBBBB',
            contato: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
            criado: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PerfilUser', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
            senha: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            cpf: 'BBBBBB',
          },
          new PerfilUser()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
            criado: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PerfilUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            senha: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            cpf: 'BBBBBB',
            dataNascimento: currentDate.format(DATE_FORMAT),
            criado: currentDate.format(DATE_TIME_FORMAT),
            email: 'BBBBBB',
            contato: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
            criado: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PerfilUser', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPerfilUserToCollectionIfMissing', () => {
        it('should add a PerfilUser to an empty array', () => {
          const perfilUser: IPerfilUser = { id: 123 };
          expectedResult = service.addPerfilUserToCollectionIfMissing([], perfilUser);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(perfilUser);
        });

        it('should not add a PerfilUser to an array that contains it', () => {
          const perfilUser: IPerfilUser = { id: 123 };
          const perfilUserCollection: IPerfilUser[] = [
            {
              ...perfilUser,
            },
            { id: 456 },
          ];
          expectedResult = service.addPerfilUserToCollectionIfMissing(perfilUserCollection, perfilUser);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PerfilUser to an array that doesn't contain it", () => {
          const perfilUser: IPerfilUser = { id: 123 };
          const perfilUserCollection: IPerfilUser[] = [{ id: 456 }];
          expectedResult = service.addPerfilUserToCollectionIfMissing(perfilUserCollection, perfilUser);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(perfilUser);
        });

        it('should add only unique PerfilUser to an array', () => {
          const perfilUserArray: IPerfilUser[] = [{ id: 123 }, { id: 456 }, { id: 9591 }];
          const perfilUserCollection: IPerfilUser[] = [{ id: 123 }];
          expectedResult = service.addPerfilUserToCollectionIfMissing(perfilUserCollection, ...perfilUserArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const perfilUser: IPerfilUser = { id: 123 };
          const perfilUser2: IPerfilUser = { id: 456 };
          expectedResult = service.addPerfilUserToCollectionIfMissing([], perfilUser, perfilUser2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(perfilUser);
          expect(expectedResult).toContain(perfilUser2);
        });

        it('should accept null and undefined values', () => {
          const perfilUser: IPerfilUser = { id: 123 };
          expectedResult = service.addPerfilUserToCollectionIfMissing([], null, perfilUser, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(perfilUser);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
