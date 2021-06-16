jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPerfilUser, PerfilUser } from '../perfil-user.model';
import { PerfilUserService } from '../service/perfil-user.service';

import { PerfilUserRoutingResolveService } from './perfil-user-routing-resolve.service';

describe('Service Tests', () => {
  describe('PerfilUser routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PerfilUserRoutingResolveService;
    let service: PerfilUserService;
    let resultPerfilUser: IPerfilUser | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PerfilUserRoutingResolveService);
      service = TestBed.inject(PerfilUserService);
      resultPerfilUser = undefined;
    });

    describe('resolve', () => {
      it('should return IPerfilUser returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPerfilUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPerfilUser).toEqual({ id: 123 });
      });

      it('should return new IPerfilUser if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPerfilUser = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPerfilUser).toEqual(new PerfilUser());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPerfilUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPerfilUser).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
