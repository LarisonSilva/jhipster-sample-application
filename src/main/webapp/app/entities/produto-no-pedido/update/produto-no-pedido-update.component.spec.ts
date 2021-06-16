jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';
import { IProdutoNoPedido, ProdutoNoPedido } from '../produto-no-pedido.model';
import { IProdutoEmEstoque } from 'app/entities/produto-em-estoque/produto-em-estoque.model';
import { ProdutoEmEstoqueService } from 'app/entities/produto-em-estoque/service/produto-em-estoque.service';
import { IPedido } from 'app/entities/pedido/pedido.model';
import { PedidoService } from 'app/entities/pedido/service/pedido.service';

import { ProdutoNoPedidoUpdateComponent } from './produto-no-pedido-update.component';

describe('Component Tests', () => {
  describe('ProdutoNoPedido Management Update Component', () => {
    let comp: ProdutoNoPedidoUpdateComponent;
    let fixture: ComponentFixture<ProdutoNoPedidoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let produtoNoPedidoService: ProdutoNoPedidoService;
    let produtoEmEstoqueService: ProdutoEmEstoqueService;
    let pedidoService: PedidoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProdutoNoPedidoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProdutoNoPedidoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProdutoNoPedidoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      produtoNoPedidoService = TestBed.inject(ProdutoNoPedidoService);
      produtoEmEstoqueService = TestBed.inject(ProdutoEmEstoqueService);
      pedidoService = TestBed.inject(PedidoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ProdutoEmEstoque query and add missing value', () => {
        const produtoNoPedido: IProdutoNoPedido = { id: 456 };
        const produtoEmEstoque: IProdutoEmEstoque = { id: 39136 };
        produtoNoPedido.produtoEmEstoque = produtoEmEstoque;

        const produtoEmEstoqueCollection: IProdutoEmEstoque[] = [{ id: 90071 }];
        spyOn(produtoEmEstoqueService, 'query').and.returnValue(of(new HttpResponse({ body: produtoEmEstoqueCollection })));
        const additionalProdutoEmEstoques = [produtoEmEstoque];
        const expectedCollection: IProdutoEmEstoque[] = [...additionalProdutoEmEstoques, ...produtoEmEstoqueCollection];
        spyOn(produtoEmEstoqueService, 'addProdutoEmEstoqueToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        expect(produtoEmEstoqueService.query).toHaveBeenCalled();
        expect(produtoEmEstoqueService.addProdutoEmEstoqueToCollectionIfMissing).toHaveBeenCalledWith(
          produtoEmEstoqueCollection,
          ...additionalProdutoEmEstoques
        );
        expect(comp.produtoEmEstoquesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Pedido query and add missing value', () => {
        const produtoNoPedido: IProdutoNoPedido = { id: 456 };
        const pedido: IPedido = { id: 61500 };
        produtoNoPedido.pedido = pedido;

        const pedidoCollection: IPedido[] = [{ id: 77956 }];
        spyOn(pedidoService, 'query').and.returnValue(of(new HttpResponse({ body: pedidoCollection })));
        const additionalPedidos = [pedido];
        const expectedCollection: IPedido[] = [...additionalPedidos, ...pedidoCollection];
        spyOn(pedidoService, 'addPedidoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        expect(pedidoService.query).toHaveBeenCalled();
        expect(pedidoService.addPedidoToCollectionIfMissing).toHaveBeenCalledWith(pedidoCollection, ...additionalPedidos);
        expect(comp.pedidosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const produtoNoPedido: IProdutoNoPedido = { id: 456 };
        const produtoEmEstoque: IProdutoEmEstoque = { id: 96555 };
        produtoNoPedido.produtoEmEstoque = produtoEmEstoque;
        const pedido: IPedido = { id: 62697 };
        produtoNoPedido.pedido = pedido;

        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(produtoNoPedido));
        expect(comp.produtoEmEstoquesSharedCollection).toContain(produtoEmEstoque);
        expect(comp.pedidosSharedCollection).toContain(pedido);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoNoPedido = { id: 123 };
        spyOn(produtoNoPedidoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produtoNoPedido }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(produtoNoPedidoService.update).toHaveBeenCalledWith(produtoNoPedido);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoNoPedido = new ProdutoNoPedido();
        spyOn(produtoNoPedidoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produtoNoPedido }));
        saveSubject.complete();

        // THEN
        expect(produtoNoPedidoService.create).toHaveBeenCalledWith(produtoNoPedido);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoNoPedido = { id: 123 };
        spyOn(produtoNoPedidoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoNoPedido });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(produtoNoPedidoService.update).toHaveBeenCalledWith(produtoNoPedido);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProdutoEmEstoqueById', () => {
        it('Should return tracked ProdutoEmEstoque primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProdutoEmEstoqueById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPedidoById', () => {
        it('Should return tracked Pedido primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPedidoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
