import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProdutoNoPedidoService } from '../service/produto-no-pedido.service';

import { ProdutoNoPedidoComponent } from './produto-no-pedido.component';

describe('Component Tests', () => {
  describe('ProdutoNoPedido Management Component', () => {
    let comp: ProdutoNoPedidoComponent;
    let fixture: ComponentFixture<ProdutoNoPedidoComponent>;
    let service: ProdutoNoPedidoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProdutoNoPedidoComponent],
      })
        .overrideTemplate(ProdutoNoPedidoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProdutoNoPedidoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProdutoNoPedidoService);

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
      expect(comp.produtoNoPedidos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
