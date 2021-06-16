import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PerfilUserService } from '../service/perfil-user.service';

import { PerfilUserComponent } from './perfil-user.component';

describe('Component Tests', () => {
  describe('PerfilUser Management Component', () => {
    let comp: PerfilUserComponent;
    let fixture: ComponentFixture<PerfilUserComponent>;
    let service: PerfilUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PerfilUserComponent],
      })
        .overrideTemplate(PerfilUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PerfilUserComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PerfilUserService);

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
      expect(comp.perfilUsers?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
