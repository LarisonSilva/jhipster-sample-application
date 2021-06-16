jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';
import { IProdutoEmEstoque, ProdutoEmEstoque } from '../produto-em-estoque.model';

import { ProdutoEmEstoqueUpdateComponent } from './produto-em-estoque-update.component';

describe('Component Tests', () => {
  describe('ProdutoEmEstoque Management Update Component', () => {
    let comp: ProdutoEmEstoqueUpdateComponent;
    let fixture: ComponentFixture<ProdutoEmEstoqueUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let produtoEmEstoqueService: ProdutoEmEstoqueService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProdutoEmEstoqueUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProdutoEmEstoqueUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProdutoEmEstoqueUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      produtoEmEstoqueService = TestBed.inject(ProdutoEmEstoqueService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const produtoEmEstoque: IProdutoEmEstoque = { id: 456 };

        activatedRoute.data = of({ produtoEmEstoque });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(produtoEmEstoque));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoEmEstoque = { id: 123 };
        spyOn(produtoEmEstoqueService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoEmEstoque });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produtoEmEstoque }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(produtoEmEstoqueService.update).toHaveBeenCalledWith(produtoEmEstoque);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoEmEstoque = new ProdutoEmEstoque();
        spyOn(produtoEmEstoqueService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoEmEstoque });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produtoEmEstoque }));
        saveSubject.complete();

        // THEN
        expect(produtoEmEstoqueService.create).toHaveBeenCalledWith(produtoEmEstoque);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produtoEmEstoque = { id: 123 };
        spyOn(produtoEmEstoqueService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produtoEmEstoque });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(produtoEmEstoqueService.update).toHaveBeenCalledWith(produtoEmEstoque);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
