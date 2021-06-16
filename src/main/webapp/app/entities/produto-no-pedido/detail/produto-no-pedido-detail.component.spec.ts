import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProdutoNoPedidoDetailComponent } from './produto-no-pedido-detail.component';

describe('Component Tests', () => {
  describe('ProdutoNoPedido Management Detail Component', () => {
    let comp: ProdutoNoPedidoDetailComponent;
    let fixture: ComponentFixture<ProdutoNoPedidoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProdutoNoPedidoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ produtoNoPedido: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProdutoNoPedidoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProdutoNoPedidoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load produtoNoPedido on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.produtoNoPedido).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
