import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProdutoEmEstoqueService } from '../service/produto-em-estoque.service';

import { ProdutoEmEstoqueComponent } from './produto-em-estoque.component';

describe('Component Tests', () => {
  describe('ProdutoEmEstoque Management Component', () => {
    let comp: ProdutoEmEstoqueComponent;
    let fixture: ComponentFixture<ProdutoEmEstoqueComponent>;
    let service: ProdutoEmEstoqueService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProdutoEmEstoqueComponent],
      })
        .overrideTemplate(ProdutoEmEstoqueComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProdutoEmEstoqueComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProdutoEmEstoqueService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.produtoEmEstoques?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
