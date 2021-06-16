import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataUtils } from 'app/core/util/data-util.service';

import { ProdutoEmEstoqueDetailComponent } from './produto-em-estoque-detail.component';

describe('Component Tests', () => {
  describe('ProdutoEmEstoque Management Detail Component', () => {
    let comp: ProdutoEmEstoqueDetailComponent;
    let fixture: ComponentFixture<ProdutoEmEstoqueDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProdutoEmEstoqueDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ produtoEmEstoque: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProdutoEmEstoqueDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProdutoEmEstoqueDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
    });

    describe('OnInit', () => {
      it('Should load produtoEmEstoque on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.produtoEmEstoque).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeBase64, fakeContentType);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeBase64, fakeContentType);
      });
    });
  });
});
