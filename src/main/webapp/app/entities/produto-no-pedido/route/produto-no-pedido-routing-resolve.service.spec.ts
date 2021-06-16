jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProdutoNoPedido, ProdutoNoPedido } from '../produto-no-pedido.model';
import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';

import { ProdutoNoPedidoRoutingResolveService } from './produto-no-pedido-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProdutoNoPedido routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProdutoNoPedidoRoutingResolveService;
    let service: ProdutoNoPedidoService;
    let resultProdutoNoPedido: IProdutoNoPedido | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProdutoNoPedidoRoutingResolveService);
      service = TestBed.inject(ProdutoNoPedidoService);
      resultProdutoNoPedido = undefined;
    });

    describe('resolve', () => {
      it('should return IProdutoNoPedido returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoNoPedido = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProdutoNoPedido).toEqual({ id: 123 });
      });

      it('should return new IProdutoNoPedido if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoNoPedido = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProdutoNoPedido).toEqual(new ProdutoNoPedido());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoNoPedido = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProdutoNoPedido).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
