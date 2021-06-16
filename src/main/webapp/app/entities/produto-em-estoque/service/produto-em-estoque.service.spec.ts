import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProdutoEmEstoque, ProdutoEmEstoque } from '../produto-em-estoque.model';

import { ProdutoEmEstoqueService } from './produto-em-estoque.service';

describe('Service Tests', () => {
  describe('ProdutoEmEstoque Service', () => {
    let service: ProdutoEmEstoqueService;
    let httpMock: HttpTestingController;
    let elemDefault: IProdutoEmEstoque;
    let expectedResult: IProdutoEmEstoque | IProdutoEmEstoque[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProdutoEmEstoqueService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        descricao: 'AAAAAAA',
        fotoUrl: 'AAAAAAA',
        sku: 'AAAAAAA',
        ean: 'AAAAAAA',
        criado: currentDate,
        preco: 0,
        precoPromocional: 0,
        totalEstoque: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            criado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ProdutoEmEstoque', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            criado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            criado: currentDate,
          },
          returnedFromService
        );

        service.create(new ProdutoEmEstoque()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProdutoEmEstoque', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            sku: 'BBBBBB',
            ean: 'BBBBBB',
            criado: currentDate.format(DATE_TIME_FORMAT),
            preco: 1,
            precoPromocional: 1,
            totalEstoque: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            criado: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProdutoEmEstoque', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            sku: 'BBBBBB',
            ean: 'BBBBBB',
            criado: currentDate.format(DATE_TIME_FORMAT),
            preco: 1,
            precoPromocional: 1,
          },
          new ProdutoEmEstoque()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            criado: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProdutoEmEstoque', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            descricao: 'BBBBBB',
            fotoUrl: 'BBBBBB',
            sku: 'BBBBBB',
            ean: 'BBBBBB',
            criado: currentDate.format(DATE_TIME_FORMAT),
            preco: 1,
            precoPromocional: 1,
            totalEstoque: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
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

      it('should delete a ProdutoEmEstoque', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProdutoEmEstoqueToCollectionIfMissing', () => {
        it('should add a ProdutoEmEstoque to an empty array', () => {
          const produtoEmEstoque: IProdutoEmEstoque = { id: 123 };
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing([], produtoEmEstoque);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(produtoEmEstoque);
        });

        it('should not add a ProdutoEmEstoque to an array that contains it', () => {
          const produtoEmEstoque: IProdutoEmEstoque = { id: 123 };
          const produtoEmEstoqueCollection: IProdutoEmEstoque[] = [
            {
              ...produtoEmEstoque,
            },
            { id: 456 },
          ];
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing(produtoEmEstoqueCollection, produtoEmEstoque);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProdutoEmEstoque to an array that doesn't contain it", () => {
          const produtoEmEstoque: IProdutoEmEstoque = { id: 123 };
          const produtoEmEstoqueCollection: IProdutoEmEstoque[] = [{ id: 456 }];
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing(produtoEmEstoqueCollection, produtoEmEstoque);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(produtoEmEstoque);
        });

        it('should add only unique ProdutoEmEstoque to an array', () => {
          const produtoEmEstoqueArray: IProdutoEmEstoque[] = [{ id: 123 }, { id: 456 }, { id: 20406 }];
          const produtoEmEstoqueCollection: IProdutoEmEstoque[] = [{ id: 123 }];
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing(produtoEmEstoqueCollection, ...produtoEmEstoqueArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const produtoEmEstoque: IProdutoEmEstoque = { id: 123 };
          const produtoEmEstoque2: IProdutoEmEstoque = { id: 456 };
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing([], produtoEmEstoque, produtoEmEstoque2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(produtoEmEstoque);
          expect(expectedResult).toContain(produtoEmEstoque2);
        });

        it('should accept null and undefined values', () => {
          const produtoEmEstoque: IProdutoEmEstoque = { id: 123 };
          expectedResult = service.addProdutoEmEstoqueToCollectionIfMissing([], null, produtoEmEstoque, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(produtoEmEstoque);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
