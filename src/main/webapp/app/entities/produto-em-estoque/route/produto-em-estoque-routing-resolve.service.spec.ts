jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProdutoEmEstoque, ProdutoEmEstoque } from '../produto-em-estoque.model';
import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';

import { ProdutoEmEstoqueRoutingResolveService } from './produto-em-estoque-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProdutoEmEstoque routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProdutoEmEstoqueRoutingResolveService;
    let service: ProdutoEmEstoqueService;
    let resultProdutoEmEstoque: IProdutoEmEstoque | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProdutoEmEstoqueRoutingResolveService);
      service = TestBed.inject(ProdutoEmEstoqueService);
      resultProdutoEmEstoque = undefined;
    });

    describe('resolve', () => {
      it('should return IProdutoEmEstoque returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoEmEstoque = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProdutoEmEstoque).toEqual({ id: 123 });
      });

      it('should return new IProdutoEmEstoque if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoEmEstoque = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProdutoEmEstoque).toEqual(new ProdutoEmEstoque());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProdutoEmEstoque = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProdutoEmEstoque).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
