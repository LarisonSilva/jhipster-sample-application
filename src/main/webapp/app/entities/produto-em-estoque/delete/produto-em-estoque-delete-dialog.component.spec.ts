jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';

import { ProdutoEmEstoqueDeleteDialogComponent } from './produto-em-estoque-delete-dialog.component';

describe('Component Tests', () => {
  describe('ProdutoEmEstoque Management Delete Component', () => {
    let comp: ProdutoEmEstoqueDeleteDialogComponent;
    let fixture: ComponentFixture<ProdutoEmEstoqueDeleteDialogComponent>;
    let service: ProdutoEmEstoqueService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProdutoEmEstoqueDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ProdutoEmEstoqueDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProdutoEmEstoqueDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProdutoEmEstoqueService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
