import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { AndamentoPedido } from 'app/entities/enumerations/andamento-pedido.model';
import { IPedido, Pedido } from '../pedido.model';

import { PedidoService } from './pedido.service';

describe('Service Tests', () => {
  describe('Pedido Service', () => {
    let service: PedidoService;
    let httpMock: HttpTestingController;
    let elemDefault: IPedido;
    let expectedResult: IPedido | IPedido[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PedidoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        efetuado: currentDate,
        status: AndamentoPedido.AGUARDANDO_PAGAMENTO,
        precoTotal: 0,
        comentarios: 'AAAAAAA',
        codigoPagamento: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            efetuado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Pedido', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            efetuado: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            efetuado: currentDate,
          },
          returnedFromService
        );

        service.create(new Pedido()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Pedido', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            efetuado: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            precoTotal: 1,
            comentarios: 'BBBBBB',
            codigoPagamento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            efetuado: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Pedido', () => {
        const patchObject = Object.assign(
          {
            status: 'BBBBBB',
            precoTotal: 1,
          },
          new Pedido()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            efetuado: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Pedido', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            efetuado: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            precoTotal: 1,
            comentarios: 'BBBBBB',
            codigoPagamento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            efetuado: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Pedido', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPedidoToCollectionIfMissing', () => {
        it('should add a Pedido to an empty array', () => {
          const pedido: IPedido = { id: 123 };
          expectedResult = service.addPedidoToCollectionIfMissing([], pedido);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pedido);
        });

        it('should not add a Pedido to an array that contains it', () => {
          const pedido: IPedido = { id: 123 };
          const pedidoCollection: IPedido[] = [
            {
              ...pedido,
            },
            { id: 456 },
          ];
          expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, pedido);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Pedido to an array that doesn't contain it", () => {
          const pedido: IPedido = { id: 123 };
          const pedidoCollection: IPedido[] = [{ id: 456 }];
          expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, pedido);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pedido);
        });

        it('should add only unique Pedido to an array', () => {
          const pedidoArray: IPedido[] = [{ id: 123 }, { id: 456 }, { id: 18027 }];
          const pedidoCollection: IPedido[] = [{ id: 123 }];
          expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, ...pedidoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const pedido: IPedido = { id: 123 };
          const pedido2: IPedido = { id: 456 };
          expectedResult = service.addPedidoToCollectionIfMissing([], pedido, pedido2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pedido);
          expect(expectedResult).toContain(pedido2);
        });

        it('should accept null and undefined values', () => {
          const pedido: IPedido = { id: 123 };
          expectedResult = service.addPedidoToCollectionIfMissing([], null, pedido, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pedido);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
