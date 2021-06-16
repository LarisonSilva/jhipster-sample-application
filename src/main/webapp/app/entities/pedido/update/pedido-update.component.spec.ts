jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PedidoService } from '../service/pedido.service';
import { IPedido, Pedido } from '../pedido.model';
import { IPerfilUser } from 'app/entities/perfil-user/perfil-user.model';
import { PerfilUserService } from 'app/entities/perfil-user/service/perfil-user.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

import { PedidoUpdateComponent } from './pedido-update.component';

describe('Component Tests', () => {
  describe('Pedido Management Update Component', () => {
    let comp: PedidoUpdateComponent;
    let fixture: ComponentFixture<PedidoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pedidoService: PedidoService;
    let perfilUserService: PerfilUserService;
    let enderecoService: EnderecoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PedidoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PedidoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PedidoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pedidoService = TestBed.inject(PedidoService);
      perfilUserService = TestBed.inject(PerfilUserService);
      enderecoService = TestBed.inject(EnderecoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call PerfilUser query and add missing value', () => {
        const pedido: IPedido = { id: 456 };
        const perfilUser: IPerfilUser = { id: 68000 };
        pedido.perfilUser = perfilUser;

        const perfilUserCollection: IPerfilUser[] = [{ id: 1711 }];
        spyOn(perfilUserService, 'query').and.returnValue(of(new HttpResponse({ body: perfilUserCollection })));
        const additionalPerfilUsers = [perfilUser];
        const expectedCollection: IPerfilUser[] = [...additionalPerfilUsers, ...perfilUserCollection];
        spyOn(perfilUserService, 'addPerfilUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        expect(perfilUserService.query).toHaveBeenCalled();
        expect(perfilUserService.addPerfilUserToCollectionIfMissing).toHaveBeenCalledWith(perfilUserCollection, ...additionalPerfilUsers);
        expect(comp.perfilUsersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Endereco query and add missing value', () => {
        const pedido: IPedido = { id: 456 };
        const endereco: IEndereco = { id: 99969 };
        pedido.endereco = endereco;

        const enderecoCollection: IEndereco[] = [{ id: 16667 }];
        spyOn(enderecoService, 'query').and.returnValue(of(new HttpResponse({ body: enderecoCollection })));
        const additionalEnderecos = [endereco];
        const expectedCollection: IEndereco[] = [...additionalEnderecos, ...enderecoCollection];
        spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        expect(enderecoService.query).toHaveBeenCalled();
        expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, ...additionalEnderecos);
        expect(comp.enderecosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pedido: IPedido = { id: 456 };
        const perfilUser: IPerfilUser = { id: 61560 };
        pedido.perfilUser = perfilUser;
        const endereco: IEndereco = { id: 61489 };
        pedido.endereco = endereco;

        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pedido));
        expect(comp.perfilUsersSharedCollection).toContain(perfilUser);
        expect(comp.enderecosSharedCollection).toContain(endereco);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pedido = { id: 123 };
        spyOn(pedidoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pedido }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pedidoService.update).toHaveBeenCalledWith(pedido);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pedido = new Pedido();
        spyOn(pedidoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pedido }));
        saveSubject.complete();

        // THEN
        expect(pedidoService.create).toHaveBeenCalledWith(pedido);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pedido = { id: 123 };
        spyOn(pedidoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pedidoService.update).toHaveBeenCalledWith(pedido);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPerfilUserById', () => {
        it('Should return tracked PerfilUser primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPerfilUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackEnderecoById', () => {
        it('Should return tracked Endereco primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEnderecoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
