import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PerfilUserDetailComponent } from './perfil-user-detail.component';

describe('Component Tests', () => {
  describe('PerfilUser Management Detail Component', () => {
    let comp: PerfilUserDetailComponent;
    let fixture: ComponentFixture<PerfilUserDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PerfilUserDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ perfilUser: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PerfilUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PerfilUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load perfilUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.perfilUser).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
