import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProdutoNoPedido, ProdutoNoPedido } from '../produto-no-pedido.model';

import { ProdutoNoPedidoService } from './produto-no-pedido.service';

describe('Service Tests', () => {
  describe('ProdutoNoPedido Service', () => {
    let service: ProdutoNoPedidoService;
    let httpMock: HttpTestingController;
    let elemDefault: IProdutoNoPedido;
    let expectedResult: IProdutoNoPedido | IProdutoNoPedido[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProdutoNoPedidoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        quantidade: 0,
        preco: 0,
        criado: currentDate,
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

      it('should create a ProdutoNoPedido', () => {
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

        service.create(new ProdutoNoPedido()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProdutoNoPedido', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantidade: 1,
            preco: 1,
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

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProdutoNoPedido', () => {
        const patchObject = Object.assign(
          {
            quantidade: 1,
            criado: currentDate.format(DATE_TIME_FORMAT),
          },
          new ProdutoNoPedido()
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

      it('should return a list of ProdutoNoPedido', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantidade: 1,
            preco: 1,
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

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ProdutoNoPedido', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProdutoNoPedidoToCollectionIfMissing', () => {
        it('should add a ProdutoNoPedido to an empty array', () => {
          const produtoNoPedido: IProdutoNoPedido = { id: 123 };
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing([], produtoNoPedido);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(produtoNoPedido);
        });

        it('should not add a ProdutoNoPedido to an array that contains it', () => {
          const produtoNoPedido: IProdutoNoPedido = { id: 123 };
          const produtoNoPedidoCollection: IProdutoNoPedido[] = [
            {
              ...produtoNoPedido,
            },
            { id: 456 },
          ];
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing(produtoNoPedidoCollection, produtoNoPedido);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProdutoNoPedido to an array that doesn't contain it", () => {
          const produtoNoPedido: IProdutoNoPedido = { id: 123 };
          const produtoNoPedidoCollection: IProdutoNoPedido[] = [{ id: 456 }];
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing(produtoNoPedidoCollection, produtoNoPedido);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(produtoNoPedido);
        });

        it('should add only unique ProdutoNoPedido to an array', () => {
          const produtoNoPedidoArray: IProdutoNoPedido[] = [{ id: 123 }, { id: 456 }, { id: 41669 }];
          const produtoNoPedidoCollection: IProdutoNoPedido[] = [{ id: 123 }];
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing(produtoNoPedidoCollection, ...produtoNoPedidoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const produtoNoPedido: IProdutoNoPedido = { id: 123 };
          const produtoNoPedido2: IProdutoNoPedido = { id: 456 };
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing([], produtoNoPedido, produtoNoPedido2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(produtoNoPedido);
          expect(expectedResult).toContain(produtoNoPedido2);
        });

        it('should accept null and undefined values', () => {
          const produtoNoPedido: IProdutoNoPedido = { id: 123 };
          expectedResult = service.addProdutoNoPedidoToCollectionIfMissing([], null, produtoNoPedido, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(produtoNoPedido);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
