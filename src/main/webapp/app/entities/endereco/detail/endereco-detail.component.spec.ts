import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnderecoDetailComponent } from './endereco-detail.component';

describe('Component Tests', () => {
  describe('Endereco Management Detail Component', () => {
    let comp: EnderecoDetailComponent;
    let fixture: ComponentFixture<EnderecoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EnderecoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ endereco: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EnderecoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EnderecoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load endereco on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.endereco).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
